import { Suspense } from "react";
import CardPlan from "@/app/_components/CardPlan";
import CurrentPlanSummary from "@/app/_components/CurrentPlanSummary";
import FilterChip from "@/app/_components/FilterChip";
import Header from "@/app/_components/Header";
import ListRow from "@/app/_components/ListRow";
import Notice from "@/app/_components/Notice";
import { dataAllowanceText, formatGb, monthLabel, resolveCustomer, withCustomer } from "@/app/_lib/plan";
import {
  BASE_PERIOD_MONTHS,
  BENEFIT_CATEGORIES,
  buildContext,
  decideBranch,
  parseCategory,
  recommendA,
  recommendB,
  type CustomerContext,
  type PlanQuote,
} from "@/app/_lib/recommend";

// 4. 맞춤 요금제 추천 결과 (/plans/recommend/result). 시안 없음: screen-spec 4장 + design.md 컴포넌트로 구성
// 분기 A(F-A1~F-A9) / B(F-B1~F-B4) / C(F-C1~F-C2)

export default function ResultPage({ searchParams }: PageProps<"/plans/recommend/result">) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-surface">
      <Header title="맞춤 요금제 추천" />
      {/* 미정 Q14: 로딩 상태 자리 — fallback 비워 둠 */}
      <Suspense fallback={null}>
        <ResultContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ResultContent({ searchParams }: Pick<PageProps<"/plans/recommend/result">, "searchParams">) {
  const { customerId, benefit } = await searchParams;
  const ctx = buildContext(resolveCustomer(customerId));
  const branch = decideBranch(ctx);
  // 미정 Q14: 데이터 조회 실패(에러) 상태 자리

  return (
    <main className="flex w-full flex-1 flex-col gap-24 p-16">
      {branch === "A" && <BranchA ctx={ctx} />}
      {branch === "B" && <BranchB ctx={ctx} benefit={benefit} />}
      {branch === "C" && <BranchC ctx={ctx} />}
      {branch !== "C" && <CurrentPlanSummary ctx={ctx} />}
    </main>
  );
}

function LostBenefitNotice({ quote }: { quote: PlanQuote }) {
  if (!quote.lost.length) return null;
  // F-A9, R8: 사라지는 혜택 경고
  return <Notice tone="warning">바꾸면 사라지는 혜택: {quote.lost.map((b) => b.title).join(", ")}</Notice>;
}

function UsageRows({ ctx }: { ctx: CustomerContext }) {
  const { usage } = ctx;
  return (
    <div className="flex w-full flex-col">
      {usage.months.map((m) => (
        <ListRow key={m.month} label={monthLabel(m.month)} value={formatGb(m.usageGb)} />
      ))}
      <ListRow type="check" label="최대 사용량" value={formatGb(usage.maxGb)} />
    </div>
  );
}

// ---------- A. 사용량 기준 추천 ----------
function BranchA({ ctx }: { ctx: CustomerContext }) {
  const rec = recommendA(ctx);
  const id = ctx.customer.customerId;
  const href = (q: PlanQuote) => withCustomer(`/plans/${q.plan.planId}`, id);

  return (
    <>
      <section className="flex w-full flex-col gap-12">
        <h2 className="text-heading-h3 font-bold text-text-primary">
          최근 {BASE_PERIOD_MONTHS}개월 중 가장 많이 쓴 달은 {formatGb(ctx.usage.maxGb)}예요
        </h2>
        {ctx.usage.isShortHistory && (
          <Notice>이용 이력이 {ctx.usage.months.length}개월뿐이라 있는 만큼으로 계산했어요.</Notice>
        )}
        <UsageRows ctx={ctx} />
      </section>

      {/* 미정 Q14: 추천할 요금제가 하나도 없을 때(빈 상태) 자리 */}
      {rec.best && (
        <section className="flex w-full flex-col gap-12">
          <h2 className="text-subtitle font-bold text-text-primary">추천 요금제</h2>
          {rec.overCapFallback && (
            <Notice tone="warning">
              조건에 맞는 요금제가 없어 데이터가 충분한 요금제 중 가장 저렴한 요금제를 골랐어요. 현재보다 20% 넘게 올라요.
            </Notice>
          )}
          <CardPlan quote={rec.best} href={href(rec.best)} badge="추천" state="selected" showDiff>
            <LostBenefitNotice quote={rec.best} />
          </CardPlan>
        </section>
      )}

      {(rec.upper || rec.lower) && (
        <section className="flex w-full flex-col gap-12">
          <h2 className="text-subtitle font-bold text-text-primary">다른 선택지</h2>
          {rec.upper && (
            <CardPlan quote={rec.upper} href={href(rec.upper)} badge="한 단계 위" showDiff>
              {/* 미정 Q4: 대안에 상한을 적용할지 정해지지 않아 초과 여부만 표시 */}
              {rec.upper.overCap && <Notice tone="warning">요금 상한을 넘어요.</Notice>}
              <LostBenefitNotice quote={rec.upper} />
            </CardPlan>
          )}
          {rec.lower && (
            <CardPlan quote={rec.lower} href={href(rec.lower)} badge="한 단계 아래" showDiff>
              {/* F-A6: 한 단계 아래 대안 경고 */}
              {!rec.lower.sufficient && <Notice tone="warning">가장 많이 쓴 달에는 데이터가 모자랄 수 있어요.</Notice>}
              {rec.lower.overCap && <Notice tone="warning">요금 상한을 넘어요.</Notice>}
              <LostBenefitNotice quote={rec.lower} />
            </CardPlan>
          )}
        </section>
      )}
    </>
  );
}

