package com.basirize;

import java.util.Random;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BasirizeApplication {

    public static void main(String[] args) {
        SpringApplication.run(BasirizeApplication.class, args);
    }

    // ------------------------------------------------------------
    // @Bean：Springに「これを1つ作って管理してくれ」と頼む印
    // ------------------------------------------------------------
    // 起動時にこのメソッドが1回だけ呼ばれ、戻り値がSpringの中に保管される。
    // ProblemController のコンストラクタが ProblemTypeRegistry を要求すると、
    // Springがここで作ったものを渡す。これがDI（依存性の注入）。
    //
    // Controller が自分で new しないので、テスト時には別の Registry
    // （例：new Random(42) を使ったもの）に差し替えられる。
    //
    // Registry 側に印を付けず、ここで作っているのは、
    // 生成ロジック側に org.springframework を一切入れないため。
    // ------------------------------------------------------------
    @Bean
    ProblemTypeRegistry problemTypeRegistry() {
        return new ProblemTypeRegistry(new Random());
    }
}
