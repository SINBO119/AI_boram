import { Suspense } from "react";
import BottomCTA from "@/app/_components/BottomCTA";
import CurrentPlanSummary from "@/app/_components/CurrentPlanSummary";
import Header from "@/app/_components/Header";
import ListRow from "@/app/_components/ListRow";
import Notice from "@/app/_components/Notice";
import { formatGb, monthLabel, resolveCustomer, withCustomer } from "@/app/_lib/plan";
import { BASE_PERIOD_MONTHS, buildContext, decideBranch, type Branch } from "@/app/_lib/recommend";

// 3. 사용 패턴 분석 (/plans/recommend/analysis). 시안 없음: screen-spec 3장 + design.md 컴포넌트로 구성
// F-A1 월별 사용량·최대 사용량, F-A2 짧은 이력 안내, R1 적정 데이터량, R3 요금 상한, R4 할인 재적용

const BRANCH_TEXT: Record<Branch, string> = {
  A: "사용량에 맞는 요금제를 추천해 드릴게요.",
  B: "지금 완전 무제한 요금제를 쓰고 있어요. 사용량 대신 원하는 혜택으로 추천해 드릴게요.",
  C: "지금 요금제가 사용량에 맞는지 확인해 드릴게요.",
};

export default function AnalysisPage({ searchParams }: PageProps<"/plans/recommend/analysis">) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-surface">
      <Header title="사용 패턴 분석" />
      {/* 미정 Q14: 분석 진행(로딩) 표현 자리 — fallback 비워 둠 */}
      <Suspense fallback={null}>
        <AnalysisContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function AnalysisContent({ searchParams }: Pick<PageProps<"/plans/recommend/analysis">, "searchParams">) {
  const { customerId } = await searchParams;
  const ctx = buildContext(resolveCustomer(customerId));
  const branch = decideBranch(ctx);
  const { usage } = ctx;
  // 미정 Q14: 데이터 조회 실패(에러)·이력 0건(빈) 상태 자리

  return (
    <>
      <main className="flex w-full flex-1 flex-col gap-24 p-16">
        <section className="flex w-full flex-col gap-8">
          <h2 className="text-heading-h3 font-bold text-text-primary">사용 패턴을 분석했어요</h2>
          <p className="text-body-small font-medium text-text-secondary">{BRANCH_TEXT[branch]}</p>
        </section>

        {branch !== "B" && (
          <section className="flex w-full flex-col gap-12">
            <h2 className="text-subtitle font-bold text-text-primary">최근 {BASE_PERIOD_MONTHS}개월 데이터 사용량</h2>
            {usage.isShortHistory && (
              <Notice>
                이용 이력이 {usage.months.length}개월뿐이라 있는 만큼으로 계산했어요.
              </Notice>
            )}
            <div className="flex w-full flex-col">
              {usage.months.map((m) => (
                <ListRow key={m.month} label={monthLabel(m.month)} value={formatGb(m.usageGb)} />
              ))}
              <ListRow type="check" label="최대 사용량 (적정 데이터량)" value={formatGb(usage.maxGb)} />
              <ListRow label="평균 사용량" value={formatGb(usage.avgGb)} />
            </div>
          </section>
        )}

        <CurrentPlanSummary ctx={ctx} />
      </main>
      <BottomCTA label="추천 결과 보기" href={withCustomer("/plans/recommend/result", ctx.customer.customerId)} />
    </>
  );
}
