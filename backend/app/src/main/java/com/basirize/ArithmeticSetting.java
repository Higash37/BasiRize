package com.basirize;

import java.util.List;

// ============================================================
// 四則演算の設定（ArithmeticSetting）
// ============================================================
// 「どんな問題を作るか」の条件をまとめた箱。
//
//   min / max        使う数の範囲
//   minTerms         項数の下限（2 なら「3 + 5」）
//   maxTerms         項数の上限（4 なら「3 + 5 × 2 - 1」）
//   operators        使う演算子。[ADD, SUBTRACT] なら たし算・ひき算だけ
//   allowNegative    途中や答えがマイナスになってよいか
//   maxAnswer        答えの絶対値の上限
//
// ------------------------------------------------------------
// なぜ1つの箱にまとめるのか
// ------------------------------------------------------------
// バラバラの引数で渡すと、呼ぶたびに7個並べることになる。
// 設定が1つ増えるたびに、呼んでいる箇所を全部直す必要も出る。
//
// まとめておけば、生成メソッドに渡すのは「何問作るか」だけで済む。
//   generator.generate(20)
//
// ------------------------------------------------------------
// なぜコンストラクタで渡すのか（メソッド引数ではなく）
// ------------------------------------------------------------
// 17種類の問題タイプを「設定違いのインスタンス」で表すため。
// アルゴリズムは同じで範囲や演算が違うだけなら、クラスを分ける必要はない。
//
//   小1 たし算ひき算   new ArithmeticSetting(1, 9,  2, 2, [ADD, SUBTRACT], false, 100)
//   小2 かけ算九九     new ArithmeticSetting(1, 9,  2, 2, [MULTIPLY],      false, 100)
//   小3 四則演算       new ArithmeticSetting(1, 20, 3, 4, [全部],          false, 10000)
//
// クラスは1つのまま、インスタンス違いで複数の問題タイプを表せる。
//
// ------------------------------------------------------------
// maxAnswer が必要な理由
// ------------------------------------------------------------
// 項数が増えて × が続くと、答えが跳ね上がる。
//
//   ((((10 × 9) × 8) × 7) × 6) × 5 = 151200
//
// 小学生のプリントとして成立しないので、上限を超えたら作り直す。
// 上限を実質なくしたいときは、大きい値（999999 など）を入れる。
// ============================================================
public record ArithmeticSetting(
        int min,
        int max,
        int minTerms,
        int maxTerms,
        List<Operator> operators,
        boolean allowNegative,
        int maxAnswer) {

    // record のコンパクトコンストラクタ。
    // new したときに必ず動くので、おかしな設定をここで弾ける。
    //
    // 不正な設定を作れなくしておくと、後の処理は「設定は正しい」前提で書ける。
    // 間違いに気づく場所が、問題を作る瞬間ではなく設定を作る瞬間になるので、
    // 原因を追いやすい。
    public ArithmeticSetting {
        if (min > max) {
            throw new IllegalArgumentException("min が max より大きい: " + min + " > " + max);
        }
        if (minTerms < 2) {
            throw new IllegalArgumentException("項数は2以上: " + minTerms);
        }
        if (maxTerms < minTerms) {
            throw new IllegalArgumentException("maxTerms が minTerms より小さい: " + maxTerms + " < " + minTerms);
        }
        if (operators == null || operators.isEmpty()) {
            throw new IllegalArgumentException("使う演算子が指定されていない");
        }
        if (maxAnswer < 0) {
            throw new IllegalArgumentException("maxAnswer は0以上: " + maxAnswer);
        }
    }
}
