package com.basirize;

import java.util.List;

// HttpStatus: 400・404などの状態番号
import org.springframework.http.HttpStatus;
// CrossOrigin: 別URLのフロントからの接続を許可
import org.springframework.web.bind.annotation.CrossOrigin;
// GetMapping: GETリクエストのURLを設定
import org.springframework.web.bind.annotation.GetMapping;
// RequestParam: URLのパラメータを受け取る
import org.springframework.web.bind.annotation.RequestParam;
// @RestController: SpringへこのクラスはHTTPリクエストを受け、結果をJSONで返す入口
import org.springframework.web.bind.annotation.RestController;
// ResponseStatusException: HTTPエラーを返す
import org.springframework.web.server.ResponseStatusException;

// @CrossOrigin(origins = URL)でこのURLからの通信を許可するという意味を持てる
@CrossOrigin(origins = "${app.cors.allowed-origin}")

// このクラスの関数をHTTPの入口にし、戻り値をJSONへ変換している
// List<Problem>を返すとSpringが自動でJSONへ変換する
// Springはコンストラクタをみて、ProblemController(ProblemTypeRegistry registry)
// から、作るにはProblemTypeRegistryが必要なことを判断
@RestController
public class ProblemController {

    // 利用できる問題タイプを持つregistryを保存する
    private final ProblemTypeRegistry registry;

    public ProblemController(ProblemTypeRegistry registry) {
        this.registry = registry;
    }

    // フロントがこのURLへGET通信すると、下のproblemTypes()が動く
    @GetMapping("/api/problem-types")
    public List<ProblemTypeSummary> problemTypes(
            // URLから任意のlevelを受け取る
            // @RequestParam: URLの?以降の値をJava変数へ入れる
            // /api/problem-types?level=中学校が来ると、String levelへ"中学校"が入る
            // (required = false): 省略してもエラーにしない設定。省略時は level = nullになる
            @RequestParam(required = false) String level) {

        // levelにあうProblemType一覧を取得
        // → 1件ずつProblemTypeSummaryへ変換
        // → Listにまとめて返す
        return registry.findByLevel(level).stream()
                .map(type -> ProblemTypeSummary.from(type))
                .toList();
    }

    // フロントがGET /api/problemsへ通信すると直下のproblems()が実行される
    // return はSpringに返される
    // そして @RestControllerが戻り値をJSONにし、Springがフロントに返す
    @GetMapping("/api/problems")
    // Problem(String question, String answer)の一覧を返す、problemsという関数
    // フロントは下記形式でURLを送ることを想定
    // /api/problems?typeId=j3-factoring&count=5
    public List<Problem> problems(
            // URLから問題タイプIDを受け取る
            @RequestParam String typeId,
            // 省略された場合はcountに10が入る
            @RequestParam(defaultValue = "10") int count) {

        // count が1未満、もしくは200より大きければフロントへHTTP400を返す
        // 不正要求を防ぐ
        if (count < 1 || count > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "count は 1〜200 で指定してください");
        }

        // Registryから指定IDの問題タイプを探す
        // 結果はOptionalなので見つからない場合あり
        ProblemType type = registry.findById(typeId)
                // ResponseStatusExceptionを作ってthrowし、HTTP 404を返す
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "そのような問題タイプはありません: " + typeId));

        // 見つけた問題タイプへcount問作ってと依頼し、結果を返す
        try {
            return type.generate(count);
            // 作れなく指定数を用意できない場合、フロントへサーバー故障ではなく要求内容では作れないと伝えるため、サーバー故障の500ではなくエラー400としてフロントへ報告
            // 発生したIllegalStateExceptionをcatchで捕まえ、
            // e.getMessage()でメッセージを取り出す
            // メッセージをResponseStatusException()でHTTP用の例外へ渡す
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
