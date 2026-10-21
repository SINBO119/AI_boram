#!/usr/bin/env node
// PreToolUse 훅. 쓰기 위치와 내용을 검사해 위반이면 종료 코드 2로 거부한다.
//   1) 보호 경로(docs/·reference/·scripts/·.claude/·harness/config.json 등) 쓰기 거부
//   2) 에이전트별 편집 폴더 밖 쓰기 거부 (agent_type 없음 = 메인 대화)
//   3) app/에 쓰는 내용에 토큰 밖 값·개인정보 형식이 있으면 거부
//   4) 판정자(verifier)의 Bash는 verify·build·lint만 허용
import path from "node:path";
import { ROOT, loadConfig, tokenKeys, scanLines } from "../lib/rules.mjs";

const deny = (msg) => {
  process.stderr.write(`[하네스 훅] 거부: ${msg}\n`);
  process.exit(2);
};

let input;
try {
  input = JSON.parse(await new Promise((res) => {
    let s = "";
    process.stdin.on("data", (c) => (s += c)).on("end", () => res(s));
  }));
} catch {
  deny("훅 입력을 읽지 못함");
}

const { tool_name: tool, tool_input: ti = {}, agent_type: agentType } = input;
const who = agentType ?? "main";
let config;
try {
  config = loadConfig();
} catch {
  deny("harness/config.json을 읽지 못함");
}

if (tool === "Bash") {
  const rules = config.agents[who]?.bash;
  if (rules && !rules.some((re) => new RegExp(re).test((ti.command ?? "").trim())))
    deny(`${who}는 이 명령을 실행할 수 없음: ${ti.command}\n허용: node scripts/verify.mjs, npm run build, npm run lint`);
  process.exit(0);
}

const file = ti.file_path ?? ti.notebook_path;
if (!file) process.exit(0);
const rel = path.relative(ROOT, path.resolve(input.cwd ?? ROOT, file)).split(path.sep).join("/");
if (rel.startsWith("..")) process.exit(0); // 프로젝트 밖은 하네스 대상이 아님

const under = (p) => (p.endsWith("/") ? rel.startsWith(p) : rel === p);
if (config.protected.some(under) && !config.protectedExceptions.some(under))
  deny(`${rel}은 보호된 파일이라 사람만 바꿀 수 있음 (docs/·reference/는 읽기 전용)`);

const allowed = config.agents[who]?.write;
if (!allowed) deny(`하네스에 등록되지 않은 에이전트: ${who}`);
if (!allowed.some(under))
  deny(`${who}의 편집 범위 밖: ${rel}\n허용: ${allowed.join(", ") || "(없음, 읽기 전용)"}${who === "main" ? "\n메인 대화는 직접 구현하지 않고 에이전트를 부른다." : ""}`);

if (rel.startsWith("app/")) {
  const text = ti.content ?? ti.new_string ?? ti.new_source ?? "";
  const found = scanLines(text, rel, config, tokenKeys(config)).filter((v) => v.rule === "pii" || v.rule === "token");
  if (found.length)
    deny(`${rel}에 규칙 위반 ${found.length}건\n` + found.slice(0, 10).map((v) => `- ${v.line}번째 줄: ${v.msg}`).join("\n") +
      "\n토큰은 styles/tokens.css의 키만 쓰고, 고객은 customerId로만 식별한다.");
}
process.exit(0);
