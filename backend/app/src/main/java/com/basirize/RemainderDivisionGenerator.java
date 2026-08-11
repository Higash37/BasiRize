package com.basirize;

import java.util.Random;

// ============================================================
// あまりのあるわり算（RemainderDivisionGenerator）
// ============================================================
// 小3の内容。
//
//   17 ÷ 5 = ?      答え: 3 あまり 2
//
// ------------------------------------------------------------
// なぜ Expression（木）を使わないのか
// ------------------------------------------------------------
// 理由1：答えが数値ではない
//   Expression.value() は int を返す約束になっている。
//   「3 あまり 2」は1つの数ではないので、この約束に収まらない。
//
// 理由2：式の途中に置けない
//   「3 あまり 2」を他の計算の材料にはできない。
//   (17 ÷ 5) + 4 のような使い方ができないので、木の部品にする意味がない。
//
// 無理に Expression に載せると value() の戻り値を変えることになり、
// Num・Calculation・ArithmeticGenerator まで作り直しになる。
// 独立した生成器にしておけば、既存の部品に一切触れずに済む。
//
// ------------------------------------------------------------
// 作り方：検査せず、最初から正しく作る
// ------------------------------------------------------------
// ArithmeticGenerator は「作ってから検査して、ダメなら作り直す」方式だった。
// こちらは逆に、答えから逆算して作るので一発で正しい問題になる。
//
//   割る数   d = 5      2以上（あまりを出すには2以上必要）
//   商       q = 3
//   あまり   r = 2      1〜d-1 から選ぶ。0にするとあまりが無くなる
//   割られる数 = d × q + r = 17
//
// 条件が単純で、答えから逆算できる場合はこちらの方が速く確実。
// 条件が絡み合う四則混合では逆算できないので、あちらは検査方式にしている。
//
// ------------------------------------------------------------
// 設定を箱にまとめていない理由
// ------------------------------------------------------------
// 設定が2つしかないため。ArithmeticSetting は7つあるのでまとめた。
// 増えてきたら、そのときに箱を作る。
// ============================================================
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
                dividend + " ÷ " + divisor + " = ?",
                quotient + " あまり " + remainder);
    }
}
