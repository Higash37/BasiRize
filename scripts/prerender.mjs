// ビルド後、各URLに対応するhead情報と検索エンジンが読める本文を
// dist/index.htmlのテンプレートに文字列として埋め込み、dist/内に書き出す。
// 本物のブラウザは使わない（Renderのビルド環境はapt-get等でシステムライブラリを
// 追加できず、ヘッドレスChromiumの起動に必要な共有ライブラリが揃わなかったため）。
// React本体はブラウザ起動後にcreateRootで描画し直す。ここで入れる本文は、JavaScriptを
// 実行しないクローラーにもページ固有の見出し・説明・内部リンクを渡すためのもの。
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

// HomePage.tsxのHOME_FAQと同じ内容
const HOME_FAQ = [
  {
    question: "無料で使えますか？",
    answer: "はい。会員登録なしで、無料でお使いいただけます。",
  },
  {
    question: "塾の授業や宿題で配布してもいいですか？",
    answer:
      "はい。生成したプリントは印刷して、授業や宿題としてお使いいただけます。",
  },
  {
    question: "同じ問題が続けて出ないようにできますか？",
    answer:
      "生成のたびに数値をランダムに変えているので、毎回ちがう問題になります。",
  },
  {
    question: "印刷以外にPDFで保存できますか？",
    answer: "はい。プレビュー画面の印刷から、PDFとして保存できます。",
  },
  {
    question: "対応している学年を教えてください",
    answer:
      "小学校・中学校・高校の算数・数学に対応しています。学年ごとの単元は上の一覧からご確認いただけます。",
  },
];

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
  const seoRoutes = await server.ssrLoadModule("/src/seoRoutes.ts");

  await server.close();
  return { registry, enFlagshipTypes, seoRoutes };
}

