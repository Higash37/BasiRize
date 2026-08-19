package com.basirize;

import java.util.Random;

// ============================================================
// 連立方程式（SimultaneousEquationGenerator）
// ============================================================
// 中2「連立二元一次方程式」。
//
//   2x + 3y = 12, 4x - y = 10 のとき、x, y =    答え: x = 3, y = 2
//
// ------------------------------------------------------------
// 答えから逆算して作る
// ------------------------------------------------------------
// 先に解 x, y と係数を決め、右辺を計算で求める。
// 連立方程式を解く処理を書かずに済み、解も必ず整数になる。
//
// ------------------------------------------------------------
// 解が定まらない組み合わせを避ける
// ------------------------------------------------------------
//   a1 x + b1 y = c1
//   a2 x - b2 y = c2
//
// この2本は、係数の比が同じだと同じ直線を表してしまい、解が1つに定まらない。
//
//   2x + 4y = 10
//   1x + 2y = 5      ← 上の式を2で割っただけ。交点が求まらない
//
// 判定は a1 × (-b2) - a2 × b1 が 0 かどうかで行う。
// これが0だと2直線が平行または重なる。0でなければ交点はただ1つに定まる。
// ============================================================
class SimultaneousEquationGenerator extends ProblemGenerator {

    private final int maxSolution;
    private final int maxCoefficient;

    SimultaneousEquationGenerator(Random random, int maxSolution, int maxCoefficient) {
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
        for (int attempt = 0; attempt < 100; attempt++) {
            int x = randomNonZero(-maxSolution, maxSolution);
            int y = randomNonZero(-maxSolution, maxSolution);

            int a1 = randomNumber(1, maxCoefficient);
            int b1 = randomNumber(1, maxCoefficient);
            int a2 = randomNumber(1, maxCoefficient);
            int b2 = randomNumber(1, maxCoefficient);

            // 解が1つに定まらない組み合わせは捨てる
            if (a1 * b2 == a2 * b1) {
                continue;
            }

            int c1 = a1 * x + b1 * y;
            int c2 = a2 * x - b2 * y;

            String first = Polynomial.withVariable(a1, "x")
                    + Polynomial.signedTerm(b1, "y") + " = " + c1;
            String second = Polynomial.withVariable(a2, "x")
                    + Polynomial.signedTerm(-b2, "y") + " = " + c2;

            return new Problem(
                    first + ", " + second + " のとき、x =  y = ",
                    "x = " + x + ", y = " + y);
        }
        throw new IllegalStateException("連立方程式の問題を作れませんでした");
    }
}
