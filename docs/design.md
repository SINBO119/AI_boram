# Design.md

이 문서는 파일의 로컬 변수, 텍스트 스타일, Components 섹션의 컴포넌트 정의와 390×844 모바일 화면을 기준으로 작성한다.

- 단위는 별도 표기가 없으면 px이다.
- 변수 값은 각 컬렉션의 Default 모드 기준이다.
- ‘권장’은 정의와 사용 사례를 바탕으로 한 적용 지침이며, 현재 구현과 구분한다.
- ‘사용 미확인’은 조사한 컴포넌트와 모바일 화면에서 직접적인 사용을 확인하지 못한 토큰이다.

## 1. 색 팔레트

### 1.1 적용 원칙

- UI에는 primitive 색상보다 semantic 토큰을 우선 사용한다.
- 현재 값이 같아도 역할이 다른 토큰은 통합하지 않는다.
- 주요 버튼의 `fill/primary`는 #E6007E이며, 강조 글자·아이콘·브랜드의 #FF2E98과 다르다.
- 현재 semantic 컬렉션은 Default 모드 하나만 정의되어 있다.

### 1.2 텍스트

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `text/primary` | #181A1B | 제목, 입력값, 카드 이름·가격, 기본 본문 |
| `text/secondary` | #66707A | 설명, 정보 라벨, 카드 부연 설명, Tag 글자 |
| `text/tertiary` | #878787 | 정가, 가격 부가 정보 등 낮은 강조도의 텍스트 |
| `text/accent` | #FF2E98 | 할인율, 강조 정보값, StepProgress 단계 라벨 |
| `text/on-dark` | #FFFFFF | Primary 버튼, 어두운 Chip, 선택된 FilterChip의 글자 |
| `text/error` | #E30036 | Input의 오류 메시지 |
| `text/placeholder` | #B7BDC4 | Input의 기본 안내값 |
| `text/on-disabled` | #66707A | 비활성 Input의 텍스트 |

### 1.3 배경·표면

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `bg/surface` | #FFFFFF | Header, BottomCTA, 기본 카드·선택 항목·필터 표면 |
| `surface/default` | #FFFFFF | Secondary 버튼 표면 |
| `bg/default` | #F7F7F7 | 화면 내 구분 영역, 가격 요약 영역, 선택된 OptionItem 배경 |
| `bg/subtle` | #EFF1F3 | 비활성 Input, Secondary 버튼 Hover, 혜택 Chip, 진행바 트랙 |
| `bg/inverse` | #2D2D2D | 반전 배경용. 사용 미확인 |
| `bg/accent-subtle` | #FFF5FA | 할인·프로모션 Chip 배경 |
| `bg/error-subtle` | #FFF0F3 | 오류 강조 배경용. 사용 미확인 |

### 1.4 테두리·구분선

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `border/default` | #D9DCDF | 기본 Input, Secondary 버튼, 카드, 선택 항목, 필터 테두리 |
| `border/subtle` | #EFF1F3 | List/Row·BottomCTA 구분선. Tag 배경에도 사용 중 |
| `border/medium` | #66707A | 선택된 Card/Plan·OptionItem 테두리 |
| `border/strong` | #181A1B | 강한 테두리용. 사용 미확인 |
| `border/divider` | rgba(0, 0, 0, 0.10) | Components 문서 내 구획 구분선 |
| `border/focus` | #FF2E98 | Input의 focus 상태 |
| `border/error` | #E30036 | Input의 caution 상태 |

### 1.5 액션·상태 채움

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `fill/primary` | #E6007E | Primary 버튼, 활성 Checkbox, 선택된 라디오, 진행바, 완료 아이콘 배경 |
| `fill/accent` | #E6007E | 강조 채움용. 사용 미확인 |
| `fill/primary-hover` | #E6007E | Primary 버튼 Hover |
| `fill/secondary` | #181A1B | 패키지 Chip, 선택된 FilterChip |
| `fill/tertiary` | #EFF1F3 | 낮은 강조도의 채움용. 사용 미확인 |
| `fill/disabled` | #D9DCDF | Disabled 버튼 배경 |
| `fill/disabled-strong` | #B7BDC4 | 강한 비활성 채움용. 사용 미확인 |

