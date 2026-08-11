package com.basirize;

// ============================================================
// 問題タイプの一覧用の形（ProblemTypeSummary）
// ============================================================
// API が返す JSON の形。ProblemType をそのまま返さない。
//
// ProblemType は generator を持っている。そのまま返すと JSON 変換器が
// 生成器の中身（Random など）まで出力しようとして壊れる。
// そもそも画面は生成器を必要としていない。
//
// 「内部で使う型」と「外に見せる形」は別物として扱う。
// 内部構造を変えても API の形が変わらない、という利点もある。
// ============================================================
public record ProblemTypeSummary(
        String id,
        String level,
        String grade,
        String title) {

    static ProblemTypeSummary from(ProblemType type) {
        return new ProblemTypeSummary(type.id(), type.level(), type.grade(), type.title());
    }
}
