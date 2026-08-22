import math from "../assets/subjects-img/math.webp";
import english from "../assets/subjects-img/english.webp";
import japanese from "../assets/subjects-img/japanese.webp";
import science from "../assets/subjects-img/science.webp";
import socialStudies from "../assets/subjects-img/social-studies.webp";
import ai from "../assets/subjects-img/ai.webp";

import elementary from "../assets/grades-img/elementary-school.webp";
import juniorHigh from "../assets/grades-img/junior-high-school.webp";
import highSchool from "../assets/grades-img/high-school.webp";
import university from "../assets/grades-img/university.webp";

// webpファイルの画像URLを簡単な名前で取得できる箱を用意
// 毎回画像パスをインポートしないで済む

// 科目画像のURLを取得し簡単な名前で呼び出せるように
export const subjectCardImages = {
  math,
  english,
  japanese,
  science,
  socialStudies,
  ai,
};

// 学校区分画像のURLを取得し簡単な名前で呼び出せるように
export const gradeCardImages = {
  elementary,
  juniorHigh,
  highSchool,
  university,
};
