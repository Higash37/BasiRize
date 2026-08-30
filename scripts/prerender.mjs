// ビルド後、実際にヘッドレスブラウザでURLを開いて描画済みHTMLをdist/に書き出す。
// これにより、JSを実行しないクローラーにも中身入りのHTMLを返せるようにする。
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preview } from "vite";
import { chromium } from "playwright";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(rootDir, "dist");

async function getPathsFromSitemap() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const xml = await readFile(sitemapPath, "utf-8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

  return urls
    .map((url) => new URL(url))
    .filter((url) => url.search === "") // クエリパラメータ付きは1ファイルに定まらないので対象外
    .map((url) => url.pathname);
}

async function main() {
  const paths = await getPathsFromSitemap();
  console.log(`prerender対象: ${paths.length}ページ`);

  const server = await preview({ preview: { port: 4173, strictPort: false } });
  const base = server.resolvedUrls.local[0].replace(/\/$/, "");

  const browser = await chromium.launch();

  // 先にdist/index.htmlを書き換えてしまうと、vite previewのSPAフォールバックが
  // 「まだ処理していない他のページ」にもその描画済みindex.htmlを返してしまい、
  // hreflangなどが別ページに混入するバグになる。そのため書き込みは全ページ分
  // クロールし終えてからまとめて行う
  const results = [];

  for (const pathname of paths) {
    const page = await browser.newPage();
    await page.goto(`${base}${pathname}`, { waitUntil: "networkidle" });
    // React描画・useEffectでのmetaタグ設定が確実に終わるのを待つ
    await page.waitForTimeout(150);

    const html = await page.content();
    const outFile =
      pathname === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, pathname.replace(/^\//, ""), "index.html");

    results.push({ outFile, html });
    await page.close();
  }

  await browser.close();
  await server.httpServer.close();

  for (const { outFile, html } of results) {
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html);
  }

  console.log(`prerender完了: ${paths.length}ページ`);
}

if (!existsSync(distDir)) {
  console.error("distが見つかりません。先に vite build を実行してください。");
  process.exit(1);
}

main();
