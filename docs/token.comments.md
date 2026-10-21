# token.json 기획 주석

<!--
- 대상: docs/token.json
- token.json은 JSON 형식이라 주석을 넣을 수 없다. 원본은 바꾸지 않고 이 파일에 주석을 따로 정리한다.
- 근거: docs/design.md (토큰의 쓰는 곳). PRD.md·screens.md에는 토큰에 대한 내용이 없다.
- 모든 주석은 [기획]으로 시작한다.
-->

## 파일 전체

[기획] 화면에 쓰는 색·글자 크기·간격·모서리 둥글기 값을 이름으로 모아 둔 파일이다.
[기획] 디자이너와 개발자가 같은 이름(예: `text/primary`)으로 같은 값을 쓰게 하는 기준이다. (design.md 1~3장)
[기획] 모든 묶음에 "Default" 한 가지 모드만 있다. 다크 모드 등 다른 모드는 정의되어 있지 않다.

| 묶음 | 내용 | 줄 |
|---|---|---|
| `primitive` | 기본 색 17개. 색 자체의 이름(회색 900, 핑크 500 등) | 2–22 |
| `semantic` | 역할별 색 38개. "본문 글자", "주요 버튼" 같은 용도의 이름 | 23–72 |
| `typography` | 글꼴과 글자 크기 | 73–87 |
| `spacing` | 간격 18단계 | 88–109 |
| `radius` | 모서리 둥글기 15단계 | 110–128 |

---

## 1. 기본 색 (`primitive`, 2–22줄)

[기획] 색 자체에 붙인 이름이다. 화면에는 이 이름을 직접 쓰지 않고, 2장의 역할별 색을 통해 쓴다. (design.md 1.1)
[기획] 숫자가 클수록 진하다. 예: `gray/900`은 거의 검정, `gray/0`은 흰색이다.

| 이름 | 색상 코드 | 설명 |
|---|---|---|
| `gray/950` ~ `gray/0` | #000000 ~ #FFFFFF | 회색 10단계 |
| `pink/600` | #E6007E | 주요 버튼 색 |
| `pink/500` | #FF2E98 | 강조 글자·아이콘·로고 색 |
| `pink/50` | #FFF5FA | 할인·프로모션 배경 |
| `pink/25` | #FFF8F5 | 확인 필요: 이 색을 쓰는 역할별 색이 없다 |
| `red/500` | #E30036 | 오류 색 |
| `red/50` | #FFF0F3 | 오류 강조 배경 |
| `black/10` | 검정 10% 투명 | 구분선 |

[기획] 주요 버튼 핑크(`pink/600`)와 강조 핑크(`pink/500`)는 다른 색이다. 섞어 쓰지 않는다. (design.md 1.1)

---

## 2. 역할별 색 (`semantic`, 23–72줄)

[기획] 화면에서 실제로 쓰는 색 이름이다. 각 이름은 1장의 기본 색 하나를 가리킨다(`primitive` 항목).
[기획] 값이 같아도 역할이 다르면 따로 둔다. 예: `text/secondary`와 `text/on-disabled`는 같은 회색이지만 합치지 않는다. (design.md 1.1)

### 2-1. 글자 (`text/*`, 8개)

| 이름 | 쓰는 곳 |
|---|---|
| `text/primary` | 제목, 카드의 요금제 이름·가격, 기본 본문 |
| `text/secondary` | 설명, 정보 라벨, Tag 글자 |
| `text/tertiary` | 정가 등 낮은 강조 정보 |
| `text/accent` | 할인율, 강조 정보값 |
| `text/on-dark` | 주요 버튼·선택된 필터처럼 어두운 배경 위의 글자 |
| `text/error` | 입력 오류 메시지 |
| `text/placeholder` | 입력란의 안내 문구 |
| `text/on-disabled` | 사용할 수 없는 입력란의 글자 |

[기획] 요금제 카드의 월정액(정가)은 `text/tertiary`, 할인 후 실납부액은 `text/primary`로 보여 줄 수 있다. 화면에 둘 다 보여 주는 규칙(R11)과 맞는다.

### 2-2. 배경·표면 (`bg/*`, `surface/default`, 7개)

| 이름 | 쓰는 곳 |
|---|---|
| `bg/surface` | 헤더, 하단 버튼 영역, 카드 표면 (흰색) |
| `surface/default` | 보조 버튼 표면 (흰색) |
| `bg/default` | 화면 안의 구분 영역, 가격 요약 영역 |
| `bg/subtle` | 사용할 수 없는 입력란, 혜택 Chip, 진행 막대 바탕 |
| `bg/accent-subtle` | 할인·프로모션 Chip 배경 |
| `bg/inverse` | 어두운 배경. 사용 미확인 (design.md 1.3) |
| `bg/error-subtle` | 오류 강조 배경. 사용 미확인 (design.md 1.3) |

### 2-3. 테두리·구분선 (`border/*`, 7개)

| 이름 | 쓰는 곳 |
|---|---|
| `border/default` | 입력란, 보조 버튼, 카드, 필터의 기본 테두리 |
| `border/subtle` | 목록 행·하단 버튼 영역의 구분선. Tag 배경에도 쓴다 |
| `border/medium` | 선택된 요금제 카드·선택지의 테두리 |
| `border/focus` | 입력 중인 입력란의 테두리 (강조 핑크) |
| `border/error` | 오류가 있는 입력란의 테두리 |
| `border/divider` | 문서 안 구획 구분선 (검정 10% 투명) |
| `border/strong` | 강한 테두리. 사용 미확인 (design.md 1.4) |

### 2-4. 버튼·상태 채움 (`fill/*`, 7개)

