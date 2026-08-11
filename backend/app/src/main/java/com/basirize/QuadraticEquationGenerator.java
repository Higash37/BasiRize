package com.basirize;

import java.util.Random;

// ============================================================
// 二次方程式（QuadraticEquationGenerator）
// ============================================================
// 中3「二次方程式」。因数分解で解ける形だけを扱う。
//
//   x² - 5x + 6 = 0 のとき、x = ?     答え: x = 2, 3
//   x² - 9 = 0 のとき、x = ?          答え: x = -3, 3
//
// ------------------------------------------------------------
// 解から逆算して作る
// ------------------------------------------------------------
// 解を r1, r2 と決めると、方程式はこう書ける。
//
//   (x - r1)(x - r2) = 0
//   x² - (r1 + r2)x + r1 × r2 = 0
//
// つまり x の係数は -(r1 + r2)、定数項は r1 × r2。
// 解の公式も因数分解の手順も実装せずに済み、解は必ず整数になる。
//
// 解の公式で解く問題（解が無理数になるもの）は、この作り方では出せない。
// 必要になったら別のクラスにする。
//
// ------------------------------------------------------------
// 高1でも同じクラスを使う
// ------------------------------------------------------------
// 解の範囲を広げたインスタンスを作れば発展問題になる。
// ============================================================
class QuadraticEquationGenerator extends ProblemGenerator {

    private final int maxRoot;

    QuadraticEquationGenerator(Random random, int maxRoot) {
        super(random);
        if (maxRoot < 1) {
            throw new IllegalArgumentException("解の上限は1以上: " + maxRoot);
        }
        this.maxRoot = maxRoot;
    }

    @Override
    protected Problem generateProblem() {
        for (int attempt = 0; attempt < 100; attempt++) {
            int root1 = randomNumber(-maxRoot, maxRoot);
            int root2 = randomNumber(-maxRoot, maxRoot);

            // 両方0だと x² = 0 になり、二次方程式の練習として物足りない
            if (root1 == 0 && root2 == 0) {
                continue;
            }

            // (x - r1)(x - r2) = x² - (r1 + r2)x + r1r2
            String question = Polynomial.quadratic(-(root1 + root2), root1 * root2)
                    + " = 0 のとき、x = ?";

            String answer = root1 == root2
                    ? "x = " + root1
                    : "x = " + Math.min(root1, root2) + ", " + Math.max(root1, root2);

            return new Problem(question, answer);
        }
        throw new IllegalStateException("二次方程式の問題を作れませんでした");
    }
}
