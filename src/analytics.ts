const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// ブラウザの`window`にGA4用の機能が存在することをTypeScriptに教示
// 通常はwindow.documentやwindow.locationなどしかないが、dataLayerやgtagを追加する
// declare global で既存のブラウザのWindow型へ情報を追加
declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics() {
  if (!import.meta.env.PROD || !MEASUREMENT_ID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    // gtag.js公式形式ではargumentsオブジェクトをdataLayerへ渡す
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;

  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);
}

export function trackWorksheetGenerated() {
  if (!import.meta.env.PROD || !MEASUREMENT_ID) {
    return;
  }

  window.gtag?.("event", "worksheet_generated");
}

type PrintEventParams = {
  typeId: string;
  pageCount: number;
  questionsPerPage: number;
  totalQuestions: number;
  includeAnswers: boolean;
};

export function trackPrintClicked(params: PrintEventParams) {
  if (!import.meta.env.PROD || !MEASUREMENT_ID) {
    return;
  }

  window.gtag?.("event", "print_clicked", {
    type_id: params.typeId,
    page_count: params.pageCount,
    questions_per_page: params.questionsPerPage,
    total_questions: params.totalQuestions,
    include_answers: params.includeAnswers,
  });
}
