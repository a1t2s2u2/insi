# template-tex — 日本語数学ノートのテンプレート

LaTeX で書いた数学ノートから、**PDF** と **読むための Web サイト**の両方を生成する。
原稿は `tex/` の 1 か所だけで、サイトはそこから機械的に生成される。

このリポジトリは GitHub の Template repository として使う。
右上の **Use this template** から新しいリポジトリを作れば、そのまま動くサンプルが入っている。

## できること

- **PDF**: uplatex + dvipdfmx。定理環境は tcolorbox で色分けされる
- **サイト**: 章ごとのページ、参照のホバー・クリック表示、依存グラフ、目次、レスポンシブ
- **番号の一致**: サイトの「Def 1.1.1」は PDF の番号と一致する
- **GitHub Pages**: `main` に push すると自動でビルド・公開される

## すぐ試す

```sh
make site   # tex → site/dist/index.html
make open   # 生成したサイトをブラウザで開く
make pdf    # tex → tex/out/main.pdf
```

サイト生成に必要なのは Node.js 22 以上だけ（依存パッケージなし）。
PDF には TeX Live などの日本語 LaTeX 環境が要る。

## 構成

```
tex/                     ← ★ 原稿。編集するのはここだけ
  main.tex                 文書全体の骨組み（章の \input）
  preamble.tex             パッケージ・定理環境・数式マクロ
  .latexmkrc               latexmk の設定（uplatex → dvi → pdf）
  main/*.tex               本編の章
  foundations/*.tex        付録の章
site.config.mjs          ← サイトの設定（章立て・タイトル・用語集）
site-demos.mjs           ← サイト専用の図（任意）
tools/site/              ← 変換エンジン。通常は触らない
site/                    ← 生成物（git 管理外）
  content/*.md             中間表現
  dist/                    公開するサイト
```

## 書き始める

1. `tex/main.tex` のタイトルを変える
2. `tex/main/01_introduction.tex` の中身を自分の内容に差し替える
3. 章を足したら `tex/main.tex` の `\input` と `site.config.mjs` の `chapters` の両方に追加する
4. `make site && make pdf` で確認する

サンプルの章はテンプレートが扱える書き方を一通り含んでいるので、
消す前に一度 `make site` で見ておくとよい。

## 書き方

### 定理環境

```latex
\begin{definition}{距離空間}{metric-space}
  ...
\end{definition}
```

第 1 引数がタイトル、第 2 引数がラベル。`\ref{def:metric-space}` で参照する
（接頭辞は `preamble.tex` の環境定義で決まる）。

使える環境と接頭辞：

| 環境 | 接頭辞 | サイトでの色 |
| --- | --- | --- |
| `definition` | `def` | 青 |
| `theorem` | `thm` | 藍 |
| `proposition` | `prop` | 橙 |
| `lemma` | `lem` | 紫 |
| `claim` | `clm` | 緑 |
| `corollary` | `cor` | シアン |
| `remark` | `rem` | 傍注として表示 |
| `example` | `ex` | 帯として表示 |
| `algorithm` | — | 琥珀 |
| `memo*` | — | 番号なしの補足 |

`\begin{proof}` を定理環境の直後に置くと、サイトでは折りたたみになる。

### 参照

```latex
定義~\ref{def:metric-space} より ...
```

サイトでは「定義 1.1.1」というボタンになり、クリックすると本文が右側に出る。
参照語（定義・定理・命題・補題・主張・系・注意・例）とラベルの接頭辞が
食い違っているとビルド時に警告が出る。

### 図

tikz の図は PDF にだけ出る（サイトでは省略される）。
サイトにも出したい図は `site-demos.mjs` に HTML で書き、
tex 側では行頭に `\demohint{名前}` を置く。

### 数式マクロ

`tex/preamble.tex` に `\newcommand` / `\DeclareMathOperator` で書けば、
サイト側の MathJax にも自動で渡る。**設定に書き写す必要はない**。

MathJax が知らない綴り（stmaryrd の `\llbracket` など）を使う場合だけ、
`site.config.mjs` の `macroOverrides` で等価な書き方に差し替える。

### 使えないもの

サイトの変換器が解釈しないため、本文では避ける（使うとビルド時に警告が出る）。

- `\cite` / `\footnote` — 出典や注は本文中に書くか、`memo*` に入れる
- `\verb` — 記号は数式か引用符で書く
- 章タイトル以外での `\texorpdfstring` 以外の表示用マクロ

## 公開（GitHub Pages）

`main` に push すると `.github/workflows/pages.yml` が tex からサイトを生成して公開する。
生成物をコミットする必要はない。

初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を
**「GitHub Actions」** に設定する。

CI では `--strict` を付けて実行するので、未解決の `\ref` や未変換のマクロがあると
ビルドが失敗する。手元で `node tools/site/tex2md.mjs . --strict` を実行すれば同じ検査ができる。

## エンジンの詳細

設定できる項目、対応している記法、内部構成は [`tools/site/README.md`](tools/site/README.md) にある。
