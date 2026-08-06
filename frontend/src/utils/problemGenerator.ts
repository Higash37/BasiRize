// 学年ごとの問題生成ロジック（TypeScript版のプロトタイプ）
// バックエンド(Spring Boot)がまだ無いので、一旦フロントエンドだけで完結する形で
// 問題を生成する。将来的にはバックエンドAPIに置き換える想定。

export type Problem = {
  question: string;
  answer: string;
};

export type Level = "小学校" | "中学校" | "高校";

export type ProblemType = {
  id: string;
  level: Level;
  grade: string;
  title: string;
  description: string;
  icon: string;
  generate: (count: number) => Problem[];
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---- 基本的な四則演算（小学校〜中1の正負の数まで、幅広く使い回す） ----

type BasicArithmeticOptions = {
  min: number;
  max: number;
  operations: ("+" | "-" | "×" | "÷")[];
  allowNegative?: boolean;
  termCount?: number;
};

function generateBasicArithmetic(count: number, options: BasicArithmeticOptions): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  const termCount = options.termCount ?? 2;

  while (problems.length < count) {
    const numbers: number[] = [];
    const ops: string[] = [];
    for (let i = 0; i < termCount; i++) {
      numbers.push(randomInt(options.min, options.max));
    }
    for (let i = 0; i < termCount - 1; i++) {
      ops.push(options.operations[randomInt(0, options.operations.length - 1)]);
    }

    // わり算のときは割り切れる組み合わせに調整する
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "÷") {
        const divisor = randomInt(Math.max(1, options.min), options.max) || 1;
        const quotient = randomInt(Math.max(1, options.min), options.max);
        numbers[i] = divisor * quotient;
        numbers[i + 1] = divisor;
      }
    }

    let result = numbers[0];
    let question = `${numbers[0]}`;
    for (let i = 0; i < ops.length; i++) {
      question += ` ${ops[i]} ${numbers[i + 1]}`;
      if (ops[i] === "+") result += numbers[i + 1];
      else if (ops[i] === "-") result -= numbers[i + 1];
      else if (ops[i] === "×") result *= numbers[i + 1];
      else if (ops[i] === "÷") result /= numbers[i + 1];
    }

    if (!options.allowNegative && result < 0) continue;
    question += " = ?";
    if (seen.has(question)) continue;
    seen.add(question);
    problems.push({ question, answer: String(result) });
  }

  return problems;
}

// ---- 文字式（同類項をまとめる） ----

function generateLikeTermsProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    const op = Math.random() < 0.5 ? "+" : "-";
    const question = `${a}x ${op} ${b}x = ?`;
    if (seen.has(question)) continue;
    seen.add(question);
    const result = op === "+" ? a + b : a - b;
    const answer = result === 0 ? "0" : `${result}x`;
    problems.push({ question, answer });
  }
  return problems;
}

// ---- 一次方程式 ----

function generateLinearEquationProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const x = randomInt(-10, 10);
    const a = randomInt(1, 9);
    const b = randomInt(-10, 10);
    const right = a * x + b;
    const bTerm = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const question = `${a}x ${bTerm} = ${right} のとき、x = ?`;
    if (seen.has(question)) continue;
    seen.add(question);
    problems.push({ question, answer: String(x) });
  }
  return problems;
}

// ---- 連立方程式 ----

function generateSimultaneousEquationProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const x = randomInt(-9, 9);
    const y = randomInt(-9, 9);
    const a1 = randomInt(1, 5);
    const b1 = randomInt(1, 5);
    const a2 = randomInt(1, 5);
    const b2 = randomInt(1, 5);
    if (a1 * b2 === a2 * b1) continue; // 解が定まらない組み合わせを避ける
    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x - b2 * y;
    const question = `${a1}x + ${b1}y = ${c1}, ${a2}x - ${b2}y = ${c2} のとき、x, y = ?`;
    if (seen.has(question)) continue;
    seen.add(question);
    problems.push({ question, answer: `x = ${x}, y = ${y}` });
  }
  return problems;
}

