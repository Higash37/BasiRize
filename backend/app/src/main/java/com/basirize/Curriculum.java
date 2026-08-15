package com.basirize;

import java.util.List;

final class Curriculum {

        // private コンストラクタ。new Curriculum() を書けなくする。
        // インスタンスを作る意味がないクラスなので、作れないようにしておく
        private Curriculum() {
        }

        // 小1：1位数のたし算・ひき算
        // 答えの上限18は 9 + 9 から
        static ArithmeticSetting grade1AddSubtract() {
                return new ArithmeticSetting(1, 9, 2, 2,
                                List.of(Operator.ADD, Operator.SUBTRACT), false, 18);
        }

        // 小2：2位数のたし算・ひき算（くり上がり・くり下がりあり）
        static ArithmeticSetting grade2AddSubtract() {
                return new ArithmeticSetting(10, 99, 2, 2,
                                List.of(Operator.ADD, Operator.SUBTRACT), false, 200);
        }

        // 小2：かけ算九九
        // 答えの上限81は 9 × 9 から
        static ArithmeticSetting grade2MultiplicationTable() {
                return new ArithmeticSetting(1, 9, 2, 2,
                                List.of(Operator.MULTIPLY), false, 81);
        }

        // 小3：かけ算（2位数×2位数まで）
        //
        // わり算はここに含めない。ArithmeticSetting の範囲がすべての数に一律で効くため、
        // 「割られる数は81まで、割る数は9まで」という九九の逆が作れないから。
        // 小3のわり算は ExactDivisionGenerator（割り切れる）と
        // RemainderDivisionGenerator（あまりあり）を使う。
        static ArithmeticSetting grade3Multiplication() {
                return new ArithmeticSetting(1, 20, 2, 2,
                                List.of(Operator.MULTIPLY), false, 400);
        }

        // 小4：四則混合（3〜4項）。かっこはここから出る
        static ArithmeticSetting grade4Mixed() {
                return new ArithmeticSetting(1, 20, 3, 4,
                                List.of(Operator.ADD, Operator.SUBTRACT,
                                                Operator.MULTIPLY, Operator.DIVIDE),
                                false, 1000);
        }

        // 小5：四則混合（発展）。数を大きくした
        static ArithmeticSetting grade5Mixed() {
                return new ArithmeticSetting(1, 50, 3, 4,
                                List.of(Operator.ADD, Operator.SUBTRACT,
                                                Operator.MULTIPLY, Operator.DIVIDE),
                                false, 5000);
        }

        // 小6：小学校の総まとめ。項数を増やした
        static ArithmeticSetting grade6Mixed() {
                return new ArithmeticSetting(1, 100, 3, 5,
                                List.of(Operator.ADD, Operator.SUBTRACT,
                                                Operator.MULTIPLY, Operator.DIVIDE),
                                false, 10000);
        }

        // 中1：正負の数の四則計算。マイナスを許可する
        // わり算を外しているのは、負の数の整数除法が中学の範囲から外れやすいため
        static ArithmeticSetting juniorHigh1SignedNumbers() {
                return new ArithmeticSetting(-20, 20, 2, 2,
                                List.of(Operator.ADD, Operator.SUBTRACT, Operator.MULTIPLY), true, 400);
        }
}
