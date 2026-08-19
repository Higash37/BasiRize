const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

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
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;

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