package com.basirize;

import java.util.List;

// 画面に出す問題情報とGeneratorを1セットにする箱
public record ProblemType(
        String id,
        String level,
        String grade,
        String title,
        ProblemGenerator generator) {

    // 問題をcount問作ってと保存しているGeneratorに依頼できる
    // 例えば、保存された生成器がFactoringGeneratorなら、重複しない因数分解問題を5問作り、List<Problem>で返す
    public List<Problem> generate(int count) {
        return generator.generate(count);
    }
}
