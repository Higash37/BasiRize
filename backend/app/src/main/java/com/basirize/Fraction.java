package com.basirize;

// ============================================================
// 分数（Fraction）
// ============================================================
// 分子と分母を持つ値。作られた時点で必ず約分され、符号は分子側に寄る。
//
//   new Fraction(2, 4)   → 1/2
//   new Fraction(3, -4)  → -3/4
//   new Fraction(0, 5)   → 0/1（text() は "0"）
//   new Fraction(6, 3)   → 2/1（text() は "2"）
//
// ------------------------------------------------------------
// なぜ Expression にしていないのか
// ------------------------------------------------------------
// Expression の約束は int value() を返すこと。
// 1/2 は int で表せないので、この約束を守れない。
//
// 分数を木に載せるには value() の戻り値を Fraction に変える必要があり、
// Num・Calculation・Operator・ArithmeticGenerator すべてが作り直しになる。
// 整数の四則が動いている今、それをやる価値はまだない。
//
// 分数の計算は小4〜小6でも2項が中心なので、当面は木を使わず
// FractionGenerator が直接 2つの分数を計算する形で足りる。
//
// 将来 (1/2 + 1/3) × 2/5 のような混合式が必要になったときに、
// value() を Fraction 化する判断をする。整数は分母1の分数として扱えるので、
// そのときも Num は残せる。
//
// ------------------------------------------------------------
// なぜ約分をコンストラクタでやるのか
// ------------------------------------------------------------
// 「約分し忘れた分数」が存在できないようにするため。
// 使う側が約分を呼び忘れる余地をなくしておくと、
// 2/4 と 1/2 が別物として扱われる事故が起きない。
// ============================================================
record Fraction(int numerator, int denominator) {

    // record のコンパクトコンストラクタ。
    // 引数を書き換えてからフィールドに入るので、ここで正規化できる
    Fraction {
        if (denominator == 0) {
            throw new IllegalArgumentException("分母を0にはできない");
        }
        // 符号は分子側に寄せる。3/-4 と -3/4 を別物にしないため
        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }
        // 約分する
        int g = greatestCommonDivisor(Math.abs(numerator), denominator);
        numerator = numerator / g;
        denominator = denominator / g;
    }

    // 最大公約数。ユークリッドの互除法。
    // 大きい方を小さい方で割った余りを繰り返し、余りが0になったときの割る数が答え。
    //   12 と 18 → 18 % 12 = 6 → 12 % 6 = 0 → 6
    private static int greatestCommonDivisor(int a, int b) {
        while (b != 0) {
            int remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }

    // 演算子に応じて計算する。Operator をそのまま使い回している
    Fraction apply(Operator operator, Fraction other) {
        return switch (operator) {
            case ADD -> add(other);
            case SUBTRACT -> subtract(other);
            case MULTIPLY -> multiply(other);
            case DIVIDE -> divide(other);
        };
    }

    // a/b + c/d = (ad + cb) / bd
    // 通分してから足す。約分はコンストラクタがやるのでここでは考えない
    Fraction add(Fraction other) {
        return new Fraction(
                numerator * other.denominator + other.numerator * denominator,
                denominator * other.denominator);
    }

    // a/b - c/d = (ad - cb) / bd
    Fraction subtract(Fraction other) {
        return new Fraction(
                numerator * other.denominator - other.numerator * denominator,
                denominator * other.denominator);
    }

    // a/b × c/d = ac / bd
    Fraction multiply(Fraction other) {
        return new Fraction(
                numerator * other.numerator,
                denominator * other.denominator);
    }

    // a/b ÷ c/d = a/b × d/c（逆数をかける）
    Fraction divide(Fraction other) {
        if (other.numerator == 0) {
            throw new IllegalArgumentException("0で割れない");
        }
        return new Fraction(
                numerator * other.denominator,
                denominator * other.numerator);
    }

    // 表示用。分母が1なら整数として出す
    //   1/2 → "1/2"
    //   2/1 → "2"
    String text() {
        if (denominator == 1) {
            return String.valueOf(numerator);
        }
        return numerator + "/" + denominator;
    }
}
