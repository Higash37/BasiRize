package com.basirize;

import java.util.Random;

// main()内の.run()メソッドでSpringを起動するため
import org.springframework.boot.SpringApplication;
// クラスの中の@SpringBootApplicationで起動地点だと示すため
import org.springframework.boot.autoconfigure.SpringBootApplication;
// @BeanでSpringに管理させるオブジェクトを登録するため
import org.springframework.context.annotation.Bean;

// @SpringBootApplication: このクラスをバックエンド全体の起動地点として使うという目印
@SpringBootApplication
// アプリ起動とproblemTypeRegistryの準備
public class BasirizeApplication {

    public static void main(String[] args) {
        // SpringApplication.run(起点にするクラス, 起動時の追加設定)
        // SpringApplication: Spring起動用クラス
        // run(): Springを起動するメソッド
        // → 対象パッケージを検索（com.basirize）
        // → @RestControllerや@Beanの定義を発見
        // → 必要なオブジェクトを順番に生成
        // BasirizeApplication.class: 起動設定の中心クラスを指定
        // args: 起動時に渡された追加設定
        SpringApplication.run(BasirizeApplication.class, args);
    }

    // @Bean: problemTypeRegistry()で全問題タイプをSpringへ登録する
    // Registry内部には全問題タイプが保存されている
    // Springは登録したRegistryをProblemControllerへ渡す
    @Bean
    // 起動時にSpringがこの関数を呼ぶ
    // ProblemTypeRegistry: 返す型
    // problemTypeRegistry(): 関数名
    //
    ProblemTypeRegistry problemTypeRegistry() {
        // new Random()で乱数生成器を作る
        // Registryのコンストラクタに渡す
        // ProblemTypeRegistry()で新しい台帳を作る
        // return で Springへ返す
        return new ProblemTypeRegistry(new Random());
    }
}
