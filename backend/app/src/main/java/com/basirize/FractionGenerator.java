package com.basirize;

import java.util.List;
import java.util.Random;

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

            String question = firstText + " " + operator.symbol() + " " + secondText + " =";
            return new Problem(question, answer.text());
        }
        throw new IllegalStateException("条件を満たす分数の問題を作れませんでした");
    }
}
