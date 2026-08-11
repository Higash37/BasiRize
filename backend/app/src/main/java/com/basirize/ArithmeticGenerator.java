package com.basirize;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

// ============================================================
// 四則演算の問題を作る（ArithmeticGenerator）
// ============================================================
// 設定に従ってランダムな式の木を組み立て、Problem のリストを返す。
//
//   入力    ArithmeticSetting（範囲・項数・演算子・負数・答えの上限）
//           + 何問作るか
//   出力    Problem のリスト
//
// ------------------------------------------------------------
// 責務の分かれ方
// ------------------------------------------------------------
//   ArithmeticGenerator   ランダムに木を組み立てる。計算方法は知らない
//   Expression（木）       計算と文字列化を行う。ランダムを知らない
//   Operator              記号と計算方法を持つ
//   Problem               問題文と答えを持つ箱
//
// 「かっこの付け方を変えたい」なら Calculation だけ、
// 「項数の決め方を変えたい」ならこのクラスだけを触れば済む。
//
// ------------------------------------------------------------
// Random を外から受け取る理由
// ------------------------------------------------------------
// 中で new Random() すると実行のたびに結果が変わり、テストで固定できない。
// 外から new Random(42) を渡せば、毎回まったく同じ問題が作られる。
//
// テストの価値は「たまたま通ること」ではなく、
// 落ちたときに同じ失敗をもう一度起こせること。
//
// ------------------------------------------------------------
// 作り方の方針：作る → 検査する → ダメなら作り直す
// ------------------------------------------------------------
// 「0で割らない」「割り切れる」「マイナスにならない」「答えが大きすぎない」を
// 組み立てながら守ろうとすると、条件が絡み合って手に負えなくなる。
//
// 先に作ってから検査すれば、条件が増えても検査を1つ足すだけで済む。
// 部分式は randomExpression 経由で作るので、作られた時点で既に合格している。
// つまり途中の値もすべて条件を満たしている。
// ============================================================
// 重複排除・試行回数の上限・randomNumber は ProblemGenerator が持っている
class ArithmeticGenerator extends ProblemGenerator {

    private final ArithmeticSetting setting;

    ArithmeticGenerator(Random random, ArithmeticSetting setting) {
        super(random);
        this.setting = setting;
    }

    // 問題を1問作る。項数は minTerms〜maxTerms からランダムに決まる。
    @Override
    protected Problem generateProblem() {
        int termCount = randomNumber(setting.minTerms(), setting.maxTerms());
        Expression e = randomExpression(termCount);
        return new Problem(e.text() + " = ?", String.valueOf(e.value()));
    }

    // 設定を満たす式を1つ返す。
    // 作る → 検査する → ダメなら作り直す、を最大100回繰り返す。
    // 回数を切っているのは、条件を満たす式が存在しない場合に永久に止まらなくなるため。
    Expression randomExpression(int termCount) {
        for (int attempt = 0; attempt < 100; attempt++) {
            Expression e = buildExpression(termCount);
            if (isAcceptable(e)) {
                return e;
            }
        }
        throw new IllegalStateException(
                "条件を満たす式を作れませんでした: " + setting.min() + "〜" + setting.max()
                        + " / " + termCount + "項 / " + setting.operators());
    }

    // その式を採用してよいかを判定する。
    //
    // isComputable() は式そのものの性質（0で割っていないか・割り切れるか）。
    // その下の2つは生成側の都合（マイナス禁止・答えの上限）なので、ここで見る。
    // 式に生成条件を持たせないことで、Calculation を他の問題タイプでも使い回せる。
    private boolean isAcceptable(Expression e) {
        if (!e.isComputable()) {
            return false;
        }
        int v = e.value();
        if (!setting.allowNegative() && v < 0) {
            return false;
        }
        // Math.abs は絶対値。マイナス側にも上限を効かせる
        if (Math.abs(v) > setting.maxAnswer()) {
            return false;
        }
        return true;
    }

    // 検査せずに式を1つ組み立てる。
    //
    // termCount 項の式を「左に○項・右に□項」に分け、それぞれを同じ方法で作って
    // 演算子で繋ぐ。分け方がランダムなので木の形が毎回変わり、
    // かっこの位置も自然に変わる。かっこを付ける処理はどこにも書いていない。
    //
    //   左1・右2                  左2・右1
    //       +                        ×
    //      / \                      / \
    //     3   ×                    +   2
    //        / \                  / \
    //       5   2                3   5
    //   3 + (5 × 2)              (3 + 5) × 2
    private Expression buildExpression(int termCount) {
        // 1項まで来たら数を返して終わり。再帰が止まる場所。
        // これが無いと自分を呼び続けて止まらなくなる。
        if (termCount == 1) {
            return new Num(randomNumber(setting.min(), setting.max()));
        }

        int leftTerms = randomNumber(1, termCount - 1);
        int rightTerms = termCount - leftTerms;

        // 検査つきの randomExpression を呼ぶので、左右は作られた時点で合格している。
        // 最後に自分の演算子だけ確認すれば済み、作り直しの範囲も小さくなる。
        Expression left = randomExpression(leftTerms);
        Operator operator = randomOperator();

        // わり算だけは特別扱いする。
        //
        // 2つの数を適当に選んでから割り切れるか調べる方式だと、偶然割り切れるのを
        // 待つことになり、実際には ÷ の問題がほとんど出てこなかった。
        // 順番を逆にして、左の値の約数を割る数に選べば必ず割り切れる。
        //
        //   左を作る       → 値は 24
        //   24 の約数      → 2, 3, 4, 6, 8, 12
        //   その中から選ぶ  → 6      24 ÷ 6 = 4
        //
        // 左が (3 + 5) のような部分式でも、値さえ出れば約数は求められるので効く。
        // 右が2項以上のときは使えないので、そのときは従来どおり作って検査に任せる。
        if (operator == Operator.DIVIDE && rightTerms == 1) {
            Integer divisor = randomDivisorOf(left.value());
            if (divisor != null) {
                return new Calculation(left, operator, new Num(divisor));
            }
            // 約数が見つからないときは下に落ちる。isAcceptable が弾いて作り直しになる
        }

        Expression right = randomExpression(rightTerms);
        return new Calculation(left, operator, right);
    }

    // value の約数のうち、設定の範囲に入るものからランダムに1つ返す。
    // 見つからなければ null を返す。
    //
    // 除外しているもの
    //   ・value が 0    何で割っても 0 になり練習にならない
    //   ・商が1になる約数  24 ÷ 24 = 1 のような自明な問題を避ける
    private Integer randomDivisorOf(int value) {
        int target = Math.abs(value);
        if (target == 0) {
            return null;
        }

        // 割る数も問題文に出る数なので、設定の範囲内に収める。
        // 1 で割る問題は意味がないので下限は2以上にする
        int lower = Math.max(2, setting.min());

        List<Integer> divisors = new ArrayList<>();
        // d * 2 <= target で「商が2以上」を保証している
        for (int d = lower; d <= setting.max() && d * 2 <= target; d++) {
            if (target % d == 0) {
                divisors.add(d);
            }
        }

        if (divisors.isEmpty()) {
            return null;
        }
        return divisors.get(random.nextInt(divisors.size()));
    }

    // 設定で許可された演算子から1つ選ぶ。
    // 4つ全部ではなく setting.operators() から選ぶので、
    // 「たし算・ひき算だけ」「かけ算だけ」を作り分けられる。
    Operator randomOperator() {
        List<Operator> operators = setting.operators();
        return operators.get(random.nextInt(operators.size()));
    }
}
