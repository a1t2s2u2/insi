## リポジトリ概要

LaTeX で書いた日本語数学ノートから PDF と Web サイトを生成するテンプレート。
使い方は `README.md`、変換エンジンの詳細は `tools/site/README.md`。

- `tex/` — 原稿（**唯一の source of truth**）
- `site.config.mjs` / `site-demos.mjs` — サイトの設定と専用図
- `tools/site/` — tex → サイトの変換エンジン
- `site/` — 生成物（git 管理外）

## 執筆方針

- 未定義の用語や概念は、必ず定義し、出典を明示する
- 一般的ではない用語や記法は勝手に使わない
- 数学書の記述スタイルを遵守する
- 事実は本文に述べ、証明・補足・直感は証明環境や `memo*` に分離する

## tex コーディング規約

- 定理環境は `\begin{env}{タイトル}{ラベル}` の形で書く。ラベルの接頭辞は
  `preamble.tex` の環境定義（`def` / `thm` / `prop` / `lem` / `clm` / `cor` / `rem` / `ex`）に合わせる
- 参照は `定義~\ref{def:foo}` のように参照語を付ける。参照語と接頭辞が食い違うと
  サイトのビルドで警告が出る
- 数式マクロは `preamble.tex` にだけ書く。サイト側の設定には書き写さない
  （`tools/site` が自動抽出する）
- `\cite` / `\footnote` / `\verb` はサイトの変換器が解釈しないので本文では使わない
- 章を追加したら `tex/main.tex` の `\input` と `site.config.mjs` の `chapters` の両方を更新する

## ビルド

- tex を変更したら、サイトのビルドまで実施する（`make site`）
- 公開前の検査は `node tools/site/tex2md.mjs . --strict`（CI と同じ）
- PDF は `make pdf`

## Git 運用

- コミットメッセージは `prefix: 日本語` 形式（例 `fix: …`, `docs: …`）
- コミット / PR に co-authored-by や ClaudeCode は記載しない