현재 `fill/primary`와 `fill/primary-hover`는 같은 primitive를 참조한다.
Hover 변형은 존재하지만 색상 차이는 없다.

### 1.6 아이콘·브랜드·효과

| Semantic 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `icon/default` | #66707A | 뒤로가기·체크 아이콘의 실제 도형 |
| `icon/strong` | #181A1B | 강한 아이콘용. 사용 미확인 |
| `icon/primary` | #000000 | 기본 검정 아이콘용. 사용 미확인 |
| `icon/accent` | #FF2E98 | List/Row 강조 점, 할인 Chip 글자 |
| `icon/on-dark` | #FFFFFF | 반전 아이콘, 선택된 OptionItem의 라디오 내부 점 |
| `icon/disabled` | #D9DCDF | 비활성 아이콘용. 사용 미확인 |
| `icon/error` | #E30036 | Input 오류 아이콘 |
| `brand/primary` | #FF2E98 | Logo 도형 |
| `effect/shadow-subtle` | rgba(0, 0, 0, 0.05) | 미세 그림자 색상용. 적용 미확인 |

`effect/shadow-subtle`은 색상 변수이며, 그림자의 위치·흐림·확산값을 정의하지 않는다.

현재 일부 컴포넌트에는 역할을 넘나드는 연결이 있다.
- Tag 배경: `border/subtle`
- 할인 Chip 글자: `icon/accent`
- 기본 Checkbox 도형: `text/secondary`
- 활성 Checkbox 체크선: `bg/default`

기존 정의를 재현할 때는 이 연결을 기준으로 하며, 임의로 같은 값의 다른 토큰으로 대체하지 않는다.

## 2. 타이포 스케일

### 2.1 공통 설정

- 글꼴: Noto Sans KR
- 글꼴 변수: `font-family/family-font`
- 자간: 모든 로컬 텍스트 스타일 0%
- 굵기: Medium 500 / SemiBold 600 / Bold 700
- 줄높이는 모두 고정 px 값이다.
- 크기만 맞추지 말고 텍스트 스타일의 굵기·줄높이까지 함께 적용한다.

### 2.2 UI 텍스트 스타일

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
|---|---:|---|---|
| `heading/h1` | 32 / 44 | Bold 700 | 최상위 대형 제목용. 조사한 모바일 화면에서 사용 미확인 |
| `heading/h2` | 28 / 40 | Bold 700 | 가격 요약의 대표 금액 |
| `heading/h3` | 24 / 32 | Bold 700 | 화면 주요 제목, 섹션 제목, 완료 제목 |
| `heading/h4` | 20 / 28 | Bold 700 | root Header 제목 |
| `subtitle/bold` | 18 / 26 | Bold 700 | 카드 이름·가격·할인율, 신청 내역 제목, 선택된 OptionItem 제목 |
| `subtitle/default` | 18 / 26 | SemiBold 600 | 기본 Header 제목 |
| `body/strong` | 16 / 24 | SemiBold 600 | 버튼 라벨, Input 값, 기본 OptionItem 제목 |
| `body/medium` | 16 / 24 | Medium 500 | 일반 본문용. Primary Disabled 버튼 라벨에도 사용 |
| `body/small-strong` | 14 / 21 | SemiBold 600 | 정보값, 선택된 FilterChip 라벨 |
| `body/small-medium` | 14 / 21 | Medium 500 | 설명, 정보 라벨, 안내문, 오류 메시지, 기본 FilterChip 라벨 |
| `caption/bold` | 13 / 18 | Bold 700 | Tag, 할인 Chip, StepProgress 단계 라벨 |
| `caption/medium` | 13 / 18 | Medium 500 | 정가, 가격 요약의 보조 정보 |
| `caption/small-bold` | 12 / 16 | Bold 700 | 작은 강조 캡션용. 조사한 UI에서 사용 미확인 |
| `caption/small` | 12 / 16 | Medium 500 | 작은 보조 캡션용. 조사한 UI에서 사용 미확인 |
| `caption/mini` | 10 / 14 | SemiBold 600 | 혜택·패키지 Chip |

