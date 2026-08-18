# 熊本大学 数学系大学院 過去問・解答
#
# source of truth は tex/*.tex のみ。
# site/ 以下（content/*.md と dist/）はすべて生成物であり、編集も git 管理もしない。

SITE := node tools/site

.PHONY: help all site pdf prediction-pdf recent-workbook-pdf cheatsheet last-minute-pdf open clean

help:
	@echo "make site   tex から Web サイトを生成（site/dist/index.html）"
	@echo "make pdf    演習用・解答編・予想問題・2023--2025過去問の4 PDFを生成"
	@echo "make prediction-pdf  予想問題6題だけのPDFを生成"
	@echo "make recent-workbook-pdf  2023--2025年度過去問15題だけのPDFを生成"
	@echo "make cheatsheet  専門基礎4枚の16:9チートシート（PDF・PNG）を生成"
	@echo "make last-minute-pdf  2027年度入試の直前演習・予想問題PDFを生成"
	@echo "make all    site と pdf の両方"
	@echo "make open   生成したサイトをブラウザで開く"
	@echo "make clean  生成物を削除"

all: site pdf

site:
	$(SITE)/tex2md.mjs .
	$(SITE)/build.mjs .
	@echo "→ site/dist/index.html をブラウザで開いてください（make open）"

pdf:
	node tools/split-pdf-sources.mjs .
	cd tex && latexmk kumadai-workbook.tex kumadai-workbook-answers.tex kumadai-prediction.tex kumadai-workbook-2023-2025.tex

prediction-pdf:
	node tools/split-pdf-sources.mjs .
	cd tex && latexmk kumadai-prediction.tex

recent-workbook-pdf:
	cd tex && latexmk kumadai-workbook-2023-2025.tex

cheatsheet:
	cd tex/cheatsheet && latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=../out kumadai-cheatsheet.tex
	mkdir -p tex/out/cheatsheet-pages
	pdftoppm -png -scale-to-x 3840 -scale-to-y 2160 tex/out/kumadai-cheatsheet.pdf tex/out/cheatsheet-pages/kumadai-cheatsheet

last-minute-pdf:
	cd tex && latexmk last-minute-2027.tex

open: site
	@open site/dist/index.html 2>/dev/null || xdg-open site/dist/index.html

clean:
	rm -rf site tex/out tex/generated
