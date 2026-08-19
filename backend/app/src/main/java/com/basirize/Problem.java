package com.basirize;

// このプロジェクトでは問題と答えはセット
// 例：new Problem("3 + 3 = ", "6");
public record Problem(String question, String answer) {
}