### 2.3 서체 견본 스타일

다음 스타일은 UI 위계가 아니라 굵기 비교를 위한 견본이다.

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
|---|---:|---|---|
| `specimen/weight-medium` | 32 / 44 | Medium 500 | Medium 서체 견본 |
| `specimen/weight-semibold` | 32 / 44 | SemiBold 600 | SemiBold 서체 견본 |

### 2.4 크기 변수

| 변수 | 값 |
|---|---:|
| `font-size/heading-h1` | 32 |
| `font-size/heading-h2` | 28 |
| `font-size/heading-h3` | 24 |
| `font-size/heading-h4` | 20 |
| `font-size/subtitle` | 18 |
| `font-size/body` | 16 |
| `font-size/body-small` | 14 |
| `font-size/caption` | 13 |
| `font-size/12` | 12 |
| `font-size/caption-mini` | 10 |

크기 변수만으로는 줄높이와 굵기가 결정되지 않는다.

### 2.5 적용 시 주의

- 일부 화면 텍스트는 로컬 텍스트 스타일 연결이 해제된 상태다. 해당 값이 새로운 스타일을 의미하지는 않는다.
- Input의 숨겨진 기본 메시지에는 `heading/h4`가 연결되어 있지만, 실제 caution 메시지는 `body/small-medium`이다. 오류 안내는 caution 정의를 기준으로 한다.
- OptionItem은 선택 시 제목이 `body/strong`에서 `subtitle/bold`로 변경된다. 선택 상태는 색상뿐 아니라 타이포 위계도 달라진다.

## 3. 간격·레이아웃

### 3.1 390×844 모바일 기준

| 항목 | 확인된 기준 |
|---|---|
| 화면 크기 | 390×844 |
| 기본 흐름 | 세로 Auto Layout |
| Header | 너비 390, 높이 56 |
| Header 좌우 여백 | 16 |
| 기본 콘텐츠 좌우 여백 | 16 |
| 기본 콘텐츠 유효 너비 | 358 = 390 − 16×2 |
| 목록·상세 화면 좌우 여백 | 24 |
| 목록·상세 유효 너비 | 342 = 390 − 24×2 |
| 주요 CTA 버튼 높이 | 52 |
| 단일 BottomCTA 높이 | 97 |
| BottomCTA 기본 하단 여백 | 32 |

16과 24의 좌우 여백이 실제 화면에서 함께 사용된다.
모든 화면을 하나의 여백으로 간주하지 말고 화면 유형에 맞춰 적용한다.

별도의 시스템 상태바·홈 인디케이터 높이는 확인되지 않았다.
844에서 임의의 시스템 영역을 추가로 차감하지 않는다.

### 3.2 화면 유형별 배치

| 화면 유형 | 본문 여백·간격 | 하단 영역 |
|---|---|---|
| 요금제 목록 | 상하 16, 좌우 24, 주요 블록 간격 16, 카드 간격 8 | 별도 고정 CTA 없음 |
| 요금제 상세 | 사방 24, 주요 섹션 간격 24, 섹션 내부 간격 12 | 버튼 2개 세로 배치, 간격 8, 패딩 상16·좌우24·하32, 높이160 |
| 구독 신청 | 사방 16, 주요 블록 간격 16 | 버튼 2개 세로 배치, 간격 8, 패딩 상16·좌우24·하24, 높이152 |
| 신청 완료 | 사방 16, 주요 블록 간격 24 | BottomCTA single, 높이97 |

