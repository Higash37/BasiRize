package com.basirize;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// ============================================================
// HTTP の入口（ProblemController）
// ============================================================
// org.springframework を import してよいのは、このクラスと
// BasirizeApplication だけ。生成ロジック側には一切入れない。
//
// このクラスは生成器の実装クラスを1つも知らない。
// ProblemTypeRegistry 経由で問題タイプを取得するだけ。
// 問題タイプを増やしても、このファイルは変わらない。
// ============================================================
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ProblemController {

    private final ProblemTypeRegistry registry;

    // コンストラクタで受け取る（DI）。自分で new しない。
    // 誰が作るかは BasirizeApplication の @Bean が決めている
    public ProblemController(ProblemTypeRegistry registry) {
        this.registry = registry;
    }

    // 問題タイプの一覧。level を省略すると全件返す
    @GetMapping("/api/problem-types")
    public List<ProblemTypeSummary> problemTypes(
            @RequestParam(required = false) String level) {

        return registry.findByLevel(level).stream()
                .map(ProblemTypeSummary::from)
                .toList();
    }

    // 指定された問題タイプの問題を count 問返す
    @GetMapping("/api/problems")
    public List<Problem> problems(
            @RequestParam String typeId,
            @RequestParam(defaultValue = "10") int count) {

        // 送り手の間違いを500（こちらの故障）として返さないよう、入口で弾く
        if (count < 1 || count > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "count は 1〜200 で指定してください");
        }

        ProblemType type = registry.findById(typeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "そのような問題タイプはありません: " + typeId));

        try {
            return type.generate(count);
        } catch (IllegalStateException e) {
            // 「範囲内で作れる問題数より多く要求された」ケース。
            // こちらの故障ではなく要求内容の問題なので400で返す
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
