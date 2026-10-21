#!/usr/bin/env node
// 하네스 게이트 판정 스크립트.
//   node scripts/verify.mjs               G1~G4 전체 + harness/out/s5-report.md 저장 (G5)
//   node scripts/verify.mjs --gate G3     한 게이트만
//   --no-build                            G4에서 build·lint 생략 (개발용)
// 종료 코드: 0 통과 / 1 실패. 마지막 줄에 "복귀 단계: S#"를 출력한다.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  ROOT, readText, exists, loadConfig, tokenKeys, expectedThemeVars, parseThemeCss,
  scanLines, scanFile, collectRoutes, listFiles,
} from "./lib/rules.mjs";

const args = process.argv.slice(2);
const only = args.includes("--gate") ? args[args.indexOf("--gate") + 1] : null;
const noBuild = args.includes("--no-build");
const config = loadConfig();
const toSpecRoute = (r) => r.replace(/\[(\w+)\]/g, ":$1");

// 실패 종류 → 복귀 단계 (R3 확정표)
const BACK = { pii: "S4", price: "S4", open: "S4", token: "S4", tokenCss: "S3", route: "S2", scope: "S4", build: "S4", req: "S1", spec: "S2" };

const results = [];
const fail = (gate, rule, where, msg) => {
  results.push({ gate, rule, where, msg, back: BACK[rule] });
};

// ---------- G1: 요구사항 ----------
function g1() {
  const rel = config.sources.requirements;
  if (!exists(rel)) return fail("G1", "req", rel, "파일이 없음");
  const doc = readText(rel);
  for (const s of config.screens) if (!doc.includes(s.name)) fail("G1", "req", rel, `화면이 없음: ${s.name}`);
  const prdIds = [...new Set(readText(config.sources.prd).match(/\bF-[A-Z]\d+\b/g) ?? [])];
  const missing = prdIds.filter((id) => !new RegExp(`\\b${id}\\b`).test(doc));
  for (const id of missing) fail("G1", "req", rel, `기능 ID가 없음: ${id}`);
  return `화면 ${config.screens.length}개, 기능 ID ${prdIds.length - missing.length}/${prdIds.length}`;
}

// ---------- G2: 화면 명세 ----------
function g2() {
  const rel = config.sources.screenSpec;
  if (!exists(rel)) return fail("G2", "spec", rel, "파일이 없음");
  const doc = readText(rel);
  for (const s of config.screens) {
    if (!doc.includes(s.name)) fail("G2", "spec", rel, `화면이 없음: ${s.name}`);
    if (!doc.includes(toSpecRoute(s.route)) && !doc.includes(s.route)) fail("G2", "route", rel, `라우트가 없음: ${s.route}`);
  }
  return `라우트 ${config.screens.length}개 대조`;
}

// ---------- G3: 토큰 ----------
function g3() {
  const rel = config.sources.tokensCss;
  if (!exists(config.sources.typography)) fail("G3", "tokenCss", config.sources.typography, "파일이 없음");
  if (!exists(rel)) return fail("G3", "tokenCss", rel, "파일이 없음");
  const { vars, hasReset } = parseThemeCss(readText(rel));
  const want = expectedThemeVars(config);
  if (!hasReset) fail("G3", "tokenCss", rel, "--*: initial (기본 테마 끄기)이 없음");
  for (const [k, v] of want) {
    if (!vars.has(k)) fail("G3", "tokenCss", rel, `빠진 변수: ${k}`);
    else if (k === "--font-sans" ? !vars.get(k).includes(v) : vars.get(k).toLowerCase() !== v.toLowerCase())
      fail("G3", "tokenCss", rel, `값이 다름: ${k} = ${vars.get(k)} (기준 ${v})`);
  }
  for (const k of vars.keys()) if (!want.has(k)) fail("G3", "tokenCss", rel, `토큰 밖 변수: ${k}`);
  return `변수 ${want.size}개 기준, tokens.css ${vars.size}개`;
}

// ---------- G4: 화면 구현 ----------
function g4() {
  // ① 라우트 수 = 화면 수, ② 범위 밖 라우트
  const found = collectRoutes("app");
  const want = new Set(config.screens.map((s) => s.route));
  const plans = found.filter((r) => r.route.startsWith("/plans"));
  if (plans.length !== want.size) fail("G4", "route", "app/plans", `화면 ${want.size}개 ≠ 라우트 ${plans.length}개`);
  for (const r of want) if (!found.some((f) => f.route === r)) fail("G4", "route", "app", `라우트가 없음: ${r}`);
  for (const f of found)
    if (!want.has(f.route) && !config.extraRoutesAllowed.includes(f.route)) fail("G4", "scope", f.file, `범위 밖 라우트: ${f.route}`);

  // ③~⑥ 개인정보·요금 표시·미정·토큰 밖 값
  const keys = tokenKeys(config);
  const files = listFiles("app", /\.(tsx?|jsx?|css|mjs)$/);
  for (const rel of files) {
    const text = readText(rel);
    for (const v of [...scanLines(text, rel, config, keys), ...scanFile(text, rel, config)]) fail("G4", v.rule, `${rel}:${v.line}`, v.msg);
  }
  const globals = config.sources.globalsCss;
  if (exists(globals) && !readText(globals).includes("../styles/tokens.css")) fail("G4", "token", globals, "styles/tokens.css를 import하지 않음");

  // ⑦ build·lint
  if (!noBuild) {
    for (const script of ["build", "lint"]) {
      const r = spawnSync("npm", ["run", script], { cwd: ROOT, encoding: "utf8" });
      if (r.status !== 0) {
        const tail = `${r.stdout}\n${r.stderr}`.trim().split("\n").slice(-15).join("\n");
        fail("G4", "build", `npm run ${script}`, `실패\n${tail}`);
      }
    }
  }
  return `라우트 ${found.length}개, 검사 파일 ${files.length}개${noBuild ? ", build·lint 생략" : ""}`;
}

// ---------- 실행 ----------
const GATES = { G1: g1, G2: g2, G3: g3, G4: g4 };
const run = only ? [only] : Object.keys(GATES);
if (only && !GATES[only]) {
  console.error(`알 수 없는 게이트: ${only} (G1~G4)`);
  process.exit(1);
}

const lines = [];
for (const g of run) {
  const before = results.length;
  const summary = GATES[g]() ?? "";
  const n = results.length - before;
  lines.push(`${n === 0 ? "✓" : "✗"} ${g} ${n === 0 ? "통과" : `실패 ${n}건`} — ${summary}`);
  for (const r of results.slice(before)) lines.push(`    [${r.gate}] ${r.where} — ${r.msg} (복귀: ${r.back})`);
}
const order = ["S1", "S2", "S3", "S4"];
const back = results.length ? order.find((s) => results.some((r) => r.back === s)) : null;
lines.push(back ? `복귀 단계: ${back}` : "복귀 단계: 없음 (모두 통과)");
console.log(lines.join("\n"));

if (!only) {
  const rel = config.sources.report;
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  const md = [
    "# S5 판정 보고서",
    "",
    `- 실행: ${new Date().toISOString()}`,
    `- 결과: ${results.length ? `실패 ${results.length}건` : "통과"}`,
    `- 복귀 단계: ${back ?? "없음"}`,
    "",
    "| 게이트 | 위치 | 내용 | 복귀 |",
    "|---|---|---|---|",
    ...results.map((r) => `| ${r.gate} | ${r.where} | ${r.msg.split("\n")[0]} | ${r.back} |`),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, rel), md);
}
process.exit(results.length ? 1 : 0);
