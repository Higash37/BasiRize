package com.basirize;

import java.util.Random;

// ============================================================
// 割り切れるわり算（ExactDivisionGenerator）
// ============================================================
// 小3の「乗法九九の逆」にあたる、あまりの出ないわり算。
//
//   72 ÷ 8 = ?      答え: 9
//   81 ÷ 9 = ?      答え: 9
//
// ------------------------------------------------------------
// なぜ ArithmeticGenerator では作れないのか
// ------------------------------------------------------------
// ArithmeticSetting の min/max は、式に出てくるすべての数に一律で効く。
// 「割られる数は81まで、割る数は9まで」のように分けて指定できない。
//
// 範囲を 1〜9 にすると 8 ÷ 2 のような小さい問題しか作れず、
// 範囲を 1〜81 にすると 72 ÷ 36 のような九九から外れた問題が混ざる。
// どちらも指導要領が想定する「九九の逆」にならない。
//
// 割る数と商をそれぞれ別の範囲で決められる、専用の生成器にするのが素直。
// アルゴリズムが違うものはクラスを分ける、という方針にも合う。
//
// ------------------------------------------------------------
// 作り方：答えから逆算する
// ------------------------------------------------------------
//   割る数 d = 8
//   商     q = 9
//   割られる数 = d × q = 72     →  72 ÷ 8 = 9
//
// 掛け算で作るので必ず割り切れる。検査も作り直しも要らない。
// RemainderDivisionGenerator（あまりのあるわり算）と同じ考え方。
//
// 割る数・商とも2以上にしているのは、
// ÷1 や 答えが1 になる自明な問題を避けるため。
// ============================================================
class ExactDivisionGenerator extends ProblemGenerator {

    private final int maxDivisor;
    private final int maxQuotient;

    ExactDivisionGenerator(Random random, int maxDivisor, int maxQuotient) {
        super(random);
        if (maxDivisor < 2) {
            throw new IllegalArgumentException("割る数の上限は2以上: " + maxDivisor);
        }
        if (maxQuotient < 2) {
            throw new IllegalArgumentException("商の上限は2以上: " + maxQuotient);
        }
        this.maxDivisor = maxDivisor;
        this.maxQuotient = maxQuotient;
    }

    // 1問作る。掛け算で逆算するので必ず割り切れる
    @Override
    protected Problem generateProblem() {
        int divisor = randomNumber(2, maxDivisor);
        int quotient = randomNumber(2, maxQuotient);
        int dividend = divisor * quotient;

        return new Problem(
                dividend + " ÷ " + divisor + " = ?",
                String.valueOf(quotient));
    }
}