- 완료 화면은 Header 56 + 본문 691 + BottomCTA 97 = 844로 구성된다.
- 목록 화면은 내부 콘텐츠 높이가 873으로 화면 높이 844를 초과한다. 구현 시 전체 내용에 접근할 수 있도록 세로 스크롤을 제공하는 것이 권장된다.
- 신청 화면의 현재 요소 높이 합계는 839이며 화면 높이와 5 차이가 있다. 이를 공통 여백 규칙으로 해석하지 않는다.
- 화면의 세로 2버튼 영역과 BottomCTA의 `Layout=double`은 다르다. `double`은 가로 2버튼 배치다.
- 현재 화면은 클리핑된 디자인이며, 실제 스크롤 동작의 정의 여부와는 별개다.

### 3.3 간격 변수

등록된 간격 스케일:

`spacing/0`, `spacing/2`, `spacing/4`, `spacing/6`, `spacing/8`,
`spacing/10`, `spacing/12`, `spacing/16`, `spacing/20`, `spacing/24`,
`spacing/28`, `spacing/32`, `spacing/40`, `spacing/48`, `spacing/56`,
`spacing/60`, `spacing/64`, `spacing/80`

각 변수 값은 이름의 숫자와 같다.

| 값 | 확인된 대표 용도 |
|---:|---|
| 0 | 간격·패딩 초기값 |
| 2 | Input 내부 미세 여백 |
| 4 | 텍스트 묶음 간격, Tag·Chip 상하 패딩 |
| 6 | 소형 Chip 좌우 패딩 |
| 8 | 필터·카드·버튼 사이 간격, 카드 내부 간격 |
| 10 | Input 내부 간격, 할인 Chip 좌우 패딩 |
| 12 | 섹션 내부 간격, List/Row 상하 패딩, BottomCTA 상단 패딩 |
| 16 | 기본 화면 여백, 본문 블록 간격 |
| 20 | Card/Plan 내부 패딩, OptionItem 좌우 패딩 |
| 24 | 넓은 화면 여백, 주요 섹션 간격, 버튼 좌우 패딩 |
| 32 | BottomCTA 하단 패딩 |
| 28·40·48·56·60·64·80 | 등록됨. 조사한 모바일 UI의 공통 적용 규칙은 확인되지 않음 |

### 3.4 모서리 반경

등록된 반경 스케일:

`radius/0`, `radius/2`, `radius/4`, `radius/5`, `radius/6`,
`radius/8`, `radius/10`, `radius/12`, `radius/16`, `radius/20`,
`radius/24`, `radius/32`, `radius/40`, `radius/999`, `radius/full`

- `radius/full` 값은 9999다.
- 나머지는 이름의 숫자와 값이 같다.

| 토큰 | 확인된 대표 용도 |
|---|---|
| `radius/0` | Header, Input, List/Row, BottomCTA |
| `radius/2` | StepProgress 진행 막대 |
| `radius/4` | 혜택·패키지 Chip |
| `radius/6` | 할인 Chip |
| `radius/8` | Button |
| `radius/12` | OptionItem |
| `radius/16` | Card/Plan |
| `radius/999` | Tag |
| `radius/full` | FilterChip, 라디오, 완료 아이콘, 진행바 트랙 |

`radius/999`와 `radius/full`은 서로 다른 변수다.

### 3.5 크기 조절 규칙

- 화면 너비에 따라 Header·본문·CTA의 너비를 채운다.
- 카드·Input·목록 행의 358은 기본 원본 너비다. 좌우 24 여백의 화면에서는 342 너비로 사용된 사례가 있다.
- 텍스트와 카드 본문은 내용 증가에 대응할 수 있도록 높이를 유연하게 처리하는 것이 권장된다.
- 상태 변경 시 원본 치수가 달라지는 컴포넌트가 있다. 고정 높이를 임의로 적용해 내용을 자르지 않는다.
- 하단 CTA는 본문과 분리하고, 스크롤 콘텐츠가 CTA에 가려지지 않게 구성하는 것이 권장된다.

## 4. 컴포넌트 용법

아래 속성명은 Figma에 노출된 이름 기준이며 내부 식별용 접미사는 생략한다.
변형 값의 대소문자는 원본을 따른다.

### 4.1 Button

**변형·속성**

