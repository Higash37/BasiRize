package com.basirize;

import java.util.Random;

// ============================================================
// 式の展開（ExpansionGenerator）
// ============================================================
// 中3「多項式の展開」。(x + p)(x + q) の形。
//
//   (x + 3)(x - 5) を展開すると？     答え: x² - 2x - 15
//
// ------------------------------------------------------------
// 展開の公式をそのまま使う
// ------------------------------------------------------------
//   (x + p)(x + q) = x² + (p + q)x + pq
//
// p と q を決めれば、展開後の係数は足し算と掛け算だけで求まる。
// 多項式どうしを掛ける処理を書く必要がない。
//
// 因数分解（FactoringGenerator）は、この問題文と答えを入れ替えたもの。
// 同じ公式を逆向きに使っているだけなので、作り方もほぼ同じになる。
// ============================================================
class ExpansionGenerator extends ProblemGenerator {

    private final int maxRoot;

    ExpansionGenerator(Random random, int maxRoot) {
        super(random);
        if (maxRoot < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxRoot);
        }
        this.maxRoot = maxRoot;
    }

    @Override
    protected Problem generateProblem() {
        // 0 を避けるのは (x + 0) が x になってしまい、展開の練習にならないため
        int p = randomNonZero(-maxRoot, maxRoot);
        int q = randomNonZero(-maxRoot, maxRoot);

        String question = Polynomial.factor(p) + Polynomial.factor(q) + " を展開すると？";
        String answer = Polynomial.quadratic(p + q, p * q);

        return new Problem(question, answer);
    }
}