// ---------- B. 혜택 기준 추천 ----------
function BranchB({ ctx, benefit }: { ctx: CustomerContext; benefit: string | string[] | undefined }) {
  const category = parseCategory(benefit);
  const rec = recommendB(ctx, category);
  const id = ctx.customer.customerId;

  return (
    <>
      <section className="flex w-full flex-col gap-12">
        <h2 className="text-heading-h3 font-bold text-text-primary">원하는 혜택을 골라 주세요</h2>
        <p className="text-body-small font-medium text-text-secondary">
          지금 완전 무제한을 쓰고 있어서 사용량 대신 혜택으로 다른 무제한 요금제를 찾아 드려요.
        </p>
        {/* 미정 Q6: 복수 선택 여부가 정해지지 않아 한 번에 1개만 고른다 */}
        <div className="flex w-full gap-8">
          {BENEFIT_CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              label={c.label}
              href={withCustomer("/plans/recommend/result", id, { benefit: c.value })}
              state={category === c.value ? "selected" : "default"}
            />
          ))}
        </div>
      </section>

      {category && (
        <section className="flex w-full flex-col gap-12">
          <h2 className="text-subtitle font-bold text-text-primary">추천 요금제</h2>
          {/* 미정 Q6: 보여 줄 개수·정렬·후보가 없을 때 처리 자리 (지금은 마스터 순서로 모두 표시) */}
          {rec.candidates.map((q) => (
            <CardPlan key={q.plan.planId} quote={q} href={withCustomer(`/plans/${q.plan.planId}`, id)} showDiff>
              <LostBenefitNotice quote={q} />
            </CardPlan>
          ))}
        </section>
      )}
    </>
  );
}

// ---------- C. 현재 유지 안내 ----------
function BranchC({ ctx }: { ctx: CustomerContext }) {
  return (
    <section className="flex w-full flex-col gap-12">
      <h2 className="text-heading-h3 font-bold text-text-primary">지금 요금제가 적합해요</h2>
      <p className="text-body-small font-medium text-text-secondary">
        가장 많이 쓴 달에도 지금 요금제의 기본 제공량 안에서 썼어요.
      </p>
      {ctx.usage.isShortHistory && (
        <Notice>이용 이력이 {ctx.usage.months.length}개월뿐이라 있는 만큼으로 계산했어요.</Notice>
      )}
      <div className="flex w-full flex-col">
        <ListRow label="지금 쓰는 요금제" value={ctx.currentPlan.planName} />
        <ListRow type="check" label="최대 사용량" value={formatGb(ctx.usage.maxGb)} />
        <ListRow label="현재 기본 제공량" value={dataAllowanceText(ctx.currentPlan)} />
      </div>
      {/* 미정 Q8: 요금제 목록이나 다른 추천으로 이동하는 버튼 자리 */}
    </section>
  );
}