| 속성 | 값 | 기본값 |
|---|---|---|
| `Type` | `Primary`, `Secondary` | `Primary` |
| `Size` | `xl`, `lg`, `sm` | `xl` |
| `State` | `Default`, `Hover`, `Disabled` | `Default` |
| `Label` | 텍스트 | 로그인 |

총 18개 조합이 정의되어 있다.

**크기·스타일**

| Size | 실제 높이 | 좌우 패딩 | 상하 패딩 |
|---|---:|---:|---:|
| `xl` | 52 | 24 | 16 |
| `lg` | 48 | 24 | 12 |
| `sm` | Primary 40 / Secondary Default·Hover 42 / Secondary Disabled 40 | 24 | 8 |

- 반경: `radius/8`
- 기본 라벨: `body/strong`
- Primary Disabled 라벨: `body/medium`
- Primary: `fill/primary` + `text/on-dark`
- Primary Hover: `fill/primary-hover` + `text/on-dark`
- Secondary: `surface/default` + `border/default` + `text/primary`
- Secondary Hover: `bg/subtle` + `border/default`
- Disabled: `fill/disabled` + `text/on-dark`

**사용 규칙**

- 주요 완료·신청 액션에는 Primary, 보조 액션에는 Secondary를 사용한다.
- 화면 하단 주요 액션은 xl, 카드 내부 액션은 sm 사용 사례가 있다.
- 라벨은 `Label` 속성으로 변경한다.
- 원본 버튼 너비는 라벨에 따른 크기이며, 화면 CTA에서는 콘텐츠 너비를 채운다.
- xl은 실제 높이52와 상하 패딩16·라벨 줄높이24가 단순 합산상 일치하지 않는다. 높이를 패딩 합계만으로 재계산하지 않는다.
- Disabled 변형은 시각 상태다. 구현에서는 비활성 동작을 별도로 적용해야 한다.

### 4.2 Input

| 속성 | 값 | 기본값 |
|---|---|---|
| `State` | `default`, `focus`, `filled`, `caution`, `disabled` | `default` |
| `errorMessage` | Boolean | false |

- 기본 너비358, 필드 높이58
- caution 전체 높이91 = 필드58 + 간격12 + 메시지21
- 반경0, 하단 선 중심의 입력 필드
- 기본 입력 텍스트: `body/strong`
- 오류 메시지: `body/small-medium`

**상태 규칙**

| 상태 | 핵심 표현 |
|---|---|
| `default` | `border/default`, 안내값 `text/placeholder` |
| `focus` | `border/focus` |
| `filled` | 입력 완료값 표시, `border/default` |
| `caution` | `border/error`, `text/error`, `icon/error` |
| `disabled` | `bg/subtle`, `text/on-disabled` |

**사용 규칙**

- 입력값과 오류 문구를 바꾸는 상위 TEXT 속성은 노출되어 있지 않다. 내부 텍스트를 오버라이드한다.
- `errorMessage`는 기본 변형의 메시지 표시와 연결되어 있다.
- caution 메시지는 별도로 표시되며 해당 Boolean 연결이 확인되지 않았다. 모든 상태에서 같은 방식으로 메시지를 토글한다고 가정하지 않는다.
- 오류 메시지가 나타날 때 아래 콘텐츠가 밀릴 공간을 확보한다.

### 4.3 Checkbox

| 속성 | 값 | 기본값 |
|---|---|---|
| `State` | `default`, `active` | `default` |

- 원본 크기24×24
- 기본 도형20×20
- default 도형: `text/secondary`
- active 채움: `fill/primary`
- active 체크선: `bg/default`

**사용 규칙**

- 독립적인 선택 여부 표현에 사용한다.
- 라벨·오류·disabled 속성은 정의되어 있지 않다.
- 라벨과 조합하거나 터치 영역을 확장하는 규칙은 별도 레이아웃에서 처리한다.

### 4.4 Header

| 속성 | 값 | 기본값 |
|---|---|---|
| `Type` | `default`, `root` | `default` |
| `Title` | 텍스트 | 맞춤 요금제 추천 |

- 공통 크기390×56
- 배경 `bg/surface`
- 패딩 상하4·좌우16

