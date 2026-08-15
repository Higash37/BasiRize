package com.basirize;

interface Expression {

    // 式を計算した答えを返す
    int value();

    // 式を文字で返す
    String text();

    // 計算可能か返す
    boolean isComputable();

    // 演算の優先順位を返す
    int precedence();
}
