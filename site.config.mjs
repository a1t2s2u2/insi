// このノートのサイト設定。
// 変換エンジン本体は tools/site/（触らなくてよい）。ここには文書固有の情報だけを置く。
// 設定できる項目の一覧は tools/site/README.md にある。
//
// 数式マクロは tex/preamble.tex から自動抽出されるので、ここに書き写す必要はない。

import { convergenceDemo } from "./site-demos.mjs";

export default {
  // --- 表示 ---
  title: "ノートのタイトル",
  logo: "N",
  siteName: "ノートのタイトル",
  landingSubtitle: "副題",
  landingFooter: "",

  // --- 章立て ---
  // tex は tex/ からの相対パス。md は site/content/ に出るファイル名で、
  // ページの並び順もこのファイル名のソート順で決まる。
  chapters: [
    {
      tex: "main/01_introduction.tex",
      md: "01-introduction.md",
      id: "introduction",
      group: "main",
      nav: "距離空間",
      eyebrow: "1. Metric Spaces",
      title: "距離空間と収束",
    },
    {
      tex: "foundations/00_preliminaries.tex",
      md: "A0-preliminaries.md",
      id: "preliminaries",
      group: "appendix",
      nav: "集合と写像",
      eyebrow: "付録 A. Sets & Maps",
      title: "集合と写像",
    },
  ],

  // --- 用語集（本文に [term:表示|id] があれば引かれる）---
  glossary: {
    metric: {
      title: "距離",
      body: "正値性・対称性・三角不等式をみたす二変数関数。",
    },
  },

  // --- tex の \demohint{名前} から差し込む図 ---
  demos: {
    convergence: convergenceDemo,
  },
};
