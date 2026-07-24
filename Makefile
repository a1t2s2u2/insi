# 熊本大学 数学系大学院 過去問・解答
#
# source of truth は tex/*.tex のみ。
# site/ 以下（content/*.md と dist/）はすべて生成物であり、編集も git 管理もしない。

SITE := node tools/site

.PHONY: help all site pdf open clean

help:
	@echo "make site   tex から Web サイトを生成（site/dist/index.html）"
	@echo "make pdf    tex から PDF を生成（tex/out/main.pdf）"
	@echo "make all    site と pdf の両方"
	@echo "make open   生成したサイトをブラウザで開く"
	@echo "make clean  生成物を削除"

all: site pdf

site:
	$(SITE)/tex2md.mjs .
	$(SITE)/build.mjs .
	@echo "→ site/dist/index.html をブラウザで開いてください（make open）"

pdf:
	cd tex && latexmk

open: site
	@open site/dist/index.html 2>/dev/null || xdg-open site/dist/index.html

clean:
	rm -rf site tex/out
