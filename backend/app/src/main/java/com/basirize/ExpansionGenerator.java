package com.basirize;

import java.util.Random;

// 数学展開問題を作成
// ProblemGeneratorの型
// →generate()やrandomNonZero()などを使える
// →親でabstractのgenerateProblem()は必ず返す必要あり
class ExpansionGenerator extends ProblemGenerator {

    // 展開問題で使う数の最大範囲を保存
    // maxRoot = 9であれば後ほど -9~9の範囲から係数を作る
    private final int maxRoot;

    // コンストラクタとしてrandomとmaxRootを保存
    // 呼び出し元は new ExpansionGenerator(random, 9)と宣言
    // int maxRootは呼び出し元が直接整数を渡す
    ExpansionGenerator(Random random, int maxRoot) {
        // super()で親に渡す
        // 親のProblemGeneratorのthis.randomに保存する
        super(random);
        // maxRootが1未満であればエラーを吐く
        if (maxRoot < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxRoot);
        }
        // 問題なければthisでfinal int maxRootに保存
        this.maxRoot = maxRoot;
    }

    // ＠Override: 親(ProblemGenerator)にある同名メソッドの中身を、子で書き換えるという印
    @Override
    protected Problem generateProblem() {
        // 0 を避けるのは (x + 0) が x になってしまい、展開の練習にならないため
        // randomNonZero(最小値, 最大値)にrandomで作ったmaxRootと反転整数を保存
        int p = randomNonZero(-maxRoot, maxRoot);
        int q = randomNonZero(-maxRoot, maxRoot);

        //
        String question = Polynomial.factor(p) + Polynomial.factor(q) + " を展開すると？";
        String answer = Polynomial.quadratic(p + q, p * q);

        return new Problem(question, answer);
    }
}
