package com.basirize;

import java.util.Random;

// ============================================================
// 一次方程式（LinearEquationGenerator）
// ============================================================
// 中1の内容（学習指導要領では一元一次方程式は中1）。
//
//   3x + 5 = 14 のとき、x = ?      答え: 3
//   4x - 7 = 1 のとき、x = ?       答え: 2
//
// ------------------------------------------------------------
// 答えから逆算して作る
// ------------------------------------------------------------
// 式を先に作って解こうとすると、割り切れない解が出てしまう。
//
//   3x + 5 = 13  →  x = 8/3
//
// 先に解 x を決めてしまえば、右辺は掛け算と足し算で求まる。
//
//   x = 3、a = 3、b = 5 と決める
//   右辺 = a × x + b = 3 × 3 + 5 = 14
//   よって 3x + 5 = 14
//
// 方程式を解く処理を書かずに済み、答えも必ず整数になる。
// あまりのあるわり算や九九の逆と同じ考え方。
// ============================================================
class LinearEquationGenerator extends ProblemGenerator {

    private final int maxSolution;
    private final int maxCoefficient;

    LinearEquationGenerator(Random random, int maxSolution, int maxCoefficient) {
        super(random);
        if (maxSolution < 1) {
            throw new IllegalArgumentException("解の上限は1以上: " + maxSolution);
        }
        if (maxCoefficient < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxCoefficient);
        }
        this.maxSolution = maxSolution;
        this.maxCoefficient = maxCoefficient;
    }

    @Override
    protected Problem generateProblem() {
        // 先に答えを決める。0を避けるのは x = 0 が問題として物足りないため
        int solution = randomNonZero(-maxSolution, maxSolution);
        // x の係数。負にすると難度が上がるので1以上にしている
        int coefficient = randomNumber(1, maxCoefficient);
        int constant = randomNonZero(-maxCoefficient, maxCoefficient);

        int rightSide = coefficient * solution + constant;

        String question = Polynomial.withVariable(coefficient, "x")
                + Polynomial.signedTerm(constant, "")
                + " = " + rightSide + " のとき、x = ?";

        return new Problem(question, String.valueOf(solution));
    }
}