| Type | 구성 | 제목 스타일 |
|---|---|---|
| `default` | 뒤로가기24 + 제목 + 반대편 spacer24, 간격8 | `subtitle/default` |
| `root` | 제목 + Logo32×24, 간격12 | `heading/h4` |

**사용 규칙**

- 진입 화면에는 root, 하위 화면에는 default를 사용한다.
- 제목은 `Title` 속성으로 변경한다.
- default의 반대편 spacer는 제목 정렬을 위한 구조이므로 임의로 제거하지 않는다.
- root에서는 뒤로가기를 표시하지 않는다.

### 4.5 List/Row

| 속성 | 값 | 기본값 |
|---|---|---|
| `Type` | `default`, `check` | `default` |
| `Label` | 텍스트 | 데이터 |
| `Value` | 텍스트 | 무제한 |

- 원본 크기358×46
- 상하 패딩12, 좌우 패딩4, 내부 간격12
- 구분선 `border/subtle`

| Type | 라벨 | 값 | 추가 표현 |
|---|---|---|---|
| `default` | `body/small-medium`, `text/secondary` | `body/small-strong`, `text/primary` | 없음 |
| `check` | `body/small-medium`, `text/primary` | `body/small-strong`, `text/accent` | 6×6 강조 점 |

**사용 규칙**

- 요금제 혜택, 신청 내역처럼 라벨·값 쌍으로 된 정보에 사용한다.
- `check`는 이름과 달리 실제로 강조 점이 있는 행이다. 체크박스로 취급하지 않는다.
- 라벨과 값은 각각 노출된 TEXT 속성으로 변경한다.

### 4.6 Card/Plan

| 속성 | 종류·값 | 기본값 |
|---|---|---|
| `State` | `default`, `selected` | `default` |
| `Name` | 텍스트 | 넉넉 무제한 |
| `Desc` | 텍스트 | 데이터 무제한 · 통화 무제한 · 넷플릭스 포함 |
| `Discount` | 텍스트 | 15% |
| `Price` | 텍스트 | 월 85,000원 |
| `Original` | 텍스트 | 월 100,000원 |
| `Badge` | Boolean | true |
| `Promo` | Boolean | true |
| `Sale` | Boolean | true |

- 너비358
- default 높이223, selected 높이224
- 패딩20, 내부 기본 간격8, 반경16
- 배경 `bg/surface`
- default 테두리 `border/default`
- selected 테두리 `border/medium`

**콘텐츠 구성**

| 요소 | 스타일 |
|---|---|
| 이름 | `subtitle/bold` + `text/primary` |
| 설명 | `body/small-medium` + `text/secondary` |
| 할인율 | `subtitle/bold` + `text/accent` |
| 현재 가격 | `subtitle/bold` + `text/primary` |
| 정가 | `caption/medium` + `text/tertiary` |
| 내부 액션 | Secondary / sm Button |

**사용 규칙**

- `Name`, `Desc`, `Discount`, `Price`, `Original`로 카드 데이터를 설정한다.
- `Sale`은 할인율과 정가의 표시 여부를 함께 제어한다.
- `Promo`는 프로모션 Chip 표시 여부를 제어한다.
- `Badge`는 정의되어 있지만 두 상태 모두 배지 표시와의 연결이 확인되지 않았다. 자동 토글을 전제로 사용하지 않는다.
- 프로모션 문구와 내부 버튼 라벨은 상위 TEXT 속성으로 노출되지 않는다. 중첩 인스턴스에서 조정한다.
- selected에서는 테두리뿐 아니라 내부 유효 너비와 전체 높이도 달라진다.
- 가격·할인·프로모션을 숨길 때 빈 공간과 카드 높이가 적절히 정리되는지 확인한다.

### 4.7 OptionItem

| 속성 | 값 | 기본값 |
|---|---|---|
| `State` | `default`, `selected` | `default` |
| `Title` | 텍스트 | 데이터를 많이 써요 |
| `Desc` | 텍스트 | 영상·게임을 자주 봐서 무제한이 필요해요 |

