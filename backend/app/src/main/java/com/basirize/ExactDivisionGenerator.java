package com.basirize;

import java.util.Random;

class ExactDivisionGenerator extends ProblemGenerator {

    private final int maxDivisor;
    private final int maxQuotient;

    // dividend: 割られる数
    // divisor: 割る数
    // quotient: 商・答え
    ExactDivisionGenerator(Random random, int maxDivisor, int maxQuotient) {
        super(random);
        if (maxDivisor < 2) {
            throw new IllegalArgumentException("割る数の上限は2以上: " + maxDivisor);
        }
        if (maxQuotient < 2) {
            throw new IllegalArgumentException("商の上限は2以上: " + maxQuotient);
        }
        // 割る数の最大値をコンストラクタに保存
        this.maxDivisor = maxDivisor;
        // 商・答えの最大値をコンストラクタに保存
        this.maxQuotient = maxQuotient;
    }

    // 1問作る。掛け算で逆算するので必ず割り切れる
    @Override
    protected Problem generateProblem() {
        int divisor = randomNumber(2, maxDivisor);
        int quotient = randomNumber(2, maxQuotient);
        int dividend = divisor * quotient;

        return new Problem(
                dividend + " ÷ " + divisor + " =",
                String.valueOf(quotient));
    }
}
