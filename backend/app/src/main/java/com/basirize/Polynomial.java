package com.basirize;

// Polynomial = 多項式
// 表示のための文字式計算式を作る
final class Polynomial {

    // 表示のための道具を並べるだけの場所なので、インスタンスは作らせない
    private Polynomial() {
    }

    // quadratic = 2次方程式
    // quadratic(b, c)でx² + bx + cを返す
    // quadratic(3, -4) → "x² + 3x - 4"
    // quadratic(-1, 0) → "x² - x"
    // quadratic(0, 9) → "x² + 9"
    // quadratic(0, 0) → "x²"
    static String quadratic(int b, int c) {
        String text = "x²";

        // bが0でなければ x² +(-) b
        if (b != 0) {
            text += b > 0
                    ? " + "
                    : " - ";
            // b = -3なら size = 3になる
            int size = Math.abs(b);
            // 係数1のときは数字を書かない（1x ではなく x）
            // 係数3のときは x² +(-)3x
            text += size == 1 ? "x" : size + "x";
        }

        // c が0でなければ x² +(-)bx+(-)cを作る
        if (c != 0) {
            text += c > 0 ? " + " : " - ";
            text += Math.abs(c);
        }
        // x² +(-) bx +(-) cを返す
        return text;
    }

    // Factor = 因数
    // (x + p) の形の因数文字列を作る。p は0以外を想定。
    // factor(3) → "(x + 3)"
    // factor(-5) → "(x - 5)"
    static String factor(int p) {
        return p > 0
                ? "(x + " + p + ")"
                // Math.abs(p)でpの絶対値を作る
                : "(x - " + Math.abs(p) + ")";
    }

    // coefficient = 係数
    // 係数つきの文字を作る。

    // withVariable(3, "x") → "3x"
    // withVariable(1, "x") → "x"
    // withVariable(-1, "y") → "-y"
    static String withVariable(int coefficient, String variable) {
        if (coefficient == 1) {
            return variable;
        }
        if (coefficient == -1) {
            return "-" + variable;
        }
        return coefficient + variable;
    }

    // 前に符号を付けて続ける項を作る。
    //
    // signedTerm(3, "y") → " + 3y"
    // signedTerm(-1, "y") → " - y"
    // signedTerm(5, "") → " + 5"
    static String signedTerm(int coefficient, String variable) {
        // coefficient = 1なら
        String sign = coefficient > 0 ? " + " : " - ";
        int size = Math.abs(coefficient);

        // signedTerm(5, "")なら "+5を返す"
        if (variable.isEmpty()) {
            return sign + size;
        }
        // signedTerm(5, "y")なら、 +5yを返す
        return sign + (size == 1 ? variable : size + variable);
    }
}
