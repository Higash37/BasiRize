import { useEffect } from "react";

type DocumentMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
};

export function useDocumentMetadata(metadata?: DocumentMetadata): void {
  const title = metadata?.title;
  const descriptionContent = metadata?.description;
  const canonicalPath = metadata?.canonicalPath;

  useEffect(() => {
    if (!title || !descriptionContent || !canonicalPath) {
      return;
    }

    const previousTitle = document.title;
    document.title = title;

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
    canonical.href = new URL(canonicalPath, window.location.origin).href;

    return () => {
      document.title = previousTitle;
      description.content = previousDescription;

      if (existingCanonical) {
        canonical.href = previousCanonical;
      } else {
        canonical.remove();
      }
    };
  }, [canonicalPath, descriptionContent, title]);
}

function getOrCreateElement<T extends Element>(
  selector: string,
  create: () => T,
): T {
  return document.head.querySelector<T>(selector) ?? create();
}
