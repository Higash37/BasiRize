package com.basirize;

import java.util.Random;

// like Terms: 同じ種類の項という意味（同類項）
// 3x + 4xのような問題を作る
class LikeTermsGenerator extends ProblemGenerator {

    // 最大値の係数をmaxCoefficientとして定義
    private final int maxCoefficient;

    // LikeTermsGenerator(random, 6)のような形で受け取る
    LikeTermsGenerator(Random random, int maxCoefficient) {
        // 親のコンストラクタを起動
        // 外から受け取ったRandomを親に保存
        // randomはどの問題でも共通部分であるため親に保存
        super(random);
        // 係数は1以上にする
        //
        if (maxCoefficient < 1) {
            throw new IllegalArgumentException("係数の上限は1以上: " + maxCoefficient);
        }
        // 係数を子のコンストラクタに保存
        this.maxCoefficient = maxCoefficient;
    }

    @Override
    protected Problem generateProblem() {
        for (int attempt = 0; attempt < 100; attempt++) {
            int a = randomNumber(1, maxCoefficient);
            int b = randomNumber(1, maxCoefficient);
            // 中1の段階では負の係数の答えは扱いにくいので + と - だけ
            // random.nextBoolean()でtrue or falseを返すので、true であれば加算演算子、falseであれば減算演算子を返す
            Operator operator = random.nextBoolean() ? Operator.ADD : Operator.SUBTRACT;

            // result に加算か減算の式を代入
            int result = operator == Operator.ADD ? a + b : a - b;

            // 答えが0（3x - 3x）やマイナス（5x - 9x = -4など）は捨てる
            if (result <= 0) {
                continue;
            }

            // Polynomial.withVariable(a = 5, "x"),
            // Polynomial.withVariable(b = 3, "x"),
            // question = 5x - 3x = ?
            String question = Polynomial.withVariable(a, "x")
                    + " " + operator.symbol() + " "
                    + Polynomial.withVariable(b, "x") + " = ?";

            // resultの答えに文字を付与する
            // 同類項の計算のため、計算の結果に文字を足すだけで生成
            return new Problem(question, Polynomial.withVariable(result, "x"));
        }
        // 100回同類項問題を作れなければエラーを吐く
        throw new IllegalStateException("同類項の問題を作れませんでした");
    }
}
