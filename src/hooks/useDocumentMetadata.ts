import { useEffect } from "react";

// canonical/hreflang/OGP/パンくずのURLは常に本番ドメイン基準で組み立てる。
// window.location.originを使うと、prerender時(localhost:4173)やプレビュー環境の
// ホスト名がそのままURLに焼き込まれてしまうため
const PRODUCTION_ORIGIN = "https://basirise.com";

// SNS共有時のサムネイル。専用画像はまだ用意していないため、既存のアイコンを流用する
const OG_IMAGE_URL = new URL("/basirize-favicon.png", PRODUCTION_ORIGIN).href;

type LanguageAlternate = {
  hreflang: string;
  path: string;
};

type Breadcrumb = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type DocumentMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  lang?: string;
  alternates?: LanguageAlternate[];
  breadcrumbs?: Breadcrumb[];
  faq?: FaqItem[];
};

export function useDocumentMetadata(metadata?: DocumentMetadata): void {
  const title = metadata?.title;
  const descriptionContent = metadata?.description;
  const canonicalPath = metadata?.canonicalPath;
  const lang = metadata?.lang;
  const alternates = metadata?.alternates;
  const breadcrumbs = metadata?.breadcrumbs;
  const faq = metadata?.faq;

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

    // SNS共有時にタイトル・説明文・サムネイルが正しく出るよう、
    // OGP/Twitterカードもtitle/descriptionと同じ内容で出す
    const canonicalUrl = canonical.href;
    const ogTags: [string, string][] = [
      ["og:title", title],
      ["og:description", descriptionContent],
      ["og:url", canonicalUrl],
      ["og:type", "website"],
      ["og:site_name", "BasiRize"],
      ["og:locale", lang === "en" ? "en_US" : "ja_JP"],
      ["og:image", OG_IMAGE_URL],
      ["og:image:alt", "BasiRizeのロゴ"],
      // ロゴ画像(正方形)なので、横長を想定するsummary_large_imageではなくsummaryにする
      ["twitter:card", "summary"],
      ["twitter:title", title],
      ["twitter:description", descriptionContent],
      ["twitter:image", OG_IMAGE_URL],
    ];
    // prerenderで既に同じproperty値のタグがhead内にある場合があるため、
    // description/canonicalと同様に既存タグを再利用し重複させない
    const ogElements = ogTags.map(([property, content]) => {
      const attribute = property.startsWith("twitter:") ? "name" : "property";
      const selector = `meta[${attribute}="${property}"]`;
      const existingOg = document.head.querySelector<HTMLMetaElement>(selector);
      const element =
        existingOg ??
        (() => {
          const created = document.createElement("meta");
          created.setAttribute(attribute, property);
          document.head.append(created);
          return created;
        })();
      const previousContent = existingOg?.getAttribute("content") ?? null;
      element.setAttribute("content", content);
      return { element, existed: existingOg !== null, previousContent };
    });

    const webPageScript = getOrCreateElement<HTMLScriptElement>(
      'script[data-schema="web-page"]',
      () => {
        const created = document.createElement("script");
        created.type = "application/ld+json";
        created.dataset.schema = "web-page";
        document.head.append(created);
        return created;
      },
    );
    webPageScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: descriptionContent,
      url: canonicalUrl,
      inLanguage: lang === "en" ? "en" : "ja",
      isPartOf: {
        "@type": "WebSite",
        name: "BasiRize",
        url: PRODUCTION_ORIGIN,
      },
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

    // FAQセクションがあるページでは、検索結果にQ&Aがそのまま出る可能性があるFAQPageも伝える
    const faqScript = faq?.length
      ? (() => {
          const element = getOrCreateElement<HTMLScriptElement>(
            'script[data-schema="faq-page"]',
            () => {
              const created = document.createElement("script");
              created.type = "application/ld+json";
              created.dataset.schema = "faq-page";
              document.head.append(created);
              return created;
            },
          );
          element.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
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

      webPageScript.remove();
      breadcrumbScript?.remove();
      faqScript?.remove();
    };
  }, [
    canonicalPath,
    descriptionContent,
    title,
    lang,
    alternates,
    breadcrumbs,
    faq,
  ]);
}

function getOrCreateElement<T extends Element>(
  selector: string,
  create: () => T,
): T {
  return document.head.querySelector<T>(selector) ?? create();
}
