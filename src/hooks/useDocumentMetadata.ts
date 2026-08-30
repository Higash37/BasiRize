import { useEffect } from "react";

// canonical/hreflang/OGP/パンくずのURLは常に本番ドメイン基準で組み立てる。
// window.location.originを使うと、prerender時(localhost:4173)やプレビュー環境の
// ホスト名がそのままURLに焼き込まれてしまうため
const PRODUCTION_ORIGIN = "https://basirise.com";

type LanguageAlternate = {
  hreflang: string;
  path: string;
};

type Breadcrumb = {
  name: string;
  path: string;
};

type DocumentMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  lang?: string;
  alternates?: LanguageAlternate[];
  breadcrumbs?: Breadcrumb[];
};

export function useDocumentMetadata(metadata?: DocumentMetadata): void {
  const title = metadata?.title;
  const descriptionContent = metadata?.description;
  const canonicalPath = metadata?.canonicalPath;
  const lang = metadata?.lang;
  const alternates = metadata?.alternates;
  const breadcrumbs = metadata?.breadcrumbs;

  useEffect(() => {
    if (!title || !descriptionContent || !canonicalPath) {
      return;
    }

    const previousTitle = document.title;
    document.title = title;

    const previousLang = document.documentElement.lang;
    if (lang) {
      document.documentElement.lang = lang;
    }

    const description = getOrCreateElement('meta[name="description"]', () => {
      const element = document.createElement("meta");
      element.name = "description";
      document.head.append(element);
      return element;
    });
    const previousDescription = description.content;
    description.content = descriptionContent;

    const existingCanonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const canonical = getOrCreateElement('link[rel="canonical"]', () => {
      const element = document.createElement("link");
      element.rel = "canonical";
      document.head.append(element);
      return element;
    });
    const previousCanonical = canonical.href;
    canonical.href = new URL(canonicalPath, PRODUCTION_ORIGIN).href;

    // 言語違いの同内容ページがあれば、hreflangで結び付けて検索エンジンに伝える
    // prerenderで既に同じhreflangのタグがhead内にある場合があるため、既存タグを再利用する
    const alternateLinks = (alternates ?? []).map(({ hreflang, path }) => {
      const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
      const element = getOrCreateElement<HTMLLinkElement>(selector, () => {
        const created = document.createElement("link");
        created.rel = "alternate";
        created.hreflang = hreflang;
        document.head.append(created);
        return created;
      });
      element.href = new URL(path, PRODUCTION_ORIGIN).href;
      return element;
    });

    // SNS共有時にタイトル・説明文が正しく出るよう、OGP/Twitterカードも
    // title/descriptionと同じ内容で出す（画像は未整備なので付けていない）
    const canonicalUrl = canonical.href;
    const ogTags: [string, string][] = [
      ["og:title", title],
      ["og:description", descriptionContent],
      ["og:url", canonicalUrl],
      ["og:type", "website"],
      ["og:site_name", "BasiRize"],
      ["twitter:card", "summary"],
      ["twitter:title", title],
      ["twitter:description", descriptionContent],
    ];
    // prerenderで既に同じproperty値のタグがhead内にある場合があるため、
    // description/canonicalと同様に既存タグを再利用し重複させない
    const ogElements = ogTags.map(([property, content]) => {
      const selector = `meta[property="${property}"]`;
      const existingOg = document.head.querySelector<HTMLMetaElement>(selector);
      const element = existingOg ?? (() => {
        const created = document.createElement("meta");
        created.setAttribute("property", property);
        document.head.append(created);
        return created;
      })();
      const previousContent = existingOg?.getAttribute("content") ?? null;
      element.setAttribute("content", content);
      return { element, existed: existingOg !== null, previousContent };
    });

    // パンくずをGoogleにも伝え、検索結果でのページ位置表示に使ってもらう
    // prerenderで既に同じ内容のscriptがhead内にある場合があるため、既存タグを再利用する
    const breadcrumbScript = breadcrumbs?.length
      ? (() => {
          const element = getOrCreateElement<HTMLScriptElement>(
            'script[data-schema="breadcrumb-list"]',
            () => {
              const created = document.createElement("script");
              created.type = "application/ld+json";
              created.dataset.schema = "breadcrumb-list";
              document.head.append(created);
              return created;
            },
          );
          element.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map(({ name, path }, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name,
              item: new URL(path, PRODUCTION_ORIGIN).href,
            })),
          });
          return element;
        })()
      : undefined;

    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLang;
      description.content = previousDescription;

      if (existingCanonical) {
        canonical.href = previousCanonical;
      } else {
        canonical.remove();
      }

      for (const element of alternateLinks) {
        element.remove();
      }

      for (const { element, existed, previousContent } of ogElements) {
        if (existed && previousContent !== null) {
          element.setAttribute("content", previousContent);
        } else {
          element.remove();
        }
      }

      breadcrumbScript?.remove();
    };
  }, [canonicalPath, descriptionContent, title, lang, alternates, breadcrumbs]);
}

function getOrCreateElement<T extends Element>(
  selector: string,
  create: () => T,
): T {
  return document.head.querySelector<T>(selector) ?? create();
}
