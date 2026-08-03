#!/usr/bin/env node

// 年度別の source of truth から「専門基礎」と「専門」の章を切り出す。
// あわせて、専門基礎と予想問題から解答・解説を落とした演習用原稿も作る。
// 生成先 tex/generated/ は PDF ビルド専用で、手では編集しない。

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const seminarDir = path.resolve(process.argv[2] ?? ".");
const texDir = path.join(seminarDir, "tex");
const mainDir = path.join(texDir, "main");
const generatedDir = path.join(texDir, "generated");
const years = ["2026", "2022", "2021", "2017", "2015", "unknown"];

function sectionParts(source, file) {
  const matches = [...source.matchAll(/^\\section\{([^}]*)\}/gm)];
  if (matches.length === 0) throw new Error(`${file}: section がありません`);

  const header = source.slice(0, matches[0].index);
  const sections = matches.map((match, index) => ({
    title: match[1],
    body: source.slice(match.index, matches[index + 1]?.index ?? source.length),
  }));
  return { header, sections };
}

function category(title, file) {
  if (title.includes("専門基礎科目")) return "basic";
  if (title.includes("専門科目")) return "specialized";
  throw new Error(`${file}: 区分できない section: ${title}`);
}

// 演習用原稿。問題文の本文だけを残し、memo* と proof（解答）は落とす。
// 見出しは本文に出さず、柱と目次にだけ回すため、章・節・問題名は
// \wbchapter / \wbsection / \wbproblem へ畳む（定義は kumadai-workbook.tex）。
// 各問題の直後の \answerspace 以降が、そのページの解答欄になる。
const problemPattern =
  /\\begin\{problem\}\{([^{}]*)\}\{[^{}]*\}\n([\s\S]*?)\n\\end\{problem\}/g;

function workbookSource(source, sections, file, chapterTitle) {
  const chapter = source.match(/^\\chapter\{([^{}]*)\}$/m);
  if (!chapter) throw new Error(`${file}: chapter がありません`);

  const lines = [`\\wbchapter{${chapterTitle ?? chapter[1]}}`, ""];

  let count = 0;
  for (const section of sections) {
    const problems = [...section.body.matchAll(problemPattern)];
    if (problems.length === 0) continue; // 傾向分析など、問題のない節は落とす
    lines.push(`\\wbsection{${section.title}}`, "");
    for (const [, title, body] of problems) {
      lines.push(`\\wbproblem{${title}}`, body, "\\answerspace", "");
      count += 1;
    }
  }
  return { content: lines.join("\n"), count };
}

rmSync(generatedDir, { recursive: true, force: true });
for (const kind of ["basic", "specialized", "workbook"]) {
  mkdirSync(path.join(generatedDir, kind), { recursive: true });
}

const counts = { basic: 0, specialized: 0, workbook: 0 };
for (const year of years) {
  const file = `${year}.tex`;
  const source = readFileSync(path.join(mainDir, file), "utf8");
  const { header, sections } = sectionParts(source, file);

  for (const kind of ["basic", "specialized"]) {
    const selected = sections.filter((section) => category(section.title, file) === kind);
    const content = `${header}${selected.map((section) => section.body).join("")}`;
    const problemCount = [...content.matchAll(/^\\begin\{problem\}/gm)].length;
    if (problemCount === 0) throw new Error(`${file}: ${kind} の問題がありません`);
    counts[kind] += problemCount;
    writeFileSync(path.join(generatedDir, kind, file), content);
  }

  const basicSections = sections.filter((section) => category(section.title, file) === "basic");
  const workbook = workbookSource(source, basicSections, file);
  counts.workbook += workbook.count;
  writeFileSync(path.join(generatedDir, "workbook", file), workbook.content);
}

// 予想問題も同じ演習用原稿に揃える（傾向分析の節は問題を含まないので自然に落ちる）。
// 傾向分析が落ちるぶん、章題からも「出題傾向」を外す。
{
  const file = "prediction.tex";
  const source = readFileSync(path.join(mainDir, file), "utf8");
  const { sections } = sectionParts(source, file);
  const workbook = workbookSource(source, sections, file, "専門基礎科目の予想問題集");
  counts.workbook += workbook.count;
  writeFileSync(path.join(generatedDir, "workbook", file), workbook.content);
}

if (counts.basic !== 31 || counts.specialized !== 31 || counts.workbook !== 37) {
  throw new Error(
    `問題数が想定外です: basic=${counts.basic}, specialized=${counts.specialized}, workbook=${counts.workbook}`,
  );
}

console.log(
  `PDF用原稿を生成: 専門基礎 ${counts.basic}題 / 専門 ${counts.specialized}題 / 演習用 ${counts.workbook}題`,
);
