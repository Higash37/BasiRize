// ビルド後、各URLに対応するtitle/description/canonical/hreflang/OGP/パンくずJSON-LDを
// dist/index.htmlのテンプレートに文字列として埋め込み、dist/内に書き出す。
// 本物のブラウザは使わない（Renderのビルド環境はapt-get等でシステムライブラリを
// 追加できず、ヘッドレスChromiumの起動に必要な共有ライブラリが揃わなかったため）。
// ページ本文まではここでは描画しない。狙いはクローラー向けの<head>タグの充実であり、
// 本文はこれまで通りクライアント側のReactが描画する。
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, "dist");

// useDocumentMetadata.tsと同じ値。canonical等のURLは実行環境のホスト名に
// 依存させず、常に本番ドメイン基準で組み立てる
const PRODUCTION_ORIGIN = "https://basirise.com";

// useDocumentMetadata.tsと同じ値
const OG_IMAGE_URL = new URL("/basirize-favicon.png", PRODUCTION_ORIGIN).href;

async function getPathsFromSitemap() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const xml = await readFile(sitemapPath, "utf-8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  return urls
    .map((url) => new URL(url))
    .filter((url) => url.search === "") // クエリパラメータ付きは1ファイルに定まらないので対象外
    .map((url) => url.pathname);
}

// src/problem-generation・src/dataは素のTypeScriptなので、Viteのモジュール変換を
// 通してNode側から読み込む（ブラウザ実行やReactは一切使わない）
async function loadSeoData() {
  const server = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: "custom",
  });

  const registry = await server.ssrLoadModule(
    "/src/problem-generation/registry.ts",
  );
  const enFlagshipTypes = await server.ssrLoadModule(
    "/src/data/enFlagshipTypes.ts",
  );

  await server.close();
  return { registry, enFlagshipTypes };
}

// 各ページのuseDocumentMetadata呼び出しと同じ内容をNode側で組み立てる
function resolveMetadata(pathname, { registry, enFlagshipTypes }) {
  if (pathname === "/") {
    return {
      title: "算数・数学プリントを今すぐ自動生成【小学校〜高校】| BasiRize",
      description:
        "「あと5分で欲しい」に応える算数・数学プリント生成サイト。学年と単元を選ぶだけで、毎回新しい問題をランダム生成。小学校から高校まで対応、今すぐ印刷・PDF保存できます。",
      canonicalPath: "/",
      alternates: [{ hreflang: "en", path: "/en" }],
    };
  }

  if (pathname === "/grade-select") {
    return {
      title: "学年を選んで算数・数学の問題プリントを作成 | BasiRize",
      description:
        "小学校・中学校・高校から学年区分を選び、条件に合った算数・数学の問題プリントをすぐに作成できます。",
      canonicalPath: "/grade-select",
    };
  }

  if (pathname === "/en") {
    return {
      title: "Free Math Worksheet Generator | BasiRize",
      description:
        "Generate free, printable math worksheets instantly. A fresh set of problems every time, from basic arithmetic to junior-high entrance-exam word problems.",
      canonicalPath: "/en",
      lang: "en",
      alternates: [{ hreflang: "ja", path: "/" }],
    };
  }

  const enWorksheetMatch = pathname.match(/^\/en\/worksheets\/([^/]+)$/);
  if (enWorksheetMatch) {
    const slug = enWorksheetMatch[1];
    const flagshipType = enFlagshipTypes.getEnFlagshipType(slug);
    const problemType = flagshipType
      ? registry.getProblemTypeById(flagshipType.typeId)
      : undefined;
    if (!flagshipType || !problemType) {
      return undefined;
    }
    return {
      title: `${flagshipType.titleEn} | BasiRize`,
      description: flagshipType.descriptionEn,
      canonicalPath: `/en/worksheets/${flagshipType.slug}`,
      lang: "en",
      alternates: [{ hreflang: "ja", path: `/problems/${problemType.id}` }],
      breadcrumbs: [
        { name: "BasiRize", path: "/en" },
        {
          name: flagshipType.titleEn,
          path: `/en/worksheets/${flagshipType.slug}`,
        },
      ],
    };
  }

  const problemMatch = pathname.match(/^\/problems\/([^/]+)$/);
  if (problemMatch) {
    const problemType = registry.getProblemTypeById(problemMatch[1]);
    if (!problemType) {
      return undefined;
    }
    const enFlagship = enFlagshipTypes.enFlagshipTypes.find(
      (type) => type.typeId === problemType.id,
    );
    return {
      title: `${problemType.grade}・${problemType.title}の無料問題プリント | BasiRize`,
      description: problemType.description,
      canonicalPath: `/problems/${problemType.id}`,
      alternates: enFlagship
        ? [{ hreflang: "en", path: `/en/worksheets/${enFlagship.slug}` }]
        : undefined,
      breadcrumbs: [
        { name: "数学", path: "/" },
        {
          name: problemType.level,
          path: `/content-select?level=${problemType.level}`,
        },
        { name: problemType.title, path: `/problems/${problemType.id}` },
      ],
    };
  }

  return undefined;
}

