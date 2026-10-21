import Header from "@/app/_components/Header";
import OptionItem from "@/app/_components/OptionItem";

// 1. 요금제 추천 페이지 (/plans/recommend). 시안 없음: screen-spec 1장 + design.md 컴포넌트로 구성
// 추천 방식 선택: 자동 추천 → 사용 패턴 분석 / 직접 탐색 → 요금제 목록 (screens, flow)
// 분기 A/B/C는 고객 데이터를 불러온 뒤 decideBranch()로 정한다 (app/_lib/recommend.ts, PRD 6-1)
export default function RecommendPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-surface">
      <Header type="root" title="요금제 추천" />
      <main className="flex w-full flex-1 flex-col gap-24 p-16">
        <section className="flex w-full flex-col gap-8">
          <h2 className="text-heading-h3 font-bold text-text-primary">어떻게 요금제를 찾아볼까요?</h2>
          <p className="text-body-small font-medium text-text-secondary">
            최근 데이터 사용량으로 추천받거나, 등급별 요금제를 직접 둘러볼 수 있어요.
          </p>
        </section>
        <div className="flex w-full flex-col gap-8">
          <OptionItem
            href="/plans/recommend/analysis"
            title="자동 추천"
            desc="최근 3개월 사용량을 분석해 맞는 요금제를 골라 드려요"
          />
          <OptionItem href="/plans" title="직접 탐색" desc="등급별 요금제 목록에서 직접 비교해요" />
        </div>
        {/* 미정 Q14: 고객 데이터 로딩·빈·에러 상태 자리 */}
      </main>
    </div>
  );
}
