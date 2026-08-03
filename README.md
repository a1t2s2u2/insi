# 熊本大学 数学系大学院 過去問・解答

`過去問 院試/` の資料を、年度別の問題・解答サイトとして整理したリポジトリです。
2026・2022・2021・2017・2015年度と、年度を特定できなかった資料を収録しています。

各問題の解答は折りたたみ式です。補助ベクトルや置換を選ぶ理由、微分・積分・行列計算の途中式まで追える粒度でまとめています。
収録した過去問全62題には、証明へ入る前に問題固有の「解答の見通し」を置き、使う定理と式変形の目的を一問ずつ説明しています。
また、収録済みの年度から反復分野を整理した、専門基礎の非公式予想問題集（3題1セット×2回分）を収録しています。
サイト上部の切替で「すべて・専門基礎・専門」を選べます。選択した区分は年度ページを移動しても保持されます。
元資料との対応は [`docs/source-coverage.md`](docs/source-coverage.md) に記録しています。

## サイトを見る

```sh
make site
open site/dist/index.html
```

生成済みの入口は `site/dist/index.html` です。サイト生成には Node.js 22 以上を使います。

## PDF

```sh
make pdf
```

次の6冊を `tex/out/` に生成します。

- `kumadai-basic.pdf` — 専門基礎科目（31題）
- `kumadai-specialized.pdf` — 専門科目（31題）
- `kumadai-textbook.pdf` — 専門基礎科目のための教科書
- `kumadai-reference.pdf` — 解答で使う用語・定義・定理の補足資料
- `kumadai-prediction.pdf` — 専門基礎の出題傾向と予想問題集（模擬2回分・全6題）
- `kumadai-basic-prediction.pdf` — 専門基礎の過去問31題＋予想問題6題の専用統合版

教科書は、専門基礎の問題を解くのに必要な知識を前提から積み上げた一冊です。
`sec` の定義や微分積分の公式表から、行列式・固有値・コンパクト性までを収め、
各節末に「その道具が過去問のどこで使われたか」を記しています。
補足資料が解答を読むための逆引きであるのに対し、教科書は通読して知識を作るための資料です。
単独で作るときは `make pdf-textbook` を使います。

全62題と予想問題集を1冊にまとめた版は `make pdf-combined` で生成できます。
専門基礎だけの専用統合版は `make pdf-basic-combined` で単独生成できます。

## 原稿と生成物

- `tex/main/2026.tex` など: 年度別の問題・解答原稿
- `tex/main/unknown.tex`: 年度不明の問題・解答原稿
- `tex/main/prediction.tex`: 出題傾向と予想問題・解答原稿
- `tex/foundations/reference.tex`: 用語・定義・定理の補足原稿
- `tex/textbook/`: 専門基礎科目のための教科書の原稿（章ごとに分割）
- `tex/kumadai-*.tex`: 分冊 PDF 用ルート原稿
- `tools/split-pdf-sources.mjs`: 年度別原稿を専門基礎・専門へ分けるビルド処理
- `site.config.mjs`: 年度の並び、タイトル、表示設定
- `site/content/`: 自動生成される中間 Markdown
- `site/dist/`: 自動生成される公開用サイト

原稿を直す場合は `tex/` を編集し、`site/content/` や `site/dist/` は直接編集しません。

## 検証

```sh
node tools/site/tex2md.mjs . --strict
make pdf
```

前者は未変換の LaTeX や参照エラーを検査します。後者は6冊の PDF を生成します。
