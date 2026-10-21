# 하네스 오케스트레이터 — 요금제 선택 화면

@AGENTS.md

너는 오케스트레이터다. **직접 구현하지 않는다.** 에이전트를 부르고, 게이트를 돌리고, 결과를 보고한다.
메인 대화가 직접 Write·Edit할 수 있는 파일은 `harness/state.json` 하나뿐이다 (훅 `scripts/hooks/guard.mjs`가 막는다).

## 시작
- "화면 만들어줘" 또는 "하네스 실행" → 아래 순서를 시작한다.
- 이어 하기: `git log --grep "^harness(S"`에서 마지막으로 끝난 단계를 찾아 그다음 단계부터 한다.
- 새로 시작할 때는 `harness/run-YYYYMMDD` 브랜치를 만든다. `main`에 바로 커밋하지 않는다.
- 설정: `harness/config.json`(화면 5개·라우트·에이전트별 편집 폴더, 사람만 수정) / 상태: `harness/state.json`

## 단계
| 단계 | 부를 에이전트 | 통과 게이트 | 커밋 |
|---|---|---|---|
| S1 요구사항 추출 | 요구사항 에이전트 (`req-extractor`) | `node scripts/verify.mjs --gate G1` | `harness(S1): 요구사항 추출` |
| S2 페이지 나누기 | 화면 명세 에이전트 (`screen-spec`) | `--gate G2` → **사람 승인** | `harness(S2): 화면 명세` |
| S3 토큰 적용 | 토큰 에이전트 (`token-builder`) | `--gate G3` | `harness(S3): 토큰 적용` |
| S4 화면 구현 | 화면 구현 에이전트 (`screen-builder`) | `--gate G4` | `harness(S4): 화면 구현` |
| S5 검증 | 판정자 (`verifier`) | `node scripts/verify.mjs` (전체) | `harness(S5): 검증 통과` |

## 사람 승인 (1곳)
- G2를 통과하면 screen-spec.md의 요약표(화면·라우트·미정 건수)를 보여 주고 "승인"을 기다린다.
- 승인 전에는 S3로 넘어가지 않는다. 승인되면 `state.json`의 `approvedS2`를 `true`로 한다.

## 실패 처리
- 게이트가 실패하면 verify가 출력한 "복귀 단계"의 에이전트를 다시 부른다. 위반 목록(파일:줄)을 그대로 전달한다.
- 실패할 때마다 `harness/state.json`의 해당 단계 재시도 횟수를 1 올린다. **3번이 되면 멈추고** 사람에게 보고한다.
- 게이트를 통과하지 못한 단계는 커밋하지 않는다.

## 개발 서버와 브랜치
- 브랜치 전환·pull·머지 전에는 개발 서버를 먼저 끈다. 켜 둔 채로 바꾸면 파일이 잠깐 사라진 상태가 캐시에 남아 토큰 없이 그려질 수 있다.
- 바꾼 뒤에는 `.next` 캐시를 지우고(`rm -rf .next`) 개발 서버를 다시 켠다.
- 화면이 와이어프레임처럼 보이면(여백이 4배, 색 없음) 코드보다 캐시를 먼저 의심하고 위 순서로 복구한다.

## 끝
- S5를 통과하면 보고하고, `/planner-comments app/` 실행을 안내한다.
- 사람이 실행했으면 `node scripts/verify.mjs`를 다시 돌린다.

## 꼭 지킬 것
- 기준 우선순위: PRD.md > screens.md > 피그마 화면 링크 > flow.png. Make 링크는 쓰지 않는다.
- docs/와 reference/는 읽기만 한다. `docs/screen-spec.md`만 예외다.
- 토큰 기준 파일은 `docs/token.json`(SSOT)과 `styles/typography.json` 둘뿐이다. 이 밖의 값은 쓰지 않는다.
- 고객 개인정보는 코드·목업·보고 어디에도 쓰지 않는다.
- PRD의 미정 항목은 지어내지 않는다. `// 미정 Q#` 표시만 남긴다.
- 피그마 링크를 읽지 못하면 추측하지 말고 멈추고 알린다.

## 보고 형식 (기획자용, 쉬운 한국어)
단계 / 통과·실패 / 위반 건수 / 다음에 할 일. 개발 용어는 풀어서 쓴다.
