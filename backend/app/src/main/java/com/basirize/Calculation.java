package com.basirize;

// new Calculation(new Num(3), Operator.ADD, new Num(5))という形で送る
// Numとは異なりこっちでは実際に計算結果を返す
record Calculation(Expression left, Operator operator, Expression right) implements Expression {

    // 左右の数値をOperator.apply()に渡して計算する
    // 例: 3、ADD、5なら8を返す
    public int value() {
        return operator.apply(left.value(), right.value());
    }

    // 計算式を画面に表示する文字列にする
    // 例: 3、ADD、5なら「3 + 5」を返す
    public String text() {
        return render(left, false) + " " + operator.symbol() + " " + render(right, true);
    }

    // 子の式に括弧が必要か判断して表示する
    // 例: 足し算を先に行う「(3 + 5) × 2」では括弧が必要
    private String render(Expression child, boolean isRight) {
        boolean needsBrackets = child.precedence() < operator.precedence();

        // 右側では同じ優先順位でも意味が変わる場合がある
        // 例: 10 - (5 - 2)には括弧が必要
        if (isRight
                && child.precedence() == operator.precedence()
                && !operator.keepsMeaningOnRight()) {
            needsBrackets = true;
        }

        return needsBrackets ? "(" + child.text() + ")" : child.text();
    }

    // 問題として計算可能か確認する
    public boolean isComputable() {
        // 左右の式のどちらかが計算不能ならfalse
        if (!left.isComputable() || !right.isComputable()) {
            return false;
        }
        // 割り算では0除算と、答えが整数にならない問題を除外する
        // 例: 6 ÷ 0、5 ÷ 2はfalse
        if (operator == Operator.DIVIDE) {
            int r = right.value();
            if (r == 0) {
                return false;
            }
            if (left.value() % r != 0) {
                return false;
            }
        }
        return true;
    }

    // 式の優先順位として演算子の優先順位を返す
    // 足し算・引き算は1、掛け算・割り算は2
    public int precedence() {
        return operator.precedence();
    }
}
