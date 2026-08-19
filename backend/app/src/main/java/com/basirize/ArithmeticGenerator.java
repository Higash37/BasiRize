package com.basirize;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

class ArithmeticGenerator extends ProblemGenerator {

    private final ArithmeticSetting setting;

    // new ArithmeticGenerator(
    // new Random()
    // new ArithmeticSetting(
    // 1, 9,
    // 2, 3,
    // List.of(Operator.ADD),
    // false,
    // 20
    // )
    // )
    // 1～9を使う、2～3項の足し算問題生成器が作られる
    ArithmeticGenerator(Random random, ArithmeticSetting setting) {
        super(random);
        this.setting = setting;
    }

    @Override
    protected Problem generateProblem() {
        // settingで指定された範囲から項数を決める
        int termCount = randomNumber(setting.minTerms(), setting.maxTerms());
        // randomExpression(式の項数)で計算式を作る
        Expression e = randomExpression(termCount);
        // 式をe.text()としてProblemに返す, 計算結果を答えとして返す
        return new Problem(e.text() + " = ", String.valueOf(e.value()));
    }

    //
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

    // 指定の項数で式を作る
    private Expression buildExpression(int termCount) {
        // 1項まで来たら数を返して終わり。再帰が止まる場所。
        // これが無いと自分を呼び続けて止まらなくなる。
        if (termCount == 1) {
            return new Num(randomNumber(setting.min(), setting.max()));
        }

        // 項数3の場合
        // 左項を1項か2項で指定する
        int leftTerms = randomNumber(1, termCount - 1);
        // rightTerms = 3 - 1 or 3- 2
        int rightTerms = termCount - leftTerms;

        // leftTerms = 2の場合、
        Expression left = randomExpression(leftTerms);
        Operator operator = randomOperator();

        // 演算子が割り算で右側が数字1つなら、左の答えを割り切れる数を探す
        if (operator == Operator.DIVIDE && rightTerms == 1) {
            Integer divisor = randomDivisorOf(left.value());
            if (divisor != null) {
                // Calculationにleftと割り算演算子、また左の答えを割り切れる数を渡す
                return new Calculation(left, operator, new Num(divisor));
            }
            // 約数が見つからないときは下に落ちる。isAcceptable が弾いて作り直しになる
        }

        // 例：randomExpression(3) が呼ばれた場合
        // ① buildExpression(3) で、3項を「左2項・右1項」などに分ける
        // ② 左2項を作るため、randomExpression(2) を呼ぶ
        // ③ 2項は「左1項・右1項」に分かれ、それぞれNumになる
        // ④ 2つのNumをCalculationでつなぎ、完成した2項の式を元の左側へ返す
        // ⑤ 元の右1項もNumにして、左2項とつなぎ、3項の式を完成させる
        // ⑥ 完成した式が条件に合えば返し、合わなければ最大100回作り直す

        // 3項
        // ├─ 左2項 → Calculation(Num(3), ADD, Num(5))
        // └─ 右1項 → Num(2)
        // 最終結果 → (3 + 5) + 2
        Expression right = randomExpression(rightTerms);
        return new Calculation(left, operator, right);
    }

    // 割り切れるわり算をつくるために、左側の答えの約数を探すメソッド
    private Integer randomDivisorOf(int value) {
        int target = Math.abs(value);
        if (target == 0) {
            return null;
        }

        // 最小値を2以上にする
        int lower = Math.max(2, setting.min());

        List<Integer> divisors = new ArrayList<>();
        // value を2以上の数値で割り、割り切れる数をdivisorsに保存する
        // d * 2 <= target で「商が2以上」を保証している
        for (int d = lower; d <= setting.max() && d * 2 <= target; d++) {
            if (target % d == 0) {
                divisors.add(d);
            }
        }

        // valueを割り切れる数がなければ空を返す
        if (divisors.isEmpty()) {
            return null;
        }

        // divisorsの中の割る数を割り切れる数の中からランダムに1つ選ぶ
        return divisors.get(random.nextInt(divisors.size()));
    }

    // ランダムな符号を1つ返す
    Operator randomOperator() {
        List<Operator> operators = setting.operators();
        return operators.get(random.nextInt(operators.size()));
    }
}