| 이름 | 쓰는 곳 |
|---|---|
| `fill/primary` | 주요 버튼, 선택된 체크박스·라디오, 진행 막대, 완료 아이콘 |
| `fill/primary-hover` | 주요 버튼에 마우스를 올렸을 때 |
| `fill/secondary` | 패키지 Chip, 선택된 필터 (어두운 색) |
| `fill/disabled` | 사용할 수 없는 버튼 |
| `fill/accent` | 강조 채움. 사용 미확인 (design.md 1.5) |
| `fill/tertiary` | 낮은 강조 채움. 사용 미확인 (design.md 1.5) |
| `fill/disabled-strong` | 강한 비활성 채움. 사용 미확인 (design.md 1.5) |

[기획] `fill/primary`와 `fill/primary-hover`는 같은 색이다. 마우스를 올려도 버튼 색이 바뀌지 않는다. 의도인지는 확인 필요. (design.md 1.5)
[기획] 선택된 필터는 핑크가 아니라 어두운 색(`fill/secondary`)으로 보여 준다. (design.md 4.8)

### 2-5. 아이콘·브랜드·효과 (`icon/*`, `brand/primary`, `effect/*`, 9개)

| 이름 | 쓰는 곳 |
|---|---|
| `icon/default` | 뒤로가기·체크 아이콘 |
| `icon/accent` | 목록 행의 강조 점, 할인 Chip 글자 |
| `icon/on-dark` | 어두운 배경 위 아이콘, 선택된 라디오의 안쪽 점 |
| `icon/error` | 입력 오류 아이콘 |
| `icon/strong`, `icon/primary`, `icon/disabled` | 사용 미확인 (design.md 1.6) |
| `brand/primary` | 로고 (강조 핑크) |
| `effect/shadow-subtle` | 옅은 그림자 색 (검정 5% 투명). 적용 미확인 |

[기획] `effect/shadow-subtle`은 가리키는 기본 색이 없다(`primitive: null`). 1장에 없는 색을 직접 적은 유일한 항목이다.
[기획] 그림자의 위치·번짐 정도는 정의되어 있지 않고 색만 있다. (design.md 1.6)

---

## 3. 글꼴·글자 크기 (`typography`, 73–87줄)

[기획] 모든 글자는 Noto Sans KR 글꼴을 쓴다.
[기획] 이 파일에는 글자 크기만 있다. 줄 높이와 굵기는 design.md 2.2의 텍스트 스타일을 함께 따라야 한다.

| 이름 | 크기 | 대표 용도 (design.md 2.2) |
|---|---:|---|
| `font-size/heading-h1` | 32 | 최상위 대형 제목. 사용 미확인 |
| `font-size/heading-h2` | 28 | 가격 요약의 대표 금액 |
| `font-size/heading-h3` | 24 | 화면 주요 제목, 섹션 제목 |
| `font-size/heading-h4` | 20 | 진입 화면 헤더 제목 |
| `font-size/subtitle` | 18 | 카드의 요금제 이름·가격, 하위 화면 헤더 제목 |
| `font-size/body` | 16 | 버튼 글자, 일반 본문 |
| `font-size/body-small` | 14 | 설명, 정보 라벨, 안내문 |
| `font-size/caption` | 13 | Tag, 할인 Chip, 정가 |
| `font-size/12` | 12 | 작은 보조 설명. 사용 미확인 |
| `font-size/caption-mini` | 10 | 혜택·패키지 Chip |

[기획] `font-size/12`만 용도가 아니라 숫자로 이름이 붙어 있다. 이름 규칙이 다른 이유는 확인 필요.

---

## 4. 간격 (`spacing`, 88–109줄)

[기획] 요소 사이 간격과 안쪽 여백의 단계다. 이름의 숫자가 곧 값(px)이다. (design.md 3.3)
[기획] 파일 안에서 순서가 섞여 있지만 값에는 영향이 없다.

| 값 | 대표 용도 |
|---:|---|
| 0, 2 | 초기값, 입력란 안의 미세 여백 |
| 4, 6 | 글자 묶음 간격, Tag·Chip 안쪽 여백 |
| 8 | 필터·카드·버튼 사이 간격 |
| 10, 12 | 입력란 안 간격, 섹션 안 간격, 목록 행 위아래 여백 |
| 16 | 기본 화면 좌우 여백, 본문 블록 간격 |
| 20 | 요금제 카드 안쪽 여백 |
| 24 | 목록·상세 화면 좌우 여백, 주요 섹션 간격 |
| 32 | 하단 버튼 영역 아래 여백 |
| 28, 40, 48, 56, 60, 64, 80 | 등록만 되어 있고 공통 용도는 확인되지 않음 |

---

## 5. 모서리 둥글기 (`radius`, 110–128줄)

[기획] 모서리를 얼마나 둥글게 할지의 단계다. 이름의 숫자가 곧 값(px)이고, `radius/full`만 9999다. (design.md 3.4)

| 이름 | 대표 용도 |
|---|---|
| `radius/0` | 헤더, 입력란, 목록 행, 하단 버튼 영역 (각진 모서리) |
| `radius/2` | 진행 막대 |
| `radius/4` | 혜택·패키지 Chip |
| `radius/6` | 할인 Chip |
| `radius/8` | 버튼 |
| `radius/12` | 선택지(OptionItem) |
| `radius/16` | 요금제 카드 |
| `radius/999` | Tag |
| `radius/full` | 필터, 라디오, 완료 아이콘 (완전히 둥근 모양) |
| `radius/5`, `/10`, `/20`, `/24`, `/32`, `/40` | 등록만 되어 있고 용도는 확인되지 않음 |

[기획] `radius/999`와 `radius/full`은 둘 다 완전히 둥글게 보이지만 서로 다른 항목이다. 하나로 합치지 않는다. (design.md 3.4)
