package com.basirize;

// ============================================================
// 文字式の表示（Polynomial）
// ============================================================
// x² + 3x - 4 のような文字式を、数学の書き方に直すための道具。
//
// 数学には「書かない約束」がいくつもあり、そのまま数字を並べると
// 人が読める式にならない。
//
//   1x      → x         係数1の1は書かない
//   -1x     → -x
//   + -4    → - 4       プラスマイナスは並べない
//   + 0x    → （省略）   係数0の項は書かない
//   x² + 0  → x²
//
// この判断が展開・因数分解・二次方程式の3か所で同じように必要になるので、
// 1か所にまとめてある。
//
// 計算には使わない。答えを出す側は数値のまま扱い、表示のときだけここを通す。
// ============================================================
final class Polynomial {

    // 表示のための道具を並べるだけの場所なので、インスタンスは作らせない
    private Polynomial() {
    }

    // x² + bx + c の形の文字列を作る。
    //
    //   quadratic(3, -4)  → "x² + 3x - 4"
    //   quadratic(-1, 0)  → "x² - x"
    //   quadratic(0, 9)   → "x² + 9"
    //   quadratic(0, 0)   → "x²"
    static String quadratic(int b, int c) {
        String text = "x²";

        if (b != 0) {
            text += b > 0 ? " + " : " - ";
            int size = Math.abs(b);
            // 係数1のときは数字を書かない（1x ではなく x）
            text += size == 1 ? "x" : size + "x";
        }

        if (c != 0) {
            text += c > 0 ? " + " : " - ";
            text += Math.abs(c);
        }

        return text;
    }

    // (x + p) の形の文字列を作る。p は0以外を想定。
    //
    //   factor(3)   → "(x + 3)"
    //   factor(-5)  → "(x - 5)"
    static String factor(int p) {
        return p > 0
                ? "(x + " + p + ")"
                : "(x - " + Math.abs(p) + ")";
    }

    // 係数つきの文字を作る。
    //
    //   withVariable(3, "x")   → "3x"
    //   withVariable(1, "x")   → "x"
    //   withVariable(-1, "y")  → "-y"
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
    //   signedTerm(3, "y")   → " + 3y"
    //   signedTerm(-1, "y")  → " - y"
    //   signedTerm(5, "")    → " + 5"
    static String signedTerm(int coefficient, String variable) {
        String sign = coefficient > 0 ? " + " : " - ";
        int size = Math.abs(coefficient);

        if (variable.isEmpty()) {
            return sign + size;
        }
        return sign + (size == 1 ? variable : size + variable);
    }
}
