# TROUBLESHOOTING

開発中に発生したエラーと、その原因・対応の記録。同じ問題に再度ハマったときの時短用。

---

## VS Codeの「Create Java Project」でGradleのダウンロードが失敗する

### 現象

`Java: Create Java Project` → Gradleプロジェクト作成時、`Configuring...` の読み込みが終わらない。出力パネル（Gradle for Java）を見ると、以下のエラーが出ている。

```
[error] [gradle-server] Could not execute build using connection to Gradle distribution
'https://services.gradle.org/distributions/gradle-9.2.0-bin.zip'.
```

### 原因

VS Code拡張機能からのダウンロードだけが失敗する（ブラウザで同じURLを開くと普通にダウンロードできる）。VS Code側の通信方法（プロキシ設定やタイムアウトなど）が影響していると見られるが、根本原因は未特定。

### 対応

VS Code拡張機能によるプロジェクト作成には頼らず、Gradleを手動でインストールして使う。

1. ブラウザから `gradle-9.2.0-bin.zip` をダウンロードして展開（例: `C:\Gradle\gradle-9.2.0`）
2. `C:\Gradle\gradle-9.2.0\bin` をユーザー環境変数 `Path` に追加
3. 新しいターミナルで `gradle -v` が通ることを確認
4. `mkdir backend && cd backend` の上で、`gradle init` を直接実行してプロジェクトを作成

```
gradle init --type java-application --dsl groovy --test-framework junit-jupiter --package com.basirize --project-name backend
```

---

## コンソール出力の日本語が文字化けする

### 現象

`./gradlew run` の実行結果で、半角文字（`7-3=?`など）は正しく表示されるのに、日本語部分（`答え：`）だけ文字化けする。

```
7-3=4
・ｽ・ｽ・ｽ・ｽ・ｽF4
```

### 原因

2段階の原因があった。

1. **コンパイル時**: Gradleの`JavaCompile`タスクが、ソースファイル（UTF-8で保存されている）を読み込む際の文字コードを明示的に指定していなかったため、意図しない文字コードで解釈され、文字列リテラルの時点で壊れていた。
2. （切り分けの過程で）実行時の標準出力エンコーディングも疑ったが、こちらは実際の原因ではなかった。ただし念のため明示しておく価値はある。

`./gradlew run -q > output.txt` でファイルに書き出し、VS Codeでそのファイルを開いて確認したことで「実データが壊れている（ターミナル表示だけの問題ではない）」と切り分けられた。

### 対応

`backend/app/build.gradle` に、コンパイル時の文字コードを明示的に指定する設定を追加する。

```groovy
tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
}
```

設定変更後は `./gradlew clean run` で、キャッシュされた古いビルド結果を確実に消してから再実行する。

（参考: Git Bashのターミナル上ではこの修正後も表示が崩れて見えることがあるが、それはターミナル側の表示設定の問題であり、データ自体は正常。`output.txt`のような実ファイルで確認すれば判別できる。）

---

## 新しいテストファイルを作ると「宣言されたパッケージが一致しない」警告が出る

### 現象

`src/test/java/com/basirize/` に新しいJavaファイルを作成すると、VS Codeがこう警告する。

```
The declared package "com.basirize" does not match the expected package "backend.app.src.test.java...
```

### 原因

VS Code（Javaの言語サーバー）が、新しく作られた`src/test/java`配下のファイルを、Gradleのソースセットの一部としてまだ認識できていない。実際のコードやパッケージ宣言に誤りがあるわけではない。

### 対応

コマンドパレット（`Ctrl+Shift+P`）から以下を実行し、プロジェクト構成を再読み込みする。

```
Java: Reload Projects
```

これで直らない場合は、より強めの再読み込みを試す（VS Codeの再起動を伴う）。

```
Java: Clean Java Language Server Workspace
```
