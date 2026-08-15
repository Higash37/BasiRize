package com.basirize;

// ProblemTypeからgeneratorを除く
// フロントはJavaの生成器いらないので、表示に必要な情報だけを変換する
public record ProblemTypeSummary(
        String id,
        String level,
        String grade,
        String title) {

    static ProblemTypeSummary from(ProblemType type) {
        return new ProblemTypeSummary(type.id(), type.level(), type.grade(), type.title());
    }
}