- 너비358
- default 높이83, selected 높이86
- 패딩 상하16·좌우20
- 가로 간격12, 제목·설명 간격4
- 반경12, 라디오22×22

| 상태 | 배경·테두리 | 제목 | 라디오 |
|---|---|---|---|
| default | `bg/surface` / `border/default` | `body/strong` | 흰 배경 + 기본 테두리 |
| selected | `bg/default` / `border/medium` | `subtitle/bold` | `fill/primary` + 흰색 점8×8 |

**사용 규칙**

- 설명이 있는 선택지를 카드형으로 제시할 때 사용한다.
- 라디오 형태의 단일 선택 표현이며, 복수 선택용 Checkbox와 구분한다.
- 선택 시 제목 크기와 줄높이가 커져 전체 높이가3 증가한다.
- disabled·오류 변형은 정의되어 있지 않다.

### 4.8 FilterChip

| 속성 | 값 | 기본값 |
|---|---|---|
| `State` | `default`, `selected` | `default` |
| `Label` | 텍스트 | 데이터 많이 |

- 높이40
- 패딩 상하8·좌우16
- 반경 `radius/full`
- 기본 문구 기준 너비: default102 / selected100

| 상태 | 배경·테두리 | 텍스트 |
|---|---|---|
| default | `bg/surface` / `border/default` | `body/small-medium` + `text/primary` |
| selected | `fill/secondary` | `body/small-strong` + `text/on-dark` |

**사용 규칙**

- 목록 조건을 바꾸는 필터에 사용한다.
- 필터 사이 간격은8 사용 사례가 있다.
- 선택 상태는 핑크가 아니라 어두운 배경으로 표현한다.
- 선택 수 제한과 실제 필터 동작은 컴포넌트 정의에 포함되어 있지 않다.
- 상태별 폭 차이를 고려해 고정된 라벨 위치에 의존하지 않는다.

### 4.9 Chip

| 속성 | 값 | 기본값 |
|---|---|---|
| `Type` | `benefit`, `package`, `sale` | `sale` |

| Type | 크기 | 패딩 상하 / 좌우 | 반경 | 표현 |
|---|---|---|---:|---|
| `benefit` | 약107×20 | 4 / 6 | 4 | `bg/subtle` + `caption/mini` + `text/primary` |
| `package` | 약79×20 | 4 / 6 | 4 | `fill/secondary` + `caption/mini` + `text/on-dark` |
| `sale` | 약94×24 | 4 / 10 | 6 | `bg/accent-subtle` + `caption/bold` + `icon/accent` |

**사용 규칙**

- 혜택·패키지·할인 정보를 짧게 표시한다.
- 필터 선택에는 Chip이 아니라 FilterChip을 사용한다.
- Label TEXT 속성은 노출되어 있지 않아 내부 텍스트를 오버라이드한다.
- 현재 외곽 높이는 텍스트 줄높이와 상하 패딩 합계보다2 작다. 문구 변경 시 잘림 여부를 확인한다.

### 4.10 Tag

- 변형·노출 속성 없음
- 기본 문구: 추천
- 원본 크기48×26
- 패딩 상하4·좌우12
- 반경 `radius/999`
- 배경 `border/subtle`
- 텍스트 `caption/bold` + `text/secondary`

**사용 규칙**

- 카드의 추천 여부처럼 짧은 상태 표시에 사용한다.
- 선택·필터 액션으로 사용하지 않는다.
- 문구는 내부 텍스트를 오버라이드한다.

### 4.11 BottomCTA

| 속성 | 값 | 기본값 |
|---|---|---|
| `Layout` | `single`, `double`, `price` | `single` |
| `Amount` | 텍스트 | 월 85,000원 |
| `AmountLabel` | 텍스트 | 월 납부 금액 |

- 공통 너비390, 배경 `bg/surface`, 구분선 `border/subtle`
- 하단 패딩32
- 내부 버튼은 xl

