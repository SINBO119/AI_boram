import { Suspense } from "react";
import { PLANS } from "@/app/_data/mock";
import CardPlan from "@/app/_components/CardPlan";
import FilterChip from "@/app/_components/FilterChip";
import Header from "@/app/_components/Header";
import { GRADE_FILTERS, parseGrade, resolveCustomer, withCustomer } from "@/app/_lib/plan";
import { buildContext, quotePlan } from "@/app/_lib/recommend";

// 2. 요금제 목록 (/plans). 피그마 시안 4189:8047 기준.
// 시안의 이용 횟수형 문구(월 10회 등)와 카드별 추천 Tag는 쓰지 않고, F-L3 항목으로 카드를 채운다.

export default function PlansPage({ searchParams }: PageProps<"/plans">) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-default">
      <Header type="root" title="요금제 목록" />
      {/* 미정 Q14: 로딩 상태 자리 — fallback 비워 둠 */}
      <Suspense fallback={null}>
        <PlansContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PlansContent({ searchParams }: Pick<PageProps<"/plans">, "searchParams">) {
  const { customerId, grade } = await searchParams;
  const ctx = buildContext(resolveCustomer(customerId));
  const selected = parseGrade(grade);
  const id = ctx.customer.customerId;
  // F-L2: 등급은 기본 제공량 구간으로 나눈다. 미정 Q1: 구간 값이 없어 마스터의 grade로 거른다
  const plans = PLANS.filter((p) => selected === "all" || p.grade === selected).map((p) => quotePlan(p, ctx));

  return (
    <main className="flex w-full flex-1 flex-col gap-16 bg-bg-default px-24 py-16">
      {/* F-L1: 등급 필터 칩, 기본 선택 전체 */}
      <nav aria-label="등급 필터" className="flex w-full gap-8 overflow-x-auto">
        {GRADE_FILTERS.map((g) => (
          <FilterChip
            key={g.value}
            label={g.label}
            href={g.value === "all" ? withCustomer("/plans", id) : withCustomer("/plans", id, { grade: g.value })}
            state={selected === g.value ? "selected" : "default"}
          />
        ))}
      </nav>

      <section className="flex w-full flex-col gap-8">
        <h2 className="text-heading-h3 font-bold text-text-primary">나에게 맞는 요금제를 선택하세요</h2>
        <p className="text-body-small font-medium text-text-secondary">요금제별 혜택을 확인한 후 구독할 수 있어요.</p>
      </section>

      <section aria-label="요금제" className="flex w-full flex-col gap-8">
        {/* 미정 Q14: 요금제가 하나도 없을 때(빈 상태)·에러 상태 자리 */}
        {plans.map((q) => (
          <CardPlan
            key={q.plan.planId}
            quote={q}
            href={withCustomer(`/plans/${q.plan.planId}`, id)}
            badge={q.isCurrent ? "사용 중" : undefined}
          />
        ))}
      </section>

      <p className="text-body-small font-medium text-text-secondary">모든 요금은 부가세 포함 금액입니다.</p>
    </main>
  );
}
