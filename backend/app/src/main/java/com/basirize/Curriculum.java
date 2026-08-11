package com.basirize;

import java.util.List;

// ============================================================
// 学年ごとの設定（Curriculum）
// ============================================================
// 学習指導要領（小学校：平成29年告示 / 中学校：平成29年告示）の
// 「数と計算」「数と式」に合わせた ArithmeticSetting を並べた場所。
//
// 設定を Main に直接書くと、学年の根拠がコードから消えてしまう。
// ここにまとめておけば「なぜこの範囲なのか」を1箇所で追える。
//
// ------------------------------------------------------------
// 指導要領との対応
// ------------------------------------------------------------
//   小1   1位数の加減
//   小2   2位数の加減 / 乗法（九九）
//   小3   除法（乗法九九の逆）/ 2位数×2位数
//   小4   四則混合と（ ）を用いた式・計算の順序      ← かっこはここから
//   中1   正負の数の四則計算
//
// 四則混合とかっこは小4の内容。小3以下でこれを出すと先取りになるので、
// 小3までは項数2、演算も混ぜないようにしている。
//
// ------------------------------------------------------------
// 今の実装の限界（承知の上で置いている）
// ------------------------------------------------------------
// ArithmeticSetting の min/max は、式に出てくるすべての数に一律で効く。
// 「割られる数は1〜81、割る数は1〜9」のように分けられない。
//
// そのため小3のわり算は 8 ÷ 2 のような小さいものになり、
// 指導要領が想定する「81 ÷ 9」までの九九の逆にはならない。
// 数ごとに範囲を指定できる形にするのは今後の課題。
//
// 小5以降の小数・分数、小3のあまりのあるわり算はここでは扱えない。
// Num が int しか持てないため、別の生成器が必要になる。
// ============================================================

// final: このクラスを継承させない
// 設定を並べるだけの場所なので、継承して拡張する使い方は想定していない
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