function absoluteUrl(pathname) {
  return new URL(pathname, PRODUCTION_ORIGIN).href;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function injectMetadata(template, metadata) {
  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(metadata.title)}</title>`,
  );

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
  );

  if (metadata.lang) {
    html = html.replace(/<html lang="[^"]*">/, `<html lang="${metadata.lang}">`);
  }

  const canonicalUrl = absoluteUrl(metadata.canonicalPath);
  const extraTags = [`<link rel="canonical" href="${canonicalUrl}" />`];

  for (const { hreflang, path: altPath } of metadata.alternates ?? []) {
    extraTags.push(
      `<link rel="alternate" hreflang="${hreflang}" href="${absoluteUrl(altPath)}" />`,
    );
  }

  const ogTags = [
    ["og:title", metadata.title],
    ["og:description", metadata.description],
    ["og:url", canonicalUrl],
    ["og:type", "website"],
    ["og:site_name", "BasiRize"],
    ["og:image", OG_IMAGE_URL],
    ["og:image:alt", "BasiRizeのロゴ"],
    ["twitter:card", "summary"],
    ["twitter:title", metadata.title],
    ["twitter:description", metadata.description],
    ["twitter:image", OG_IMAGE_URL],
  ];
  for (const [property, content] of ogTags) {
    extraTags.push(
      `<meta property="${property}" content="${escapeHtml(content)}" />`,
    );
  }

  if (metadata.breadcrumbs?.length) {
    const json = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: metadata.breadcrumbs.map(({ name, path: itemPath }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        item: absoluteUrl(itemPath),
      })),
    });
    extraTags.push(
      `<script type="application/ld+json" data-schema="breadcrumb-list">${json}</script>`,
    );
  }

  html = html.replace("</head>", `${extraTags.join("\n    ")}\n  </head>`);

  return html;
}

async function main() {
  const paths = await getPathsFromSitemap();
  console.log(`prerender対象: ${paths.length}ページ`);

  const seoData = await loadSeoData();
  const template = await readFile(path.join(distDir, "index.html"), "utf-8");

  let generated = 0;
  for (const pathname of paths) {
    const metadata = resolveMetadata(pathname, seoData);
    if (!metadata) {
      console.warn(`メタデータを特定できずスキップ: ${pathname}`);
      continue;
    }

    const html = injectMetadata(template, metadata);
    const outFile =
      pathname === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, pathname.replace(/^\//, ""), "index.html");

    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html);
    generated += 1;
  }

  console.log(`prerender完了: ${generated}ページ`);
}

if (!existsSync(distDir)) {
  console.error("distが見つかりません。先に vite build を実行してください。");
  process.exit(1);
}

main();
