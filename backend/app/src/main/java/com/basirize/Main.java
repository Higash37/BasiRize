// package: このファイルが属する名前空間。フォルダ構成と一致させる
// 同じ com.basirize にいるファイル（Num, Operator, Calculation…）は import なしで使える
package com.basirize;

import java.util.List;
import java.util.Random;

// ============================================================
// 動作確認用の入り口（Main）
// ============================================================
// 部品を1つ作るたびに、ここから println で出力して目で確かめるための場所。
// 使い捨てなので中身は自由に書き換えてよい。
// Spring Boot をかぶせた後は不要になる。それまでの足場。
//
// 実行（backend フォルダで）
//   .\gradlew run -q
//
// 日本語や × ÷ が化けるときは、先にこれを1回打つ
//   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
// ============================================================
public class Main {

    // JVM がプログラムを開始するときに最初に呼ぶメソッド。形が決まっている
    // public: JVM（外）から呼ばれるので公開する
    // static: インスタンスを作らなくても呼べる。開始時点ではまだ何も作られていないため
    // void: 何も返さない
    // main: この名前でないと開始点として認識されない
    // (String[] args): コマンドラインから渡される文字列の配列。今回は使わない
    public static void main(String[] args) {

        // 目で確かめる場所なので、毎回違う結果が出る new Random() を使う。
        // 結果を固定したいのはテストのときだけ。そちらでは new Random(42) を渡す。
        Random random = new Random();

        // --- かっこが必要なときだけ付くことの確認 ------------------
        // 手で木を組んで、text() の出方を見る。ランダムを使わないので毎回同じ
        Expression aPlusB = new Calculation(new Num(3), Operator.ADD, new Num(5));
        Expression cTimesD = new Calculation(new Num(4), Operator.MULTIPLY, new Num(2));

        System.out.println("--- かっこの付き方 ---");
        // (3 + 5) × 2   弱い + が強い × の下にいるので、かっこが要る
        System.out.println(new Calculation(aPlusB, Operator.MULTIPLY, new Num(2)).text());
        // 3 + 4 × 2     強い × が弱い + の下にいるので、かっこは不要
        System.out.println(new Calculation(new Num(3), Operator.ADD, cTimesD).text());
        // 8 - (3 + 5)   同じ強さでも、右側で親が - なら意味が変わるので必要
        System.out.println(new Calculation(new Num(8), Operator.SUBTRACT, aPlusB).text());
        // 8 + 3 + 5     右側でも親が + なら意味が変わらないので不要
        System.out.println(new Calculation(new Num(8), Operator.ADD, aPlusB).text());
        // 5 + (-3)      マイナスの数は演算子とくっつくので、かっこで囲む
        System.out.println(new Calculation(new Num(5), Operator.ADD, new Num(-3)).text());
        System.out.println();

        // --- 学年ごとの整数の四則 --------------------------------
        // アルゴリズムは同じで、設定だけが違う。
        // クラスは ArithmeticGenerator 1つのまま、インスタンス違いで学年を作り分ける
        arithmetic(random, "小1 たし算・ひき算（1桁）", Curriculum.grade1AddSubtract());
        arithmetic(random, "小2 たし算・ひき算（2桁）", Curriculum.grade2AddSubtract());
        arithmetic(random, "小2 かけ算九九", Curriculum.grade2MultiplicationTable());
        arithmetic(random, "小3 かけ算", Curriculum.grade3Multiplication());
        arithmetic(random, "小4 四則混合（かっこあり）", Curriculum.grade4Mixed());
        arithmetic(random, "小5 四則混合（発展）", Curriculum.grade5Mixed());
        arithmetic(random, "小6 四則混合（総まとめ）", Curriculum.grade6Mixed());
        arithmetic(random, "中1 正負の数", Curriculum.juniorHigh1SignedNumbers());

        // --- 小3のわり算 -----------------------------------------
        // 割る数と商をそれぞれ別の範囲で決める必要があるので、木ではなく専用の生成器
        print("小3 わり算（九九の逆）",
                new ExactDivisionGenerator(random, 9, 9).generate(5));

        // 答えが「3 あまり 2」という数値でない形なので、こちらも専用の生成器
        print("小3 あまりのあるわり算",
                new RemainderDivisionGenerator(random, 9, 9).generate(5));

        // --- 分数（小4〜小6） ------------------------------------
        print("小4 同分母の分数の加減",
                new FractionGenerator(random, 10,
                        List.of(Operator.ADD, Operator.SUBTRACT), true).generate(5));

        print("小5 異分母の分数の加減",
                new FractionGenerator(random, 12,
                        List.of(Operator.ADD, Operator.SUBTRACT), false).generate(5));

        print("小6 分数のかけ算・わり算",
                new FractionGenerator(random, 10,
                        List.of(Operator.MULTIPLY, Operator.DIVIDE), false).generate(5));

        // --- 中学校 -----------------------------------------------
        print("中1 文字式（同類項）",
                new LikeTermsGenerator(random, 9).generate(5));
        print("中1 一次方程式",
                new LinearEquationGenerator(random, 10, 9).generate(5));
        print("中2 連立方程式",
                new SimultaneousEquationGenerator(random, 9, 5).generate(5));
        print("中3 式の展開",
                new ExpansionGenerator(random, 9).generate(5));
        print("中3 因数分解",
                new FactoringGenerator(random, 9).generate(5));
        print("中3 二次方程式",
                new QuadraticEquationGenerator(random, 9).generate(5));
        print("中3 平方根",
                new SquareRootGenerator(random, 9).generate(5));

        // --- 高校 -------------------------------------------------
        // アルゴリズムは中3と同じで、扱う数の範囲だけが広い。
        // クラスは分けず、設定違いのインスタンスで表す
        print("高1 因数分解（発展）",
                new FactoringGenerator(random, 15).generate(5));
        print("高1 二次方程式（発展）",
                new QuadraticEquationGenerator(random, 15).generate(5));
    }

    // 整数の四則を5問作って表示する
    private static void arithmetic(Random random, String title, ArithmeticSetting setting) {
        print(title, new ArithmeticGenerator(random, setting).generate(5));
    }

    // 問題のリストを表示するだけの補助メソッド。
    // 同じ4行を何度も書かないためにまとめている
    private static void print(String title, List<Problem> problems) {
        System.out.println("--- " + title + " ---");
        for (Problem p : problems) {
            System.out.println(p.question() + "   答え: " + p.answer());
        }
        System.out.println();
    }
}
