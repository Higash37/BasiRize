package com.basirize;

import java.util.Random;

// ============================================================
// 因数分解（FactoringGenerator）
// ============================================================
// 中3「因数分解」。x² + bx + c の形を (x + p)(x + q) に戻す。
//
//   x² - 2x - 15 を因数分解すると？     答え: (x + 3)(x - 5)
//
// ------------------------------------------------------------
// 展開と同じ公式を逆向きに使う
// ------------------------------------------------------------
//   (x + p)(x + q) = x² + (p + q)x + pq
//
// 因数分解の手順（積が c、和が b になる2数を探す）を実装する必要はない。
// 先に p と q を決めれば、b と c は足し算と掛け算で求まるので、
// それを問題文にして、p と q を答えにすればよい。
//
// ExpansionGenerator と問題文・答えが入れ替わっているだけ。
//
// ------------------------------------------------------------
// 高1（数学I「数と式」）でも同じクラスを使う
// ------------------------------------------------------------
// 扱う数の大きさが違うだけで、アルゴリズムは同じ。
// maxRoot を大きくしたインスタンスを作れば発展問題になる。
// アルゴリズムが同じものはクラスを分けない、という方針どおり。
// ============================================================
class FactoringGenerator extends ProblemGenerator {

    private final int maxRoot;

    FactoringGenerator(Random random, int maxRoot) {
        super(random);
        if (maxRoot < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxRoot);
        }
        this.maxRoot = maxRoot;
    }

    @Override
    protected Problem generateProblem() {
        // 0 を避けるのは x² + 3x のように因数分解の形が変わってしまうため
        int p = randomNonZero(-maxRoot, maxRoot);
        int q = randomNonZero(-maxRoot, maxRoot);

        String question = Polynomial.quadratic(p + q, p * q) + " を因数分解すると？";
        String answer = Polynomial.factor(p) + Polynomial.factor(q);

        return new Problem(question, answer);
    }
}
