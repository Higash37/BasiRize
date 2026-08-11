package com.basirize;

import java.util.List;
import java.util.Optional;
import java.util.Random;

// ============================================================
// 問題タイプの一覧（ProblemTypeRegistry）
// ============================================================
// アプリが提供する問題タイプを全部並べ、id で引ける・学年区分で絞れるようにする場所。
//
// ------------------------------------------------------------
// なぜ Controller に直接書かないのか
// ------------------------------------------------------------
// Controller は「HTTP を受けて返す」だけの担当。
// どの問題タイプが存在するかは HTTP と無関係なので、ここに置く。
//
// 分けておくと、Controller は生成器の実装クラスを1つも知らずに済む。
// 問題タイプを増やしても Controller は1文字も変わらない。
//
// ------------------------------------------------------------
// id の付け方
// ------------------------------------------------------------
//   e = elementary（小学校） / j = junior high（中学校） / h = high（高校）
//   後ろは内容を英語で。ハイフン区切り。
//
// id は画面の URL に載るので、変えると古いブックマークが壊れる。
// 一度公開したら変えない前提で付ける。
//
// ------------------------------------------------------------
// Random を1つだけ持つ理由
// ------------------------------------------------------------
// 生成器はコンストラクタで Random を受け取る設計になっている。
// ここで1つ作って全部に配れば、テスト時に new Random(42) を渡すだけで
// アプリ全体の結果を固定できる。
// ============================================================
public final class ProblemTypeRegistry {

    private final List<ProblemType> types;

    public ProblemTypeRegistry(Random random) {
        this.types = List.of(

                // ---- 小学校 ----------------------------------------
                new ProblemType("e1-add-sub", "小学校", "小1",
                        "たし算・ひき算（1桁）",
                        new ArithmeticGenerator(random, Curriculum.grade1AddSubtract())),

                new ProblemType("e2-add-sub-carry", "小学校", "小2",
                        "たし算・ひき算（2桁）",
                        new ArithmeticGenerator(random, Curriculum.grade2AddSubtract())),

                new ProblemType("e2-multiplication-table", "小学校", "小2",
                        "かけ算九九",
                        new ArithmeticGenerator(random, Curriculum.grade2MultiplicationTable())),

                new ProblemType("e3-multiplication", "小学校", "小3",
                        "かけ算",
                        new ArithmeticGenerator(random, Curriculum.grade3Multiplication())),

                // わり算は ArithmeticSetting の範囲が全数に一律で効く制約を避けるため専用クラス
                new ProblemType("e3-exact-division", "小学校", "小3",
                        "わり算（九九の逆）",
                        new ExactDivisionGenerator(random, 9, 9)),

                new ProblemType("e3-remainder-division", "小学校", "小3",
                        "あまりのあるわり算",
                        new RemainderDivisionGenerator(random, 9, 9)),

                new ProblemType("e4-mixed", "小学校", "小4",
                        "四則混合（かっこあり）",
                        new ArithmeticGenerator(random, Curriculum.grade4Mixed())),

                new ProblemType("e4-fraction-same-denominator", "小学校", "小4",
                        "同分母の分数の加減",
                        new FractionGenerator(random, 10,
                                List.of(Operator.ADD, Operator.SUBTRACT), true)),

                new ProblemType("e5-mixed-advanced", "小学校", "小5",
                        "四則混合（発展）",
                        new ArithmeticGenerator(random, Curriculum.grade5Mixed())),

                new ProblemType("e5-fraction-different-denominator", "小学校", "小5",
                        "異分母の分数の加減",
                        new FractionGenerator(random, 12,
                                List.of(Operator.ADD, Operator.SUBTRACT), false)),

                new ProblemType("e6-mixed-final", "小学校", "小6",
                        "四則混合（総まとめ）",
                        new ArithmeticGenerator(random, Curriculum.grade6Mixed())),

                new ProblemType("e6-fraction-multiply-divide", "小学校", "小6",
                        "分数のかけ算・わり算",
                        new FractionGenerator(random, 10,
                                List.of(Operator.MULTIPLY, Operator.DIVIDE), false)),

                // ---- 中学校 ----------------------------------------
                new ProblemType("j1-signed-numbers", "中学校", "中1",
                        "正負の数の計算",
                        new ArithmeticGenerator(random, Curriculum.juniorHigh1SignedNumbers())),

                new ProblemType("j1-like-terms", "中学校", "中1",
                        "文字式（同類項をまとめる）",
                        new LikeTermsGenerator(random, 9)),

                new ProblemType("j1-linear-equation", "中学校", "中1",
                        "一次方程式",
                        new LinearEquationGenerator(random, 10, 9)),

                new ProblemType("j2-simultaneous-equations", "中学校", "中2",
                        "連立方程式",
                        new SimultaneousEquationGenerator(random, 9, 5)),

                new ProblemType("j3-expansion", "中学校", "中3",
                        "式の展開",
                        new ExpansionGenerator(random, 9)),

                new ProblemType("j3-factoring", "中学校", "中3",
                        "因数分解",
                        new FactoringGenerator(random, 9)),

                new ProblemType("j3-quadratic-equation", "中学校", "中3",
                        "二次方程式",
                        new QuadraticEquationGenerator(random, 9)),

                new ProblemType("j3-square-root", "中学校", "中3",
                        "平方根の計算",
                        new SquareRootGenerator(random, 9)),

                // ---- 高校 ------------------------------------------
                // アルゴリズムは中3と同じ。扱う数の範囲だけが広い
                new ProblemType("h1-factoring-advanced", "高校", "高1",
                        "因数分解（発展）",
                        new FactoringGenerator(random, 15)),

                new ProblemType("h1-quadratic-equation-advanced", "高校", "高1",
                        "二次方程式（発展）",
                        new QuadraticEquationGenerator(random, 15)));
    }

    // 学年区分で絞る。指定が無ければ全部返す
    public List<ProblemType> findByLevel(String level) {
        if (level == null || level.isBlank()) {
            return types;
        }
        return types.stream()
                .filter(type -> type.level().equals(level))
                .toList();
    }

    // id で1件引く。
    // 見つからないことは異常ではなく普通に起こる（古いURL、打ち間違い）ので、
    // null ではなく Optional で「無いかもしれない」を型に出す
    public Optional<ProblemType> findById(String id) {
        return types.stream()
                .filter(type -> type.id().equals(id))
                .findFirst();
    }
}
