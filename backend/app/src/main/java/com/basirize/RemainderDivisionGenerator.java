package com.basirize;

import java.util.Random;

// ExactDivisionGeneratorの割り切れない版
class RemainderDivisionGenerator extends ProblemGenerator {

    private final int maxDivisor;
    private final int maxQuotient;

    RemainderDivisionGenerator(Random random, int maxDivisor, int maxQuotient) {
        super(random);
        if (maxDivisor < 2) {
            throw new IllegalArgumentException("割る数の上限は2以上: " + maxDivisor);
        }
        if (maxQuotient < 1) {
            throw new IllegalArgumentException("商の上限は1以上: " + maxQuotient);
        }
        this.maxDivisor = maxDivisor;
        this.maxQuotient = maxQuotient;
    }

    // 1問作る。答えから逆算するので必ず「あまりのあるわり算」になる
    @Override
    protected Problem generateProblem() {
        int divisor = randomNumber(2, maxDivisor);
        int quotient = randomNumber(1, maxQuotient);
        // あまりは 1〜(割る数-1)。0 にすると割り切れてしまう
        int remainder = randomNumber(1, divisor - 1);
        int dividend = divisor * quotient + remainder;

        return new Problem(
                dividend + " ÷ " + divisor + " = ",
                quotient + " あまり " + remainder);
    }
}