// 各ページのuseDocumentMetadata呼び出しと同じ内容をNode側で組み立てる
function resolveMetadata(pathname, { registry, enFlagshipTypes, seoRoutes }) {
  if (pathname === "/") {
    return {
      title: "算数・数学プリントを今すぐ自動生成【小学校〜高校】| math²ドリル",
      description:
        "「あと5分で欲しい」に応える、塾講師・家庭学習向けの算数・数学プリント生成サイト。学年と単元を選ぶだけで、毎回新しい問題をランダム生成。宿題・小テスト対策にも、今すぐ印刷・PDF保存できます。",
      canonicalPath: "/",
      alternates: [
        { hreflang: "ja", path: "/" },
        { hreflang: "en", path: "/en" },
        { hreflang: "x-default", path: "/" },
      ],
      faq: HOME_FAQ,
    };
  }

  if (pathname === "/grade-select") {
    return {
      title: "学年を選んで算数・数学の問題プリントを作成 | math²ドリル",
      description:
        "小学校・中学校・高校から学年区分を選び、条件に合った算数・数学の問題プリントをすぐに作成できます。",
      canonicalPath: "/grade-select",
    };
  }

  const gradeMatch = pathname.match(/^\/math\/([^/]+)\/([^/]+)$/);
  if (gradeMatch) {
    const level = seoRoutes.getLevelFromSlug(gradeMatch[1]);
    const grade = level
      ? seoRoutes.getGradeFromSlug(level, gradeMatch[2])
      : undefined;
    const problemTypes =
      level && grade
        ? registry.getProblemTypes(level).filter((type) => type.grade === grade)
        : [];
    if (!level || !grade || problemTypes.length === 0) {
      return undefined;
    }
    const gradeSeoContent = seoRoutes.getGradeSeoContent(
      level,
      grade,
      problemTypes.map((type) => type.title),
    );
    return {
      ...gradeSeoContent,
      canonicalPath: seoRoutes.getGradePath(level, grade),
      breadcrumbs: [
        { name: "数学", path: "/" },
        { name: level, path: seoRoutes.getLevelPath(level) },
        { name: grade, path: seoRoutes.getGradePath(level, grade) },
      ],
    };
  }

  const levelMatch = pathname.match(/^\/math\/([^/]+)$/);
  if (levelMatch) {
    const level = seoRoutes.getLevelFromSlug(levelMatch[1]);
    if (!level) {
      return undefined;
    }
    const levelSeoContent = seoRoutes.getLevelSeoContent(level);
    return {
      title: levelSeoContent.title,
      description: levelSeoContent.description,
      heading: levelSeoContent.heading,
      introduction: levelSeoContent.introduction,
      canonicalPath: seoRoutes.getLevelPath(level),
      breadcrumbs: [
        { name: "数学", path: "/" },
        { name: level, path: seoRoutes.getLevelPath(level) },
      ],
    };
  }

  if (pathname === "/en") {
    return {
      title: "Free Math Worksheet Generator | Math² Drill",
      description:
        "Generate free, printable math worksheets instantly. A fresh set of problems every time, from basic arithmetic to junior-high entrance-exam word problems.",
      canonicalPath: "/en",
      lang: "en",
      alternates: [
        { hreflang: "en", path: "/en" },
        { hreflang: "ja", path: "/" },
        { hreflang: "x-default", path: "/" },
      ],
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
      title: `${flagshipType.titleEn} | Math² Drill`,
      description: flagshipType.descriptionEn,
      canonicalPath: `/en/worksheets/${flagshipType.slug}`,
      lang: "en",
      alternates: [
        {
          hreflang: "en",
          path: `/en/worksheets/${flagshipType.slug}`,
        },
        { hreflang: "ja", path: `/problems/${problemType.id}` },
      ],
      breadcrumbs: [
        { name: "Math² Drill", path: "/en" },
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
      title: `${problemType.grade}・${problemType.title}の無料問題プリント | math²ドリル`,
      description: problemType.description,
      canonicalPath: `/problems/${problemType.id}`,
      alternates: enFlagship
        ? [
            { hreflang: "ja", path: `/problems/${problemType.id}` },
            { hreflang: "en", path: `/en/worksheets/${enFlagship.slug}` },
          ]
        : undefined,
      breadcrumbs: [
        { name: "数学", path: "/" },
        {
          name: problemType.level,
          path: seoRoutes.getLevelPath(problemType.level),
        },
        {
          name: problemType.grade,
          path: seoRoutes.getGradePath(problemType.level, problemType.grade),
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

function linkList(items) {
  return `<ul>${items
    .map(
      ({ label, path }) =>
        `<li><a href="${escapeHtml(path)}">${escapeHtml(label)}</a></li>`,
    )
    .join("")}</ul>`;
}

function faqHtml(items) {
  return items
    .map(
      ({ question, answer }) =>
        `<h2>${escapeHtml(question)}</h2><p>${escapeHtml(answer)}</p>`,
    )
    .join("");
}

// Reactを実行しない検索クローラーにも、ページごとに固有の本文と内部リンクを渡す。
function renderStaticContent(pathname, seoData, metadata) {
  const { registry, enFlagshipTypes, seoRoutes } = seoData;
  let links = [];
  let intro = metadata.description;

  if (pathname === "/") {
    links = [
      ...seoRoutes.SEO_LEVELS.map((level) => ({
        label: `${level}の算数・数学プリント`,
        path: seoRoutes.getLevelPath(level),
      })),
      { label: "Free Math Worksheets (English)", path: "/en" },
    ];
  } else if (pathname === "/grade-select") {
    links = seoRoutes.SEO_LEVELS.map((level) => ({
      label: level,
      path: seoRoutes.getLevelPath(level),
    }));
  } else if (pathname === "/en") {
    links = enFlagshipTypes.enFlagshipTypes.map((type) => ({
      label: type.titleEn,
      path: `/en/worksheets/${type.slug}`,
    }));
  } else {
    const levelMatch = pathname.match(/^\/math\/([^/]+)$/);
    const level = levelMatch
      ? seoRoutes.getLevelFromSlug(levelMatch[1])
      : undefined;
    if (level) {
      intro = metadata.introduction ?? metadata.description;
      links = seoRoutes.SEO_GRADES.filter(
        (gradeRoute) => gradeRoute.level === level,
      ).map((gradeRoute) => ({
        label: `${gradeRoute.displayName}の問題プリント`,
        path: seoRoutes.getGradePath(level, gradeRoute.grade),
      }));
    }

    const gradeMatch = pathname.match(/^\/math\/([^/]+)\/([^/]+)$/);
    const gradeLevel = gradeMatch
      ? seoRoutes.getLevelFromSlug(gradeMatch[1])
      : undefined;
    const grade = gradeLevel
      ? seoRoutes.getGradeFromSlug(gradeLevel, gradeMatch[2])
      : undefined;
    if (gradeLevel && grade) {
      intro = metadata.introduction ?? metadata.description;
      links = registry
        .getProblemTypes(gradeLevel)
        .filter((type) => type.grade === grade)
        .map((type) => ({
          label: `${type.grade} ${type.title}`,
          path: `/problems/${type.id}`,
        }));
    }

    const problemMatch = pathname.match(/^\/problems\/([^/]+)$/);
    const problemType = problemMatch
      ? registry.getProblemTypeById(problemMatch[1])
      : undefined;
    if (problemType) {
      intro = `${problemType.description} 学年と単元に合った問題を毎回新しく生成し、解答付きで印刷・PDF保存できます。`;
      const relatedTypes = registry
        .getProblemTypes(problemType.level)
        .filter(
          (type) =>
            type.grade === problemType.grade && type.id !== problemType.id,
        )
        .slice(0, 6);
      links = [
        ...relatedTypes.map((type) => ({
          label: `${problemType.grade} ${type.title}`,
          path: `/problems/${type.id}`,
        })),
        {
          label: `${problemType.grade}の問題プリント一覧`,
          path: seoRoutes.getGradePath(problemType.level, problemType.grade),
        },
      ];
    }

    const worksheetMatch = pathname.match(/^\/en\/worksheets\/([^/]+)$/);
    const worksheet = worksheetMatch
      ? enFlagshipTypes.getEnFlagshipType(worksheetMatch[1])
      : undefined;
    if (worksheet) {
      links = [
        { label: "All free math worksheets", path: "/en" },
        {
          label: "Generate and print this worksheet",
          path: `/problems/${worksheet.typeId}`,
        },
      ];
    }
  }

  const heading =
    metadata.heading ??
    metadata.title.replace(/\s*\|\s*(math²ドリル|Math² Drill)$/, "");
  const faqSection = pathname === "/" ? faqHtml(HOME_FAQ) : "";
  return `<main data-prerendered-content><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(intro)}</p>${linkList(links)}${faqSection}</main>`;
}

function injectMetadata(template, metadata, staticContent) {
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
    html = html.replace(
      /<html lang="[^"]*">/,
      `<html lang="${metadata.lang}">`,
    );
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
    ["og:site_name", "math²ドリル"],
    ["og:locale", metadata.lang === "en" ? "en_US" : "ja_JP"],
    ["og:image", OG_IMAGE_URL],
    ["og:image:alt", "math²ドリルのロゴ"],
    ["twitter:card", "summary"],
    ["twitter:title", metadata.title],
    ["twitter:description", metadata.description],
    ["twitter:image", OG_IMAGE_URL],
  ];
  for (const [property, content] of ogTags) {
    const attribute = property.startsWith("twitter:") ? "name" : "property";
    extraTags.push(
      `<meta ${attribute}="${property}" content="${escapeHtml(content)}" />`,
    );
  }

  const webPageJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: metadata.title,
    description: metadata.description,
    url: canonicalUrl,
    inLanguage: metadata.lang === "en" ? "en" : "ja",
    isPartOf: {
      "@type": "WebSite",
      name: "math²ドリル",
      url: PRODUCTION_ORIGIN,
    },
  });
  extraTags.push(
    `<script type="application/ld+json" data-schema="web-page">${webPageJson}</script>`,
  );

  if (metadata.breadcrumbs?.length) {
    const json = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: metadata.breadcrumbs.map(
        ({ name, path: itemPath }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          item: absoluteUrl(itemPath),
        }),
      ),
    });
    extraTags.push(
      `<script type="application/ld+json" data-schema="breadcrumb-list">${json}</script>`,
    );
  }

  if (metadata.faq?.length) {
    const json = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: metadata.faq.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    });
    extraTags.push(
      `<script type="application/ld+json" data-schema="faq-page">${json}</script>`,
    );
  }

  html = html.replace("</head>", `${extraTags.join("\n    ")}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${staticContent}</div>`,
  );

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

    const staticContent = renderStaticContent(pathname, seoData, metadata);
    const html = injectMetadata(template, metadata, staticContent);
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
