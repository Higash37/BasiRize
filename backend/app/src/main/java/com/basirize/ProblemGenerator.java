package com.basirize;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

// ============================================================
// 問題生成器の共通部分（ProblemGenerator）
// ============================================================
// 問題の種類は10以上あるが、次の3つはどれも同じ処理になる。
//
//   ・重複しない問題を count 問集める
//   ・作れなかったときに止めて知らせる
//   ・範囲内のランダムな整数を1つ作る
//
// 同じコードを種類の数だけ書くと、直すときに全部を直すことになる。
// 共通部分をここに1回だけ書き、違うところだけ各クラスが書く形にする。
//
// ------------------------------------------------------------
// abstract（抽象クラス）とは
// ------------------------------------------------------------
// 「一部だけ中身が決まっているクラス」のこと。
//
//   interface   中身は一切書かない。約束だけ
//   abstract    共通の中身は書く。決まらないところだけ空けておく
//   class       全部書く
//
// ここでは generate() の中身は書けるが、generateProblem()（1問の作り方）は
// 問題の種類ごとに違うので書けない。そこだけ空けて abstract にしてある。
//
// abstract なメソッドがあるクラスは、そのままでは new できない。
//   new ProblemGenerator(random)   ← 書けない。1問の作り方が決まっていないので
//
// 使うときは extends して、空いているところを埋める。
//   class ExpansionGenerator extends ProblemGenerator {
//       protected Problem generateProblem() { ... }   ← ここを埋める
//   }
//
// ------------------------------------------------------------
// protected とは
// ------------------------------------------------------------
// アクセス修飾子の1つ。extends した側からは見えるが、外からは見えない。
//
//   public      どこからでも
//   protected   自分と、extends した側
//   （何も書かない）  同じ package の中
//   private     自分だけ
//
// random や randomNumber() は各生成器が使うので protected。
// 外から直接触る必要はないので public にはしない。
// ============================================================
abstract class ProblemGenerator {

    // Random を外から受け取るのは、テストで結果を固定できるようにするため。
    // 中で new Random() すると実行のたびに結果が変わり、
    // 落ちたときに同じ失敗をもう一度起こせなくなる。
    protected final Random random;

    protected ProblemGenerator(Random random) {
        this.random = random;
    }

    // 1問だけ作る。作り方は問題の種類ごとに違うので、ここでは決められない。
    // extends した側が必ず書く（書かないとコンパイルエラー）
    protected abstract Problem generateProblem();

    // 重複しない問題を count 問作る。ここは全種類で同じ
    //
    // Set は同じものを2つ持てない入れ物。add は新しく入ったときだけ true を返すので、
    // それをそのまま重複判定に使える。
    // List を先頭から全部比較する方式より速く、問題数が増えても遅くならない。
    List<Problem> generate(int count) {
        List<Problem> problems = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        // 試行回数の上限。これが無いと、作れる種類より多く要求されたときに
        // 永久に止まらない（例：1〜5 の2項たし算で 100 問）
        int limit = count * 100;

        for (int attempt = 0; attempt < limit && problems.size() < count; attempt++) {
            Problem p = generateProblem();
            if (seen.add(p.question())) {
                problems.add(p);
            }
        }

        // 作れなかったときは黙って少ない数を返さず、止めて知らせる
        if (problems.size() < count) {
            throw new IllegalStateException(
                    getClass().getSimpleName() + ": 重複しない問題を " + count
                            + "問作れませんでした（" + problems.size() + "問まで）");
        }
        return problems;
    }

    // min〜max の範囲の整数を1つ返す。
    // nextInt(n) は 0〜n-1 を返すので、幅を出して min を足している
    protected int randomNumber(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }

    // 0以外の整数を1つ返す。
    // 係数が0だと x² + 0x + 0 のように問題として成立しないことが多いので使う
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
