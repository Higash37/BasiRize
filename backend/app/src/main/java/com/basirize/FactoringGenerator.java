package com.basirize;

import java.util.Random;

// Factor = 因数分解
class FactoringGenerator extends ProblemGenerator {

    // 最大値をmaxRootに入れる
    private final int maxRoot;

    // FactoringGenerator(random, 9)といった形で渡される
    FactoringGenerator(Random random, int maxRoot) {
        super(random);
        // 後ほど最大値の反転値で負の数値を作るので、maxRootは1以上
        // 0以下であればエラーを吐く
        if (maxRoot < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxRoot);
        }
        this.maxRoot = maxRoot;
    }

    @Override
    protected Problem generateProblem() {
        // 0 を避けるのは x² + 3x のように因数分解の形が変わってしまうため
        // maxRoot = 5であれば、randomNonZero(最小値, 最大値)にて、pとqに-5以上5以下のランダムな整数が渡される
        int p = randomNonZero(-maxRoot, maxRoot);
        int q = randomNonZero(-maxRoot, maxRoot);

        // Polynomial.quadratic(b, c)にp + q とp * qをそれぞれ渡す
        // p = 3, q = -4の場合
        // Polynomial.quadratic(b = -1, c = -12)
        // question = x² -x -12
        // answer = (x + 3)(x - 4)
        String question = Polynomial.quadratic(p + q, p * q) + " を因数分解すると？";
        String answer = Polynomial.factor(p) + Polynomial.factor(q);

        // 因数分解の際の問題と答えを返す
        return new Problem(question, answer);
    }
}
