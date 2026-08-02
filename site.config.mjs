// このノートのサイト設定。
// 変換エンジン本体は tools/site/（触らなくてよい）。ここには文書固有の情報だけを置く。
// 設定できる項目の一覧は tools/site/README.md にある。
//
// 数式マクロは tex/preamble.tex から自動抽出されるので、ここに書き写す必要はない。

export default {
  // --- 表示 ---
  title: "熊本大学 数学系大学院 過去問",
  logo: "KU",
  siteName: "熊本大学 数学系大学院 過去問・解答",
  landingTitle: "大学院入試 過去問",
  landingTagline: "方針から分かる、丁寧な解答",
  landingSubtitle: "熊本大学大学院・数学系の過去問を年度別に整理。<br>過去問全62題を解法の見通しから説明し、過去の傾向に基づく予想問題も収録しています。",
  landingFooter: "過去問は元資料の年度表記・募集区分に従って整理しています。予想問題は収録資料を基に作成した非公式教材です。",

  // --- 章立て ---
  // tex は tex/ からの相対パス。md は site/content/ に出るファイル名で、
  // ページの並び順もこのファイル名のソート順で決まる。
  chapters: [
    { tex: "main/2026.tex", md: "01-2026.md", id: "2026", nav: "2026", eyebrow: "2026年度", title: "2026年度" },
    { tex: "main/2022.tex", md: "02-2022.md", id: "2022", nav: "2022", eyebrow: "2022年度", title: "2022年度" },
    { tex: "main/2021.tex", md: "03-2021.md", id: "2021", nav: "2021", eyebrow: "2021年度", title: "2021年度" },
    { tex: "main/2017.tex", md: "04-2017.md", id: "2017", nav: "2017", eyebrow: "平成29年度", title: "2017年度" },
    { tex: "main/2015.tex", md: "05-2015.md", id: "2015", nav: "2015", eyebrow: "平成27年度", title: "2015年度" },
    { tex: "main/unknown.tex", md: "06-unknown.md", id: "unknown", nav: "年度不明", eyebrow: "YEAR UNKNOWN", title: "年度不明" },
    { tex: "main/prediction.tex", md: "07-prediction.md", id: "prediction", nav: "予想問題", eyebrow: "BASIC MOCK EXAM", title: "専門基礎科目の出題傾向と予想問題集" },
  ],

  // --- 用語集（本文に [term:表示|id] があれば引かれる）---
  blockEnvs: { problem: ["problem", ""] },
  graphTypes: [],
  features: {
    chapterStats: false,
    heroDecoration: false,
    dependencyGraph: false,
    fadeIn: false,
    refPulse: false,
    keyboardHelp: false,
    examTrackFilter: true,
  },
};
