// tex の \demohint{名前} から差し込む、サイト専用の図。
// tikz の図はサイトでは省略されるので、要点になるものだけ HTML で作り直す。
//
// 戻り値はそのまま HTML として埋め込まれる（エスケープされない）。
// 数式は \\( … \\) で書くと MathJax が描画する。

export function convergenceDemo() {
  return `
<figure aria-label="収束の様子" style="margin:1.5em 0">
  <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;display:block;margin:0 auto">
    <line x1="40" y1="150" x2="400" y2="150" stroke="currentColor" stroke-width="1.2"/>
    <line x1="40" y1="150" x2="40" y2="20" stroke="currentColor" stroke-width="1.2"/>
    <line x1="40" y1="132" x2="400" y2="132" stroke="currentColor" stroke-width="1" stroke-dasharray="5,4" opacity="0.6"/>
    <text x="404" y="136" font-size="12" fill="currentColor">ε</text>
    <text x="404" y="154" font-size="12" fill="currentColor">n</text>
    <circle cx="90"  cy="40"  r="4" fill="currentColor"/>
    <circle cx="140" cy="78"  r="4" fill="currentColor"/>
    <circle cx="190" cy="104" r="4" fill="currentColor"/>
    <circle cx="240" cy="120" r="4" fill="currentColor"/>
    <circle cx="290" cy="130" r="4" fill="currentColor"/>
    <circle cx="340" cy="137" r="4" fill="currentColor"/>
  </svg>
  <figcaption style="text-align:center;font-size:0.9em;color:var(--muted);margin-top:6px">
    収束の様子．\\(d(x_n, x)\\) は有限回で \\(\\varepsilon\\) を下回る．
  </figcaption>
</figure>`;
}