| Layout | 크기 | 구성 | 패딩·간격 |
|---|---|---|---|
| `single` | 390×97 | 전체 너비 Primary 버튼1개 | 상12·좌우16·하32 |
| `double` | 390×97 | Secondary + Primary 가로 배치 | 상12·좌우16·하32, 간격8 |
| `price` | 390×139 | 금액 행 + Primary 버튼 | 상16·좌우16·하32, 간격12 |

- double 원본 버튼 너비: 약133 / 217
- price의 금액 라벨: `body/small-medium` + `text/secondary`
- price의 금액: `subtitle/bold` + `text/primary`

**사용 규칙**

- 단일 주요 액션은 single, 보조·주요 액션의 가로 병치는 double을 사용한다.
- 금액을 확인하며 진행하는 액션에는 price를 사용한다.
- `Amount`와 `AmountLabel`은 price 구성에서 사용한다.
- 버튼 라벨은 상위 속성으로 노출되어 있지 않으므로 중첩 Button에서 변경한다.
- 세로로 쌓는 2버튼 화면은 double 변형이 아니라 별도 레이아웃이다.
- 전체 높이는 패딩·내용 높이 합산보다1 크다. 실제 컴포넌트 치수를 기준으로 한다.

### 4.12 StepProgress

| 속성 | 값 | 기본값 |
|---|---|---|
| `Step` | 문자열 `1`, `2`, `3` | `1` |

- 원본 크기358×30
- 라벨과 트랙 간격8
- 라벨: `caption/bold` + `text/accent`
- 트랙: 358×4, `bg/subtle`, `radius/full`
- 진행 막대: 높이4, `fill/primary`, `radius/2`

| Step | 라벨 | 진행 막대 너비 |
|---|---|---:|
| `1` | STEP 1 / 3 | 119 |
| `2` | STEP 2 / 3 | 239 |
| `3` | STEP 3 / 3 | 358 |

**사용 규칙**

- 3단계 흐름의 진행 상태에 사용한다.
- 단계 라벨과 막대 길이는 같은 Step 변형으로 함께 변경한다.
- 임의 단계 수를 설정하는 속성은 없다.
- 너비가 달라지는 구현에서는 약1/3·2/3·전체 비율을 유지하는 것이 권장된다.

### 4.13 Logo·아이콘

| 컴포넌트 | 원본 크기 | 실제 도형의 주요 토큰 | 용도 |
|---|---:|---|---|
| `Logo` | 32×24 | `brand/primary` | root Header의 브랜드 표시 |
| `icon/arrowLeft` | 24×24 | `icon/default` | 뒤로가기 |
| `icon/check` | 24×24 | `icon/default` | 체크 표시 |
| `icon/doneMark` | 64×64 | 배경 `fill/primary` | 완료 상태의 대표 아이콘 |

**사용 규칙**

- 모두 별도 변형·노출 속성이 없다.
- 크기 변경 시 도형 비율을 유지한다.
- arrowLeft·check는 외곽 프레임에 `icon/on-dark`가 있어도 실제 내부 도형은 `icon/default`를 사용한다. 외곽 채움만 바꾸면 도형 색상이 바뀐다고 가정하지 않는다.
- 반전 아이콘이 필요하면 실제 도형의 색상을 확인한다.
- 클릭 영역·접근성 라벨·상태 전환은 이 시각 컴포넌트 정의와 별도로 처리한다.

### 4.14 공통 사용 경계

- 정의된 변형과 노출 속성을 우선 사용하고, 화면별 콘텐츠만 오버라이드한다.
- 존재하지 않는 loading·pressed·disabled 등의 상태를 이미 정의된 것처럼 취급하지 않는다.
- 시각적 상태 변형이 실제 클릭·선택·입력 동작을 자동 제공하지는 않는다.
- 화면에서 사용된 `Card/Price`는 현재 Components 섹션에서 유효한 컴포넌트 정의를 확인하지 못했다. 재사용 가능한 공식 변형·속성 명세로 포함하지 않는다.
- 상태 전환에 따라 높이·폭·텍스트 스타일이 달라지는 경우가 있으므로, 콘텐츠 잘림과 주변 레이아웃 이동을 함께 확인한다.
