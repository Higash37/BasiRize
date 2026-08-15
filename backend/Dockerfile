# Java 21の開発道具が入った箱を土台にして、その箱をbuildと呼ぶ
# FROM: Dockerfileの命令（Instruction）
# FROM <イメージ名>:<タグ> AS <ステージ名>で使う
# eclipse-temurin: イメージ名（Eclipse Adoptiumという団体が付けたOpenJDK製品の中のDocker上のイメージ名とのこと）
# 21-jdk: タグ
# （他の選択肢）21-jre: 実行だけ。軽いがコンパイル不可
# （他の選択肢）17-jdk: Java17用
# AS: ステージへ名前を付けるキーワード
# build: ステージ名（名前は変更可能）

FROM eclipse-temurin:21-jdk AS build

# これ以降の作業は/workspaceで行うという意味。なければコンテナ内に作られる。appフォルダと区別するため命名
# WORKDIR: Dockerfileの命令
# /workspace: コンテナ内の作業フォルダ
WORKDIR /workspace

# PCのbackend全体をコンテナの/workspaceへコピー
# COPY <PC側の場所> <コンテナ側の場所>
# 最初の . :backend全ファイル
# 次の . :現在地 /workspace
COPY . .

# コンテナ内のLinuxでGradle Wrapperを実行できるようにする
# RUN <シェルコマンド>で、Dockerイメージ作成中にコマンドを実行する
# RUN: Dockerfileの命令
# RUN <実行ファイル> <タスク> <オプション>
# chmod: ファイルの権限を変更するLinuxコマンド
# +x: 実行権限を追加するオプション
# gradlew: 実行権限を付ける対象ファイル
RUN chmod +x gradlew

# JavaコードからSpring Bootを起動する.jarファイルを作る
# ./gradlew: 現在地にあるGradle Wrapperを起動
# :app:bootJar: appプロジェクトのbootJarタスク
# --no-daemon: 作業後もGradleを常駐させないオプション
RUN ./gradlew :app:bootJar --no-daemon

# FROM <イメージ名>:<タグ> AS <ステージ名>
# 公開用の箱にはコンパイラ不要なので軽いjreを選ぶ（マルチステージビルド）
FROM eclipse-temurin:21-jre AS runtime

# WORKDIR: 作業フォルダを設定するDockerfile命令
# /app: 実行用コンテナ内のフォルダ（/appがなければ自動生成される）
WORKDIR /app

# COPY --from=<ステージ名> <コピー元> <コピー先>
# --from=build：先ほどのbuildステージから取得
# /workspace/.../app.jar：完成したJarの場所
# app.jar：現在地/appへ置く名前
COPY --from=build /workspace/app/build/libs/app.jar app.jar

# ENTRYPOINT ["実行ファイル", "引数1", "引数2"]
# ENTRYPOINT：コンテナ起動時に必ず実行するDockerfile命令
# java：Javaを起動する実行ファイル
# -jar：Jarを実行するJavaのオプション
# app.jar：実行対象
ENTRYPOINT ["java", "-jar", "app.jar"]
