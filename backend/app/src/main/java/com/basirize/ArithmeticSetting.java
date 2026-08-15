package com.basirize;

import java.util.List;

// 四則演算の計算問題を作るセット
// ArithmeticSetting(1, 9, 2, 3, List.of(Operator.ADD), false, 20)
// → 1~9を使い、2~3項の足し算を作り、負数は禁止、答えは20以下
public record ArithmeticSetting(
        int min,
        int max,
        int minTerms,
        int maxTerms,
        List<Operator> operators,
        boolean allowNegative,
        int maxAnswer) {

    // record専用の簡略コンストラクタ
    // new ArithmeticSetting()されたときに、受け取った設定値が正しいか確認する
    public ArithmeticSetting {
        // 最小値が最大値より大きければエラーを吐く
        if (min > max) {
            throw new IllegalArgumentException("min が max より大きい: " + min + " > " + max);
        }
        // 項の数が1つだけならエラーを吐く
        if (minTerms < 2) {
            throw new IllegalArgumentException("項数は2以上: " + minTerms);
        }
        // 最小の項数が最大の項数より多ければエラーを吐く
        if (maxTerms < minTerms) {
            throw new IllegalArgumentException("maxTerms が minTerms より小さい: " + maxTerms + " < " + minTerms);
        }
        // 演算子が空であればエラーを吐く
        if (operators == null || operators.isEmpty()) {
            throw new IllegalArgumentException("使う演算子が指定されていない");
        }
        // 答えの上限が負数になっていればエラーを吐く
        if (maxAnswer < 0) {
            throw new IllegalArgumentException("maxAnswer は0以上: " + maxAnswer);
        }
    }
}
