#!/usr/bin/env node

// 年度別の source of truth から「専門基礎」と「専門」の章を切り出す。
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

rmSync(generatedDir, { recursive: true, force: true });
for (const kind of ["basic", "specialized"]) {
  mkdirSync(path.join(generatedDir, kind), { recursive: true });
}

const counts = { basic: 0, specialized: 0 };
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
}

if (counts.basic !== 31 || counts.specialized !== 31) {
  throw new Error(`問題数が想定外です: basic=${counts.basic}, specialized=${counts.specialized}`);
}

console.log(`PDF用原稿を生成: 専門基礎 ${counts.basic}題 / 専門 ${counts.specialized}題`);