// ---- 展開・因数分解（(x+p)(x+q)の形） ----

function formatQuadratic(b: number, c: number): string {
  const bTerm = b === 0 ? "" : b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`;
  const cTerm = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
  return `x²${bTerm}${cTerm}`;
}

function generateExpansionProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const p = randomInt(-9, 9);
    const q = randomInt(-9, 9);
    if (p === 0 || q === 0) continue;
    const pTerm = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
    const qTerm = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
    const question = `(x ${pTerm})(x ${qTerm}) を展開すると？`;
    if (seen.has(question)) continue;
    seen.add(question);
    problems.push({ question, answer: formatQuadratic(p + q, p * q) });
  }
  return problems;
}

function generateFactoringProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const p = randomInt(-9, 9);
    const q = randomInt(-9, 9);
    if (p === 0 || q === 0) continue;
    const question = `${formatQuadratic(p + q, p * q)} を因数分解すると？`;
    if (seen.has(question)) continue;
    seen.add(question);
    const pTerm = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
    const qTerm = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
    problems.push({ question, answer: `(x ${pTerm})(x ${qTerm})` });
  }
  return problems;
}

// ---- 平方根（同類項の平方根版） ----

function generateSquareRootProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const a = randomInt(2, 10);
    const k = randomInt(2, 5);
    const question = `√${a} × ${k} = ?`;
    if (seen.has(question)) continue;
    seen.add(question);
    problems.push({ question, answer: `${k}√${a}` });
  }
  return problems;
}

// ---- 二次方程式（因数分解できる形） ----

function generateQuadraticEquationProblems(count: number): Problem[] {
  const problems: Problem[] = [];
  const seen = new Set<string>();
  while (problems.length < count) {
    const r1 = randomInt(-9, 9);
    const r2 = randomInt(-9, 9);
    if (r1 === 0 && r2 === 0) continue;
    const question = `${formatQuadratic(-(r1 + r2), r1 * r2)} = 0 のとき、x = ?`;
    if (seen.has(question)) continue;
    seen.add(question);
    const roots = r1 === r2 ? `${r1}` : [r1, r2].sort((a, b) => a - b).join(", ");
    problems.push({ question, answer: `x = ${roots}` });
  }
  return problems;
}

// ---- 学年ごとの問題タイプ一覧 ----
// 注: 小5・小6の分数/小数は、正確な分数表現の実装が別途必要なため
// このプロトタイプでは整数の四則ミックスで代用している（今後の課題）。

export const problemTypes: ProblemType[] = [
  {
    id: "e1-add-sub",
    level: "小学校",
    grade: "小1",
    title: "たし算・ひき算（くり上がりなし）",
    description: "1桁どうしのたし算・ひき算",
    icon: "➕",
    generate: (count) => generateBasicArithmetic(count, { min: 1, max: 9, operations: ["+", "-"], allowNegative: false }),
  },
  {
    id: "e2-add-sub-carry",
    level: "小学校",
    grade: "小2",
    title: "たし算・ひき算（くり上がり・くり下がりあり）",
    description: "2桁どうしのたし算・ひき算",
    icon: "➕",
    generate: (count) => generateBasicArithmetic(count, { min: 10, max: 99, operations: ["+", "-"], allowNegative: false }),
  },
  {
    id: "e2-multiplication-table",
    level: "小学校",
    grade: "小2",
    title: "かけ算九九",
    description: "1〜9のかけ算",
    icon: "✖️",
    generate: (count) => generateBasicArithmetic(count, { min: 1, max: 9, operations: ["×"], allowNegative: false }),
  },
  {
    id: "e3-multiplication-division",
    level: "小学校",
    grade: "小3",
    title: "かけ算・わり算",
    description: "2桁までのかけ算・わり算（あまりなし）",
    icon: "➗",
    generate: (count) => generateBasicArithmetic(count, { min: 2, max: 20, operations: ["×", "÷"], allowNegative: false }),
  },
  {
    id: "e4-mixed",
    level: "小学校",
    grade: "小4",
    title: "四則混合（3口の計算）",
    description: "たし算・ひき算・かけ算・わり算を組み合わせた計算",
    icon: "🔢",
    generate: (count) => generateBasicArithmetic(count, { min: 1, max: 50, operations: ["+", "-", "×", "÷"], allowNegative: false, termCount: 3 }),
  },
  {
    id: "e5-mixed-advanced",
    level: "小学校",
    grade: "小5",
    title: "四則混合（発展）",
    description: "大きめの数を使った四則混合計算",
    icon: "🔢",
    generate: (count) => generateBasicArithmetic(count, { min: 1, max: 100, operations: ["+", "-", "×", "÷"], allowNegative: false, termCount: 3 }),
  },
  {
    id: "e6-mixed-final",
    level: "小学校",
    grade: "小6",
    title: "四則混合（総まとめ）",
    description: "小学校の四則計算の総まとめ",
    icon: "🔢",
    generate: (count) => generateBasicArithmetic(count, { min: 1, max: 120, operations: ["+", "-", "×", "÷"], allowNegative: false, termCount: 3 }),
  },
  {
    id: "j1-signed-numbers",
    level: "中学校",
    grade: "中1",
    title: "正負の数の計算",
    description: "マイナスを含む四則計算",
    icon: "➖",
    generate: (count) => generateBasicArithmetic(count, { min: -20, max: 20, operations: ["+", "-", "×"], allowNegative: true, termCount: 2 }),
  },
  {
    id: "j1-like-terms",
    level: "中学校",
    grade: "中1",
    title: "文字式（同類項をまとめる）",
    description: "axの形の文字式の加減",
    icon: "🔤",
    generate: (count) => generateLikeTermsProblems(count),
  },
  {
    id: "j2-linear-equation",
    level: "中学校",
    grade: "中2",
    title: "一次方程式",
    description: "ax + b = c の形の方程式を解く",
    icon: "🔤",
    generate: (count) => generateLinearEquationProblems(count),
  },
  {
    id: "j2-simultaneous-equations",
    level: "中学校",
    grade: "中2",
    title: "連立方程式",
    description: "2つの式からx, yを求める",
    icon: "🔤",
    generate: (count) => generateSimultaneousEquationProblems(count),
  },
  {
    id: "j3-expansion",
    level: "中学校",
    grade: "中3",
    title: "式の展開",
    description: "(x+p)(x+q)の形を展開する",
    icon: "🧮",
    generate: (count) => generateExpansionProblems(count),
  },
  {
    id: "j3-factoring",
    level: "中学校",
    grade: "中3",
    title: "因数分解",
    description: "x²+bx+cの形を因数分解する",
    icon: "🧮",
    generate: (count) => generateFactoringProblems(count),
  },
  {
    id: "j3-quadratic-equation",
    level: "中学校",
    grade: "中3",
    title: "二次方程式",
    description: "因数分解できる二次方程式を解く",
    icon: "📐",
    generate: (count) => generateQuadraticEquationProblems(count),
  },
  {
    id: "h1-square-root",
    level: "高校",
    grade: "高1",
    title: "平方根の計算",
    description: "同じ根号をまとめる計算",
    icon: "√",
    generate: (count) => generateSquareRootProblems(count),
  },
  {
    id: "h1-factoring-advanced",
    level: "高校",
    grade: "高1",
    title: "因数分解（発展）",
    description: "中学より広い範囲の係数での因数分解",
    icon: "🧮",
    generate: (count) => generateFactoringProblems(count),
  },
  {
    id: "h1-quadratic-equation",
    level: "高校",
    grade: "高1",
    title: "二次方程式",
    description: "因数分解できる二次方程式を解く",
    icon: "📐",
    generate: (count) => generateQuadraticEquationProblems(count),
  },
];

export function getProblemTypesForLevel(level: Level): ProblemType[] {
  return problemTypes.filter((type) => type.level === level);
}

export function getProblemTypeById(id: string): ProblemType | undefined {
  return problemTypes.find((type) => type.id === id);
}
