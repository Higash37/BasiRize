# CLAUDE.md（backend）

## 役割

問題生成ロジックを持ち、REST API として画面に提供する。

## 技術構成

Java 21 / Spring Boot / Gradle / JUnit 5

DB・Docker・認証・AI連携は入れない。

## コマンド

```
./gradlew run       Main を起動（目視確認用）
./gradlew bootRun   サーバーを起動
```

## 守ること

**org.springframework を import してよいのは ProblemController と BasirizeApplication だけ**

問題を作るクラスに Spring が混ざると、そのクラスを1つ試すだけでサーバーの起動が必要になる。
いまは問題生成だけを JUnit で単体で動かせる状態を保っている。
破ってもコンパイルは通るので、書いておかないと守れない。

**Random はコンストラクタで外から受け取る**

クラスの中で `new Random()` を書くと、毎回違う問題が出る。
テストで「この乱数ならこの問題が出るはず」と確かめられなくなる。

**問題文と答えは Problem 1つにまとめる**

問題のリストと答えのリストを別々に持つと、3番の問題と3番の答えがズレても誰も気づけない。
セットで持てばズレようがない。

**一度決めた問題タイプの id は変えない**

id は画面のURLに載っている（`/options?typeId=e1-add-sub`）。
変えると、それまでに開いていたURLやブックマークが全部使えなくなる。

## 環境の罠

**Spring Boot 4系を使っている。ネット上の記事はほぼ3系で、そのままでは動かない**

```
spring-boot-starter-web   → spring-boot-starter-webmvc
spring-boot-starter-test  → spring-boot-starter-webmvc-test
```

依存名を確認するときは記事ではなく https://start.spring.io で同じ条件を選び、
生成される build.gradle を見る。

**build.gradle に UTF-8 指定が2箇所必要**

コンパイル時（ソース中の日本語を読む）と実行時（println を表示する）は別の設定。
片方だけだと、もう片方で文字化けする。

**bootRun が Main を起動してしまうことがある**

application プラグインが入っていると、bootRun は `springBoot { mainClass }` ではなく
`application { mainClass }` を見る。`tasks.named('bootRun')` で直接上書きする。
