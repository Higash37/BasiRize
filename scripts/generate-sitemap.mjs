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

// content-selectページが実際に受け付ける学年区分
// (src/problem-generation/types.tsのLevel型と一致させる)
const LEVELS = ["小学校", "中学校", "高校"];

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
    return { getProblemTypes, enFlagshipTypes };
  } finally {
    await server.close();
  }
}

async function main() {
  const { getProblemTypes, enFlagshipTypes } = await loadRegistries();

  const paths = [
    "/",
    "/grade-select",
    ...LEVELS.map(
      (level) => `/content-select?level=${encodeURIComponent(level)}`,
    ),
    "/en",
    ...enFlagshipTypes.map((type) => `/en/worksheets/${type.slug}`),
    ...getProblemTypes().map((type) => `/problems/${type.id}`),
  ];

  const today = new Date().toISOString().slice(0, 10);
  const urlEntries = paths
    .map(
      (p) =>
        `  <url><loc>${PRODUCTION_ORIGIN}${p}</loc><lastmod>${today}</lastmod></url>`,
    )
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
