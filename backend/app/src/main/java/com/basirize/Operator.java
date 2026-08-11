// package: このファイルがどのフォルダ（名前空間）に属するかの宣言
// com.basirize: フォルダ src/main/java/com/basirize と一致させる必要がある
// 同じ package のファイル同士は import なしで見える
package com.basirize;

// enum: 選択肢が決まっているものを型にする仕組み（enumeration = 列挙）
// Operator: この型の名前。ファイル名 Operator.java と一致させる
// この型の値は、下に並ぶ4つ以外に存在できない
enum Operator {
    // ここから ; までが「選択肢の一覧」
    // 選択肢はそれぞれ Operator のインスタンス。最初に4つ作られ、以降ずっと使い回される
    // ("+") は、その選択肢が持つデータ。下のコンストラクタに渡される
    ADD("+"),
    SUBTRACT("-"),
    MULTIPLY("×"),
    // ; で選択肢の一覧は終わり。ここから下は4つ共通の部分
    DIVIDE("÷");

    // フィールド（インスタンスが持ち続けるデータの置き場）
    // private: この enum の外から直接読み書きできない
    // final: 一度入れたら変えられない
    // String: 入るものの型
    // symbol: 置き場の名前
    // 置き場は選択肢ごとに別々にできる（ADD用、SUBTRACT用…と4つ）
    private final String symbol;

    // コンストラクタ（作られるときに動くもの）
    // 見分け方: 名前が enum 名と同じ／戻り値の型を書かない
    // 上の ADD("+") が Operator("+") の呼び出しになる。選択肢の数だけ動く（今回は4回）
    // (String symbol): 受け取り口。"+" がここに入る。コンストラクタが終わると消える
    Operator(String symbol) {
        // 右の symbol = 受け取り口に入った "+"
        // 左の this.symbol = 上のフィールド（置き場）
        // this = 「今作っている選択肢自身の」という意味。名前が同じなので区別に使う
        // = は「右のものを左に入れる」
        this.symbol = symbol;
    }

    // フィールドの中身を外に渡すためのメソッド（窓口）
    // String: 返すものの型
    // symbol: メソッドの名前。フィールドと同名だが、() の有無で Java は別物として扱う
    // (): 空 ＝ 何も受け取らない
    // フィールドが private なので、外から読むにはこの窓口を通す
    String symbol() {
        // フィールドの中身をそのまま返す。中身は変えない
        return symbol;
    }

    // 実際に計算するメソッド
    // int: 返すものの型。計算結果は整数
    // apply: メソッドの名前（「適用する」の意）
    // (int left, int right): 受け取り口が2つ。左の数と右の数
    int apply(int left, int right) {
        // switch: 中身によって処理を分ける
        // this: 自分がどの選択肢か（ADD なのか MULTIPLY なのか）
        // return: 分けた結果をそのまま返す
        return switch (this) {
            // -> は「そのときはこれを結果にする」
            case ADD -> left + right;
            case SUBTRACT -> left - right;
            case MULTIPLY -> left * right;
            // int どうしの割り算は小数が切り捨てられる（3 ÷ 7 は 0）
            // 割り切れる組み合わせを作るのは、この enum ではなく生成側の責務
            case DIVIDE -> left / right;
            // default が無いのは4つ全部を書いているから
            // 5つ目の選択肢を足して書き忘れると、ここでコンパイルエラーになる
        };
        // switch は return 文の一部なので、閉じカッコの後に ; が要る
    }

    // 演算子の優先順位。大きいほど先に計算する。
    // × ÷ を + - より先に計算する、という数学のきまりを数値で表したもの。
    //
    // 何に使うか：問題文を書くときに、かっこが必要かどうかの判断に使う。
    // 木の形は正しくても、文字にするときにかっこを付け忘れると意味が変わってしまう。
    //
    //   木          文字にすると      かっこなしだと
    //   (3+5)×2  →  (3 + 5) × 2      3 + 5 × 2 になり別の式になる
    //   3+(5×2)  →  3 + 5 × 2        かっこは不要
    //
    // 計算そのものには使わない。value() は木の形だけで正しく計算できる。
    int precedence() {
        return switch (this) {
            case ADD, SUBTRACT -> 1;
            case MULTIPLY, DIVIDE -> 2;
        };
    }

    // 左右を入れ替えても、続けて書いても意味が変わらない演算かどうか。
    //
    //   a + (b + c) は a + b + c と書いてよい      → ADD は true
    //   a - (b - c) は a - b - c と書くと別の式    → SUBTRACT は false
    //   a × (b ÷ c) は a × b ÷ c と書いてよい      → MULTIPLY は true
    //   a ÷ (b × c) は a ÷ b × c と書くと別の式    → DIVIDE は false
    //
    // 右側の子にかっこが要るかの判断だけに使う。
    boolean keepsMeaningOnRight() {
        return switch (this) {
            case ADD, MULTIPLY -> true;
            case SUBTRACT, DIVIDE -> false;
        };
    }
}
