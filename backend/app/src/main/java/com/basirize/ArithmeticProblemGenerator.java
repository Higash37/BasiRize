package com.basirize;

import java.util.Random;
import java.util.ArrayList;
import java.util.List;
// public: ラベル（アクセス修飾子）。誰が使っていいかを表してる。反対語は private（自分のクラスの中だけ）
// class: キーワード。これから class を書くという宣言。java は全てのコードをこの class の中に書く。
// ArithmeticProblemGenerator: class の名前。ファイル名と一致させる。
// {}: クラスの中身が始まる合図

// このプログラムでは「算数の問題をつくること」がゴール
public class ArithmeticProblemGenerator {
    // static: 修飾子。オブジェクトを作らなくても呼べるという意味。JVMが最初に呼ぶ場所は static。
    // void: 戻り値の型。このメソッドは結果を返さないという意味。
    // main: メソッドの名前。なんかないといけないやつ。
    // (String[] args): 引数（パラメータ）。main メソッドが受け取るデータ。String()は文字列の配列。argsはその名前。

    public static void main(String[] args) {
        // 変数宣言 + 代入（assignment）を同時に行っている
        // 型（type） 変数名 = 代入（assignment）;
        int minValue = 1; // 整数。最小値
        int maxValue = 10; // 整数。最大値
        int questionCount = 5; // 整数。何問作るか
        String operationType = "引き算"; // 文字列。演算の種類
        boolean allowNegative = false; // 真偽値（true/falseのみ）。
        // プリミティブ型について
        // int, boolean, double など値そのもの
        // オブジェクト
        // Random, Problem など機能（メソッド）もセットで持っている
        // <>にProblemを入れるというジェネリクスの形
        List<Problem> problems = generateProblems(minValue, maxValue,
                questionCount, operationType,
                allowNegative);
        for (Problem p : problems) {
            System.out.println(p.question());
        }
        for (Problem p : problems) {
            System.out.println("答え：" +
                    p.answer());
        }
    }

    // minValue ~ maxValue の範囲でランダムな整数を1つ作って返す
    static int generateNumber(int minValue, int maxValue, Random random) {
        // 0以上、最大値未満の整数を出力
        // random.nextInt()でランダムな整数を出力
        return random.nextInt(maxValue - minValue + 1) + minValue;
    }

    static boolean containsQuestion(List<Problem> problems, String question) {
        // Problemの中をpとして1つずつ取り出す。
        for (Problem p : problems) {
            // 同じ問題がproblems配列のquestionにあればtrueを返す
            if (p.question().equals(question)) {
                return true;
            }
        }
        return false;
    }

    // 乱数生成と問題を作り1問ずつリストに追加
    // 最終的にProblemをまとめたリストを受け取ることを想定
    static List<Problem> generateProblems(int minValue, int maxValue, int questionCount, String operationType,
            boolean allowNegative) {
        // Randomオブジェクトを作成
        // 乱数を生成する道具
        Random random = new Random();
        // ArrayList（Listの実態）を作成
        // 問題を貯める空の箱
        List<Problem> problems = new ArrayList<>();
        // questionCountの回数だけ中身を繰り返す
        for (int i = 0; i < questionCount; i++) {
            // do-while の外でも使いたいのでこちらで宣言
            String question; // 文字列の問題
            int answer; // 整数の答え
            int operand1; // 数字1
            int operand2; // 数字2
            // do-while。1回中身を実行してから条件をチェックする繰り返し
            // doはforと異なり必ず1回は実行する
            do {
                // generateNumber()を呼んでランダムな整数を2つ格納
                operand1 = generateNumber(minValue, maxValue, random);
                operand2 = generateNumber(minValue, maxValue, random);
                // operationTypeが "引き算"かどうかを判定
                if (operationType.equals("引き算")) {
                    // 引き算であるかつマイナスを許可せず引く数の方が大きいとき operand1 と operand2を入れ替える
                    if (!allowNegative && operand1 < operand2) {
                        int temp = operand1;
                        operand1 = operand2;
                        operand2 = temp;
                    }
                    // 引き算の際の問題と答えを生成
                    question = operand1 + "-" + operand2 + "=?";
                    answer = operand1 - operand2;
                } else {
                    // 足し算の際の問題と答えを生成
                    question = operand1 + "+" + operand2 + "=?";
                    answer = operand1 + operand2;
                }
                // questionをcontainQuestionに渡して結果がtrueならdoをやり直す
            } while (containsQuestion(problems, question));
            problems.add(new Problem(operand1, operand2, question, answer));
        }
        return problems;
    }
}

// record 型名()：Javaのキーワード。複数の値をひとまとめにするだけの入れ物
record Problem(int operand1, int operand2, String question, int answer) {
}