// 하네스 규칙 모음. verify.mjs(게이트)와 hooks/guard.mjs(훅)가 같은 정의를 쓴다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const readText = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
export const readJson = (rel) => JSON.parse(readText(rel));
export const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
export const loadConfig = () => readJson("harness/config.json");

// ---------- 토큰 ----------

const px = (n) => `${n}px`;

function readTypography(config) {
  return exists(config.sources.typography) ? readJson(config.sources.typography) : { lineHeight: {}, fontWeight: {} };
}

// token.json + typography.json → 허용 키 집합
export function tokenKeys(config) {
  const t = readJson(config.sources.tokens);
  const typo = readTypography(config);
  const after = (k) => k.slice(k.indexOf("/") + 1);
  return {
    colors: new Set(Object.keys(t.semantic.Default).map((k) => k.replace(/\//g, "-"))),
    fontSizes: new Set(Object.keys(t.typography.Default).filter((k) => k.startsWith("font-size/")).map(after)),
    spacing: new Set(Object.keys(t.spacing.Default).map(after)),
    radius: new Set(Object.keys(t.radius.Default).map(after)),
    weights: new Set(Object.keys(typo.fontWeight ?? {})),
  };
}

// G3: tokens.css에 있어야 할 변수 이름 → 값
export function expectedThemeVars(config) {
  const t = readJson(config.sources.tokens);
  const typo = readTypography(config);
  const vars = new Map();
  const after = (k) => k.slice(k.indexOf("/") + 1);
  for (const [k, v] of Object.entries(t.semantic.Default)) vars.set(`--color-${k.replace(/\//g, "-")}`, v.hex.toLowerCase());
  for (const [k, v] of Object.entries(t.typography.Default)) {
    if (k.startsWith("font-size/")) vars.set(`--text-${after(k)}`, px(v));
    if (k.startsWith("font-family/")) vars.set("--font-sans", v);
  }
  for (const [k, v] of Object.entries(typo.lineHeight ?? {})) vars.set(`--text-${after(k)}--line-height`, px(v));
  for (const [k, v] of Object.entries(typo.fontWeight ?? {})) vars.set(`--font-weight-${k}`, String(v));
  for (const [k, v] of Object.entries(t.spacing.Default)) vars.set(`--spacing-${after(k)}`, px(v));
  for (const [k, v] of Object.entries(t.radius.Default)) vars.set(`--radius-${after(k)}`, px(v));
  return vars;
}

// tokens.css의 @theme 안 선언 → { vars, hasReset }
export function parseThemeCss(css) {
  const vars = new Map();
  let hasReset = false;
  const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const block of body.matchAll(/@theme[^{]*\{([\s\S]*?)\}/g)) {
    for (const m of block[1].matchAll(/(--[\w*-]+)\s*:\s*([^;]+);/g)) {
      if (m[1] === "--*" && m[2].trim() === "initial") hasReset = true;
      else vars.set(m[1], m[2].trim());
    }
  }
  return { vars, hasReset };
}

// ---------- 클래스 검사 ----------

const SIZE_PREFIXES = [
  "space-x", "space-y", "gap-x", "gap-y", "inset-x", "inset-y", "translate-x", "translate-y",
  "min-w", "min-h", "max-w", "max-h", "basis", "inset", "size", "gap", "top", "right", "bottom", "left",
  "px", "py", "pt", "pr", "pb", "pl", "ps", "pe", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me", "p", "m", "w", "h",
];
const SIZE_RE = new RegExp(`^(${SIZE_PREFIXES.join("|")})-(.+)$`);
const SIZE_KW = new Set(["auto", "full", "screen", "fit", "min", "max", "svh", "lvh", "dvh", "svw", "lvw", "dvw", "reverse"]);
const TEXT_KW = new Set(["left", "center", "right", "justify", "start", "end", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"]);
const COLOR_KW = new Set(["transparent", "current", "inherit"]);
const BORDER_KW = new Set(["solid", "dashed", "dotted", "double", "hidden", "none", "collapse", "separate", "0", "2", "4", "8"]);
const COLOR_UTILS = /^(bg|ring|outline|fill|stroke|divide|accent|caret|decoration|placeholder)-(.+)$/;

// 한 클래스 토큰 → 위반 설명 또는 null
export function checkClass(raw, keys) {
  let tok = raw.split(":").pop().replace(/^!/, "").replace(/^-/, "");
  if (!/^[a-z][\w-]*(\/\d+)?$/.test(tok)) return null; // 클래스 모양이 아니면 건너뜀
  if (/\/\d+$/.test(tok) && /^(text|bg|border|ring|outline|fill|stroke|divide|from|via|to)-/.test(tok))
    return "투명도 수정자(/숫자)는 토큰에 없음";
  if (/^(leading|tracking)-/.test(tok)) return "줄 높이·자간은 text-* 글자 크기 토큰에 포함됨";

  let m;
  if ((m = tok.match(/^rounded(?:-(?:tl|tr|br|bl|ss|se|es|ee|t|r|b|l|s|e))?(?:-(.+))?$/))) {
    if (!m[1]) return "기본 rounded는 토큰 없음 (rounded-<radius 키>)";
    return keys.radius.has(m[1]) ? null : `radius 토큰에 없음: ${m[1]}`;
  }
  if ((m = tok.match(/^text-(.+)$/))) {
    const v = m[1];
    return keys.colors.has(v) || keys.fontSizes.has(v) || TEXT_KW.has(v) || COLOR_KW.has(v) ? null : `색·글자 크기 토큰에 없음: ${v}`;
  }
  if ((m = tok.match(/^font-(.+)$/))) {
    return keys.weights.has(m[1]) || m[1] === "sans" ? null : `굵기 토큰에 없음: ${m[1]}`;
  }
  if ((m = tok.match(/^border(?:-(?:x|y|t|r|b|l|s|e))?(?:-(.+))?$/))) {
    if (!m[1]) return null;
    return keys.colors.has(m[1]) || BORDER_KW.has(m[1]) || COLOR_KW.has(m[1]) ? null : `테두리 색 토큰에 없음: ${m[1]}`;
  }
  if ((m = tok.match(COLOR_UTILS))) {
    const v = m[2];
    if (m[1] === "bg" && /^(cover|contain|center|no-repeat|repeat|fixed|local|scroll|none)$/.test(v)) return null;
    if (/^(offset|inset)/.test(v)) return null;
    return keys.colors.has(v) || COLOR_KW.has(v) || /^(0|2|4|8|none|hidden)$/.test(v) ? null : `색 토큰에 없음: ${v}`;
  }
  if ((m = tok.match(SIZE_RE))) {
    const v = m[2];
    if (keys.spacing.has(v) || SIZE_KW.has(v) || /^\d+\/\d+$/.test(v)) return null;
    if (/^(x|y|t|r|b|l|s|e)-/.test(v)) return null; // 더 긴 접두사(예: gap-x)가 따로 검사됨
    return `spacing 토큰에 없음: ${tok}`;
  }
  return null;
}

// ---------- 내용 검사 (한 파일 / 한 조각) ----------

const PII = [
  [/01[0-9]-?\d{3,4}-?\d{4}/, "전화번호 형식"],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, "이메일 형식"],
  [/\b(name|phone|tel|mobile|email|address|addr|birth\w*|ssn)\s*\??\s*:/i, "개인정보 키"],
  [/\b(customer|user|member|subscriber|applicant|holder)(Name|Phone|Tel|Mobile|Email|Address|Birth\w*)\b/i, "개인정보 키"],
];

const stripComment = (line) => line.replace(/\{\/\*.*?\*\/\}/g, "").replace(/\/\*.*?\*\//g, "").replace(/(^|[^:])\/\/.*$/, "$1");

// 줄 단위 규칙. 반환: [{ line, rule, msg }]
//   rule: "pii" | "token" | "money" | "open"
export function scanLines(text, rel, config, keys) {
  const out = [];
  const isCode = /\.(tsx?|jsx?|mjs)$/.test(rel);
  const isFormatter = rel === config.sources.moneyFormatter;
  text.split("\n").forEach((line, i) => {
    const n = i + 1;
    for (const [re, label] of PII) if (re.test(line)) out.push({ line: n, rule: "pii", msg: `개인정보: ${label}` });

    if (/#[0-9a-fA-F]{3,8}\b/.test(line)) out.push({ line: n, rule: "token", msg: "색 값을 직접 씀 (#hex)" });
    if (/\b(rgba?|hsla?|oklch)\(/.test(line)) out.push({ line: n, rule: "token", msg: "색 값을 직접 씀 (rgb/hsl)" });
    if (/[\w:-]-\[[^\]]*\]/.test(line)) out.push({ line: n, rule: "token", msg: "Tailwind 임의 값 (-[…])" });
    if (/style=\{\{[^}]*\d/.test(line)) out.push({ line: n, rule: "token", msg: "인라인 style에 숫자 값" });

    if (isCode) {
      const code = stripComment(line);
      for (const s of code.matchAll(/(["'`])((?:(?!\1).)*)\1/g)) {
        for (const tok of s[2].split(/\s+/).filter(Boolean)) {
          const why = checkClass(tok, keys);
          if (why) out.push({ line: n, rule: "token", msg: why });
        }
      }
      if (!isFormatter && /(\d|\})\s*원/.test(code)) out.push({ line: n, rule: "money", msg: "금액 문자열을 직접 씀 (formatWon()만 사용)" });
    }
    if (/미정|가정/.test(line) && !/Q\d+/.test(line)) out.push({ line: n, rule: "open", msg: "미정·가정 표시에 Q#가 없음" });
  });
  return out;
}

// 파일 단위 규칙(요금 표시 쌍). 반환: [{ line, rule, msg }]
export function scanFile(text, rel, config) {
  if (!/\.(tsx|jsx)$/.test(rel) || rel === config.sources.moneyFormatter) return [];
  const hasMonthly = /data-price=["']monthly["']/.test(text);
  const hasNet = /data-price=["']net["']/.test(text);
  const usesWon = text.split("\n").some((l) => /\bformatWon\(/.test(l) && !/^\s*import\b/.test(l));
  const out = [];
  if (hasMonthly !== hasNet) out.push({ line: 1, rule: "price", msg: `요금 표시: ${hasMonthly ? "실납부액(net)" : "월정액(monthly)"}이 빠짐` });
  else if (usesWon && !hasMonthly) out.push({ line: 1, rule: "price", msg: "요금 표시: formatWon()을 쓰는데 data-price monthly·net이 없음" });
  return out;
}

// ---------- 라우트 ----------

export function collectRoutes(dir = "app") {
  const routes = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const child = `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (!e.name.startsWith("_") && !e.name.startsWith("@")) walk(child);
      } else if (/^page\.(tsx|jsx|ts|js)$/.test(e.name)) {
        const segs = rel.split("/").slice(1).filter((s) => !/^\(.*\)$/.test(s));
        routes.push({ route: "/" + segs.join("/"), file: child });
      }
    }
  };
  if (exists(dir)) walk(dir);
  return routes;
}

export function listFiles(dir, re = /./) {
  const out = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      const child = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(child);
      else if (re.test(e.name)) out.push(child);
    }
  };
  if (exists(dir)) walk(dir);
  return out;
}
