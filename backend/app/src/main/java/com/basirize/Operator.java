// package: このファイルがどのフォルダ（名前空間）に属するかの宣言
// com.basirize: フォルダ src/main/java/com/basirize と一致させる必要がある
// 同じ package のファイル同士は import なしで見える
package com.basirize;

// Calculation.javaで左のExpression + Operator + 右のExpressionを組み合わせ計算式を作る
// enum: 選択肢が決まっているものを型にする仕組み（enumeration = 列挙）
// Operator: この型の名前。ファイル名 Operator.java と一致させる
// この型の値は、下に並ぶ4つ以外に存在できない
enum Operator {
    ADD("+"),
    SUBTRACT("-"),
    MULTIPLY("×"),
    DIVIDE("÷");

    private final String symbol;

    // コンストラクタ
    // enum型で定義したsymbolを4つ保存
    Operator(String symbol) {
        this.symbol = symbol;
    }

    // 画面に "+" や "-" を返す
    // symbol()が呼ばれればsymbolを返す
    String symbol() {
        return symbol;
    }

    // 実際に四則演算を計算する
    // apply(4, 5)
    int apply(int left, int right) {

        return switch (this) {
            case ADD -> left + right;
            case SUBTRACT -> left - right;
            case MULTIPLY -> left * right;
            case DIVIDE -> left / right;

        };
    }

    // 乗除を加減より先に計算する
    int precedence() {
        return switch (this) {
            case ADD, SUBTRACT -> 1;
            case MULTIPLY, DIVIDE -> 2;
        };
    }

    // 右側の式に括弧が必要かを判定する
    boolean keepsMeaningOnRight() {
        return switch (this) {
            case ADD, MULTIPLY -> true;
            case SUBTRACT, DIVIDE -> false;
        };
    }
}
