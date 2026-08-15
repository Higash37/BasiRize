package com.basirize;

// Calculation.javaで左のExpression + Operator + 右のExpressionを組み合わせ計算式を作る
public record Num(int number) implements Expression {

    // num.value()を呼んだら数値を返す
    public int value() {
        return number;
    }

    // num.text()を呼んだらString型にした数値を返す
    public String text() {
        return String.valueOf(number);
    }

    // num.isComputable()を呼んだらtrueを返す
    public boolean isComputable() {
        return true;
    }

    // num.precedence()を呼んだらnumberが正の数なら3、負の数なら0を返す
    public int precedence() {
        return number < 0 ? 0 : 3;
    }
}
