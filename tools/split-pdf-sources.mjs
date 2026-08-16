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

// 演習用と解答編の原稿。どちらも見出しを本文に出さないので、章・節・問題名は
// \\wbchapter / \\wbsection / \\wbproblem へ畳む（定義は workbook-layout.tex）。
// 問題文の終わりには \\wbend を置き、その下を演習用では解答欄、解答編では解答に使う。
// 解答編だけ、問題に続く proof（解答）を残す。
// memo*（解答の見通し）は教科書・Web 用の補助なので、簡潔さを優先する解答PDFでは落とす。
const problemHead = /\\begin\{problem\}\{([^{}]*)\}\{[^{}]*\}\n/g;

function answerSource(solution, file, title) {
  const answer = solution.replace(
    /^\\begin\{memo\*\}[\s\S]*?\\end\{memo\*\}\s*/,
    "",
  );
  if (!answer) throw new Error(`${file}: 解答がありません: ${title}`);
  return answer;
}

function problemChunks(body) {
  const heads = [...body.matchAll(problemHead)];
  return heads.map((head, index) => {
    const chunk = body.slice(head.index, heads[index + 1]?.index ?? body.length);
    const end = chunk.indexOf("\n\\end{problem}");
    if (end < 0) throw new Error(`problem 環境が閉じていません: ${head[1]}`);
    return {
      title: head[1],
      statement: chunk.slice(head[0].length, end),
      solution: chunk.slice(end + "\n\\end{problem}".length).trim(),
    };
  });
}

function workbookSource(source, sections, file, { chapterTitle, withSolution } = {}) {
  const chapter = source.match(/^\\chapter\{([^{}]*)\}$/m);
  if (!chapter) throw new Error(`${file}: chapter がありません`);

  const lines = [`\\wbchapter{${chapterTitle ?? chapter[1]}}`, ""];

  let count = 0;
  for (const section of sections) {
    const problems = problemChunks(section.body);
    if (problems.length === 0) continue; // 傾向分析など、問題のない節は落とす
    lines.push(`\\wbsection{${section.title}}`, "");
    for (const problem of problems) {
      lines.push(`\\wbproblem{${problem.title}}`, problem.statement, "\\wbend");
      if (withSolution) {
        if (!problem.solution) throw new Error(`${file}: 解答がありません: ${problem.title}`);
        lines.push(answerSource(problem.solution, file, problem.title));
      }
      lines.push("");
      count += 1;
    }
  }
  return { content: lines.join("\n"), count };
}

rmSync(generatedDir, { recursive: true, force: true });
for (const kind of ["workbook", "answers"]) {
  mkdirSync(path.join(generatedDir, kind), { recursive: true });
}

const counts = { workbook: 0, answers: 0 };
for (const year of years) {
  const file = `${year}.tex`;
  const source = readFileSync(path.join(mainDir, file), "utf8");
  const { sections } = sectionParts(source, file);

  const basicSections = sections.filter((section) => category(section.title, file) === "basic");
  for (const [kind, withSolution] of [["workbook", false], ["answers", true]]) {
    const built = workbookSource(source, basicSections, file, { withSolution });
    counts[kind] += built.count;
    writeFileSync(path.join(generatedDir, kind, file), built.content);
  }
}

// 予想問題も同じ演習用原稿に揃える（傾向分析の節は問題を含まないので自然に落ちる）。
// 傾向分析が落ちるぶん、章題からも「出題傾向」を外す。
{
  const file = "prediction.tex";
  const source = readFileSync(path.join(mainDir, file), "utf8");
  const { sections } = sectionParts(source, file);
  const chapterTitle = "専門基礎科目の予想問題集";
  for (const [kind, withSolution] of [["workbook", false], ["answers", true]]) {
    const built = workbookSource(source, sections, file, { chapterTitle, withSolution });
    counts[kind] += built.count;
    writeFileSync(path.join(generatedDir, kind, file), built.content);
  }
}

if (counts.workbook !== 40 || counts.answers !== 40) {
  throw new Error(
    `問題数が想定外です: workbook=${counts.workbook}, answers=${counts.answers}`,
  );
}

console.log(
  `PDF用原稿を生成: 演習用 ${counts.workbook}題 / 解答編 ${counts.answers}題`,
);
