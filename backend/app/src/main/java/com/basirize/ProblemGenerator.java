package com.basirize;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Random;

// 問題生成における下記共通部分をまとめるファイル
// ①最小値~最大値の範囲におけるランダム整数の生成
// ②重複している問題がないか判定
// ③問題リストの生成
abstract class ProblemGenerator {

    // Random を外から受け取るのは、テストで結果を固定できるようにするため。
    // 中で new Random() すると実行のたびに結果が変わり、
    // 落ちたときに同じ失敗をもう一度起こせなくなる。

    // protected: extend した側からは見える
    // final 一度入れたら二度と変えられない
    // random = new Random() はできない
    protected final Random random;

    // コンストラクタ
    protected ProblemGenerator(Random random) {
        // ↓フィールド ↓引数
        this.random = random;
    }

    // 1問だけ作る。作り方は問題の種類ごとに違うので、ここでは決められない。
    // extends した側が必ず書く（書かないとコンパイルエラー）
    protected abstract Problem generateProblem();

    // 重複しない問題を count 問作る。ここは全種類で同じ
    // Set は同じものを2つ持てない入れ物。add は新しく入ったときだけ true を返すので、
    // それをそのまま重複判定に使える。
    // List を先頭から全部比較する方式より速く、問題数が増えても遅くならない。
    List<Problem> generate(int count) {
        // 完成した問題を入れる空のproblemsリストを作る
        // problemsはユーザーへの提出用
        List<Problem> problems = new ArrayList<>();
        // seenという名前で重複不可のリストを作成
        Set<String> seen = new HashSet<>();

        // 試行回数の上限。これが無いと、作れる種類より多く要求されたときに
        // 永久に止まらない（例：1〜5 の2項たし算で 100 問）
        int limit = count * 100;

        // 試行回数が上限（limit）未満、かつ、必要な問題数（count）がまだ集まってない間は繰り返す（attempt）
        for (int attempt = 0; attempt < limit && problems.size() < count; attempt++) {
            // 1問作り、pに入れる
            // p.question() が seen（重複チェック用）に新規なら、p まるごとを problems に追加
            Problem p = generateProblem();
            // seenの重複不可リストに生成した問題(generateProblem())を追加
            if (seen.add(p.question())) {
                // seenに追加（=重複していない）できればユーザーに返す箱にも追加
                problems.add(p);
            }
        }

        // 作れなかったときは黙って少ない数を返さず、止めて知らせる
        // attempt が上限に達した（100回試しても問題が重複した）らエラーを吐く（IllegalStateException()）
        if (problems.size() < count) {
            throw new IllegalStateException(
                    getClass().getSimpleName() + ": 重複しない問題を " + count
                            + "問作れませんでした（" + problems.size() + "問まで）");
        }
        return problems;
    }

    // 乱数を生成
    // min〜max の範囲の整数を1つ返す。
    // nextInt(n) は 0〜n-1 を返すので、幅を出して min を足している
    protected int randomNumber(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }

    // 0以外の乱数を生成
    // 係数が0だと x² + 0x + 0 のように問題として成立しないことが多いので使う
    // randomNumber(min, max) を最大100回試し、0以外が出たら返す。全部0なら諦める
    protected int randomNonZero(int min, int max) {
        for (int attempt = 0; attempt < 100; attempt++) {
            int value = randomNumber(min, max);
            if (value != 0) {
                return value;
            }
        }
        throw new IllegalStateException("0以外の数を作れませんでした: " + min + "〜" + max);
    }
}
