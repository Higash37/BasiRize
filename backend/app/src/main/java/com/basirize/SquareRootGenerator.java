package com.basirize;

import java.util.List;
import java.util.Random;

// ============================================================
// 平方根の計算（SquareRootGenerator）
// ============================================================
// 中3「平方根」。根号の中が同じもの同士をまとめる計算。
//
//   2√3 + 5√3 = ?     答え: 7√3
//   8√2 - 3√2 = ?     答え: 5√2
//
// ------------------------------------------------------------
// 同類項と同じ考え方
// ------------------------------------------------------------
// √3 を1つのかたまりと見れば、2つ + 5つ = 7つ と数えるだけ。
// LikeTermsGenerator（3x + 5x）と中身はほぼ同じで、
// 文字が x か √3 かが違うだけ。
//
// ------------------------------------------------------------
// 根号の中に平方数を入れない理由
// ------------------------------------------------------------
// √4 は 2 に直せてしまい、根号の計算にならない。
// √8 も 2√2 に直せるので、まとめる練習の前に簡単にする手順が要る。
//
// そこで根号の中は、平方数で割り切れない数だけを使う。
// この形の数を無理数として扱えるので、そのまま計算できる。
// ============================================================
class SquareRootGenerator extends ProblemGenerator {

    // 平方数で割り切れない数。これ以上簡単にできないので、根号の中にそのまま置ける
    private static final List<Integer> RADICANDS = List.of(2, 3, 5, 6, 7, 10, 11, 13, 14, 15);

    private final int maxCoefficient;

    SquareRootGenerator(Random random, int maxCoefficient) {
        super(random);
        if (maxCoefficient < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxCoefficient);
        }
        this.maxCoefficient = maxCoefficient;
    }

    @Override
    protected Problem generateProblem() {
        for (int attempt = 0; attempt < 100; attempt++) {
            int radicand = RADICANDS.get(random.nextInt(RADICANDS.size()));
            int a = randomNumber(1, maxCoefficient);
            int b = randomNumber(1, maxCoefficient);
            Operator operator = random.nextBoolean() ? Operator.ADD : Operator.SUBTRACT;

            int result = operator == Operator.ADD ? a + b : a - b;

            // 答えが0やマイナスになる問題は捨てる
            if (result <= 0) {
                continue;
            }

            String root = "√" + radicand;
            String question = Polynomial.withVariable(a, root)
                    + " " + operator.symbol() + " "
                    + Polynomial.withVariable(b, root) + " = ?";

            return new Problem(question, Polynomial.withVariable(result, root));
        }
        throw new IllegalStateException("平方根の問題を作れませんでした");
    }
}
