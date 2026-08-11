package com.basirize;

import java.util.List;
import java.util.Random;

// ============================================================
// 分数の計算問題（FractionGenerator）
// ============================================================
// 2つの真分数を1つの演算子で結んだ問題を作る。
//
//   1/4 + 2/4 = ?     答え: 3/4
//   1/2 + 1/3 = ?     答え: 5/6
//   2/3 × 3/5 = ?     答え: 2/5
//
// ------------------------------------------------------------
// 指導要領との対応
// ------------------------------------------------------------
//   小4   同分母の分数の加減          sameDenominator = true, [ADD, SUBTRACT]
//   小5   異分母の分数の加減          sameDenominator = false, [ADD, SUBTRACT]
//   小6   分数×分数、分数÷分数        sameDenominator = false, [MULTIPLY, DIVIDE]
//
// ------------------------------------------------------------
// 問題文には約分前の分数を出す
// ------------------------------------------------------------
// Fraction は作られた時点で約分される。そのまま問題文に使うと、
// 2/4 が 1/2 になってしまい「同分母の加減」の練習にならない。
//
//   出したい   2/4 + 1/4 = ?
//   なってしまう 1/2 + 1/4 = ?
//
// なので問題文は分子・分母の生の数から組み立て、
// Fraction は答えを計算するためだけに使う。
//
// ------------------------------------------------------------
// マイナスの答えは出さない
// ------------------------------------------------------------
// 分数の加減が出てくる小4〜小6では負の数を未習のため。
// 引き算で負になったら、その問題は捨てて作り直す。
//
// ------------------------------------------------------------
// 今できないこと
// ------------------------------------------------------------
// ・帯分数（1と1/2 のような形）。いまは仮分数のまま 3/2 と出る
// ・3項以上の分数計算。Fraction が Expression ではないため木に載らない
// ・整数と分数の混合（2 + 1/3 など）
// ============================================================
class FractionGenerator extends ProblemGenerator {

    private final int maxDenominator;
    private final List<Operator> operators;
    private final boolean sameDenominator;

    FractionGenerator(Random random, int maxDenominator,
            List<Operator> operators, boolean sameDenominator) {
        super(random);
        if (maxDenominator < 2) {
            throw new IllegalArgumentException("分母の上限は2以上: " + maxDenominator);
        }
        if (operators == null || operators.isEmpty()) {
            throw new IllegalArgumentException("使う演算子が指定されていない");
        }
        this.maxDenominator = maxDenominator;
        this.operators = operators;
        this.sameDenominator = sameDenominator;
    }

    // 1問作る。条件に合わなければ捨てて作り直す
    @Override
    protected Problem generateProblem() {
        for (int attempt = 0; attempt < 100; attempt++) {
            // 分母は2以上。1にすると分数にならない
            int denominator1 = randomNumber(2, maxDenominator);
            int denominator2 = sameDenominator ? denominator1 : randomNumber(2, maxDenominator);

            // 分子は 1〜(分母-1)。真分数（1より小さい分数）にするため
            int numerator1 = randomNumber(1, denominator1 - 1);
            int numerator2 = randomNumber(1, denominator2 - 1);

            Fraction first = new Fraction(numerator1, denominator1);
            Fraction second = new Fraction(numerator2, denominator2);

            String firstText;
            String secondText;

            if (sameDenominator) {
                // 同分母の練習なので、約分すると分母が揃わなくなる（2/4 が 1/2 になる）。
                // ここだけは生の分子・分母をそのまま問題文に出す
                firstText = numerator1 + "/" + denominator1;
                secondText = numerator2 + "/" + denominator2;
            } else {
                // 約分した結果たまたま分母が同じになったら、異分母の練習にならないので捨てる
                if (first.denominator() == second.denominator()) {
                    continue;
                }
                firstText = first.text();
                secondText = second.text();
            }

            Operator operator = operators.get(random.nextInt(operators.size()));
            Fraction answer = first.apply(operator, second);

            // 負の数は小4〜小6で未習なので捨てる。
            // 0 は 1/2 - 1/2 のような自明な問題になるので同じく捨てる
            if (answer.numerator() <= 0) {
                continue;
            }

            String question = firstText + " " + operator.symbol() + " " + secondText + " = ?";
            return new Problem(question, answer.text());
        }
        throw new IllegalStateException("条件を満たす分数の問題を作れませんでした");
    }
}
