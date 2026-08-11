package com.basirize;

import java.util.Random;

// ============================================================
// 同類項をまとめる（LikeTermsGenerator）
// ============================================================
// 中1「文字を用いた式」の一次式の加減。
//
//   3x + 5x = ?    答え: 8x
//   7x - 2x = ?    答え: 5x
//
// 文字の部分が同じ項どうしは、係数だけを計算すればまとめられる。
// 3個のりんご + 5個のりんご = 8個のりんご、と同じ考え方。
//
// 答えが 0 や 1x になる場合の書き方に注意が必要なので、
// 表示は Polynomial に任せている。
// ============================================================
class LikeTermsGenerator extends ProblemGenerator {

    private final int maxCoefficient;

    LikeTermsGenerator(Random random, int maxCoefficient) {
        super(random);
        if (maxCoefficient < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxCoefficient);
        }
        this.maxCoefficient = maxCoefficient;
    }

    @Override
    protected Problem generateProblem() {
        for (int attempt = 0; attempt < 100; attempt++) {
            int a = randomNumber(1, maxCoefficient);
            int b = randomNumber(1, maxCoefficient);
            // 中1の段階では負の係数の答えは扱いにくいので + と - だけ
            Operator operator = random.nextBoolean() ? Operator.ADD : Operator.SUBTRACT;

            int result = operator == Operator.ADD ? a + b : a - b;

            // 答えが0（3x - 3x）やマイナスになる問題は捨てる
            if (result <= 0) {
                continue;
            }

            String question = Polynomial.withVariable(a, "x")
                    + " " + operator.symbol() + " "
                    + Polynomial.withVariable(b, "x") + " = ?";

            return new Problem(question, Polynomial.withVariable(result, "x"));
        }
        throw new IllegalStateException("同類項の問題を作れませんでした");
    }
}
