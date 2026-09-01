// public/sitemap.xmlを、問題タイプの台帳(src/problem-generation)と
// 英語版ページの台帳(src/data/enFlagshipTypes.ts)から生成する。
// 単元を追加したときにsitemap.xmlへの追記を忘れる、というズレを防ぐのが目的。
//
// .tsファイルをNodeで直接importするとenum等で壊れやすいため、
// Viteのビルド用変換パイプライン(ssrLoadModule)を使って読み込む。
import { createServer } from "vite";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const PRODUCTION_ORIGIN = "https://basirise.com";

async function loadRegistries() {
  const server = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  try {
    const { getProblemTypes } = await server.ssrLoadModule(
      "/src/problem-generation/index.ts",
    );
    const { enFlagshipTypes } = await server.ssrLoadModule(
      "/src/data/enFlagshipTypes.ts",
    );
    const { SEO_LEVELS, SEO_GRADES, getLevelPath, getGradePath } =
      await server.ssrLoadModule("/src/seoRoutes.ts");
    return {
      getProblemTypes,
      enFlagshipTypes,
      SEO_LEVELS,
      SEO_GRADES,
      getLevelPath,
      getGradePath,
    };
  } finally {
    await server.close();
  }
}

async function main() {
  const {
    getProblemTypes,
    enFlagshipTypes,
    SEO_LEVELS,
    SEO_GRADES,
    getLevelPath,
    getGradePath,
  } = await loadRegistries();

  const paths = [
    "/",
    "/grade-select",
    ...SEO_LEVELS.map(getLevelPath),
    ...SEO_GRADES.map(({ level, grade }) => getGradePath(level, grade)),
    "/en",
    ...enFlagshipTypes.map((type) => `/en/worksheets/${type.slug}`),
    ...getProblemTypes().map((type) => `/problems/${type.id}`),
  ];

  const urlEntries = paths
    // 実際の更新日を追跡していないためlastmodは付けない。
    // ビルド日を入れると、内容が変わっていない全URLを更新済みと誤って伝えてしまう。
    .map((p) => `  <url><loc>${PRODUCTION_ORIGIN}${p}</loc></url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  const outPath = path.join(rootDir, "public", "sitemap.xml");
  await writeFile(outPath, xml, "utf-8");
  console.log(`sitemap.xml生成完了: ${paths.length}件`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
