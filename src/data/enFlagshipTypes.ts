// 英語検索からの入口として、代表的な単元だけ英語の説明を持たせる
export type EnFlagshipType = {
  slug: string;
  typeId: string;
  titleEn: string;
  descriptionEn: string;
  // 実際に生成される問題文の言語について、正直に伝える一言
  // (足し算などは数式だけだが、文章題は日本語のまま生成される)
  worksheetNote: string;
};

const noJapaneseNote =
  "The worksheet itself uses plain numbers and symbols — no Japanese required.";

export const enFlagshipTypes: EnFlagshipType[] = [
  {
    slug: "addition",
    typeId: "e1-addition",
    titleEn: "Addition Worksheets (Grade 1)",
    descriptionEn:
      "Single-digit addition practice for early elementary students. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
  {
    slug: "subtraction",
    typeId: "e1-subtraction",
    titleEn: "Subtraction Worksheets (Grade 1)",
    descriptionEn:
      "Single-digit subtraction practice for early elementary students. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
  {
    slug: "multiplication-table",
    typeId: "e2-multiplication-table",
    titleEn: "Multiplication Table Worksheets",
    descriptionEn:
      "Times table practice covering all rows. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
  {
    slug: "chicken-and-rabbit-problem",
    typeId: "exam-crane-turtle",
    titleEn: "Chicken and Rabbit Problem Worksheets",
    descriptionEn:
      "Classic entrance-exam style word problems (known in Japan as \"crane and turtle\" problems). A fresh set of problems every time, with an answer key included.",
    worksheetNote:
      "The generated worksheet text is in Japanese (the standard style for this problem type), but the underlying math is universal.",
  },
  {
    slug: "multiplication",
    typeId: "e3-multiplication",
    titleEn: "Multiplication Worksheets (Grade 3)",
    descriptionEn:
      "2-digit by 1-digit multiplication practice for elementary students. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
  {
    slug: "division",
    typeId: "e4-division",
    titleEn: "Division Worksheets (Grade 4)",
    descriptionEn:
      "Division by 2-digit numbers with no remainder, for elementary students. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
  {
    slug: "fractions",
    typeId: "e2-simple-fraction",
    titleEn: "Fraction Worksheets (Grade 2)",
    descriptionEn:
      "An introduction to fractions — naming one equal part of a whole. A fresh set of problems every time, with an answer key included.",
    worksheetNote:
      "The generated worksheet text includes short Japanese phrases (a simple word-problem format), but the underlying math is universal.",
  },
  {
    slug: "decimals",
    typeId: "e4-decimals",
    titleEn: "Decimal Worksheets (Grade 4)",
    descriptionEn:
      "Addition and subtraction of decimals to the hundredths place, for elementary students. A fresh set of problems every time, with an answer key included.",
    worksheetNote: noJapaneseNote,
  },
];

export function getEnFlagshipType(slug: string): EnFlagshipType | undefined {
  return enFlagshipTypes.find((type) => type.slug === slug);
}
