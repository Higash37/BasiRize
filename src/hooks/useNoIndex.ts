import { useEffect } from "react";

// 検索結果に出したくないページで呼ぶ。マウント中だけrobotsメタタグを差し込む
export function useNoIndex(): void {
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.append(robots);

    return () => {
      robots.remove();
    };
  }, []);
}
