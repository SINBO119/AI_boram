import { notFound } from "next/navigation";
import { Suspense } from "react";
import Button from "@/app/_components/Button";
import CardPrice from "@/app/_components/CardPrice";
import Header from "@/app/_components/Header";
import ListRow from "@/app/_components/ListRow";
import Notice from "@/app/_components/Notice";
import { formatWon } from "@/app/_lib/format";
import { benefitsText, dataAllowanceText, formatGb, resolveCustomer, withCustomer } from "@/app/_lib/plan";
import { benefitsOf, buildContext, findPlan, quotePlan, type PlanQuote } from "@/app/_lib/recommend";

// 5. 요금제 상세 (/plans/[planId]). 피그마 시안 4189:8064 기준.
// 시안의 이용 횟수형 문구와 구독 안내, 구독 신청 버튼은 쓰지 않는다 (PRD 5장, F-D7).
// F-D1 현재 요금제와 비교, F-D2 데이터 충분, F-D3 실납부액 차이·상한, F-D4 사라지는 혜택, F-D5 QoS, F-D6 추천으로 돌아가기

const CATEGORY_LABEL = { subscription: "제휴 구독", membership: "멤버십·할인" } as const;

export default function PlanDetailPage({ params, searchParams }: PageProps<"/plans/[planId]">) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-surface">
      <Header title="요금제 상세" />
      {/* 미정 Q14: 로딩 상태 자리 — fallback 비워 둠 */}
      <Suspense fallback={null}>
        <DetailContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DetailContent({ params, searchParams }: PageProps<"/plans/[planId]">) {
  const { planId } = await params;
  const { customerId } = await searchParams;
  const plan = findPlan(planId);
  // 미정 Q14: 없는 요금제·조회 실패(빈·에러) 표현이 정해지지 않아 기본 404로 둔다
  if (!plan) notFound();

  const ctx = buildContext(resolveCustomer(customerId));
  const selected = quotePlan(plan, ctx);
  const current = quotePlan(ctx.currentPlan, ctx);

  return (
    <>
      <main className="flex w-full flex-1 flex-col gap-24 p-24">
        <CardPrice quote={selected} />
        {selected.isCurrent && <Notice>지금 쓰고 있는 요금제예요.</Notice>}

        <CompareSection selected={selected} current={current} />

        <section className="flex w-full flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">바꾸기 전에 확인하세요</h2>
          <div className="flex w-full flex-col">
            {/* F-D2. 미정 Q7: QoS 고객의 속도 제한 뒤 사용량 포함 여부 */}
            <ListRow
              type="check"
              label={`최대 사용량 ${formatGb(ctx.usage.maxGb)} 대비 데이터`}
              value={selected.sufficient ? "충분해요" : "모자라요"}
            />
            {/* F-D3 */}
            <ListRow
              label="현재 대비 실납부액"
              value={
                selected.diff === 0
                  ? "같아요"
                  : `월 ${selected.diff > 0 ? "+" : "-"}${formatWon(Math.abs(selected.diff))}`
              }
            />
            <ListRow label="요금 상한 (현재의 120%)" value={selected.overCap ? "넘어요" : "이내예요"} />
          </div>
          {!selected.sufficient && (
            <Notice tone="warning">가장 많이 쓴 달 기준으로 데이터가 모자랄 수 있어요.</Notice>
          )}
          {selected.overCap && (
            <Notice tone="warning">현재보다 20% 넘게 올라요. 요금 상한은 월 {formatWon(ctx.cap)}이에요.</Notice>
          )}
          {/* F-D4, R8 */}
          {selected.lost.length > 0 && (
            <Notice tone="warning">바꾸면 사라지는 혜택: {selected.lost.map((b) => b.title).join(", ")}</Notice>
          )}
        </section>

        <section className="flex w-full flex-col gap-12">
          <h2 className="text-heading-h3 font-bold text-text-primary">제공 혜택</h2>
          <div className="flex w-full flex-col">
            {/* F-D5: QoS면 기본 제공량과 제한 속도를 함께 */}
            <ListRow label="기본 제공량" value={plan.dataType === "unlimited" ? "완전 무제한" : formatGb(plan.baseDataGb ?? 0)} />
            {plan.dataType === "qos" && (
              <ListRow label="기본 제공량 소진 후" value={`최대 ${plan.qosSpeedMbps}Mbps 속도 제한`} />
            )}
            {benefitsOf(plan).map((b) => (
              <ListRow key={b.benefitId} label={CATEGORY_LABEL[b.category]} value={b.title} />
            ))}
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 flex w-full flex-col gap-8 border-t border-border-subtle bg-bg-surface px-24 pt-16 pb-32">
        {/* 미정 Q13: 구독 신청 버튼(숨김·비활성·다른 곳 연결) 자리 */}
        {/* F-D6: 다른 요금제를 비교하려면 추천 결과로 돌아간다 */}
        <Button
          label="다른 요금제 비교하기"
          type="Secondary"
          href={withCustomer("/plans/recommend/result", ctx.customer.customerId)}
          fullWidth
        />
      </div>
    </>
  );
}

// F-D1: 선택 요금제와 현재 요금제 나란히 비교 (월정액, 할인 후 실납부액, 기본 제공량, 추가 혜택)
function CompareSection({ selected, current }: { selected: PlanQuote; current: PlanQuote }) {
  const cell = "px-4 py-12 text-left align-top text-body-small";
  return (
    <section className="flex w-full flex-col gap-12">
      <h2 className="text-heading-h3 font-bold text-text-primary">현재 요금제와 비교</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            <th scope="col" className={`${cell} font-medium text-text-secondary`}>
              항목
            </th>
            <th scope="col" className={`${cell} font-semibold text-text-primary`}>
              {selected.plan.planName}
            </th>
            <th scope="col" className={`${cell} font-semibold text-text-secondary`}>
              현재 {current.plan.planName}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border-subtle">
            <th scope="row" className={`${cell} font-medium text-text-secondary`}>
              월정액
            </th>
            <td data-price="monthly" className={`${cell} font-semibold text-text-primary`}>
              {formatWon(selected.monthly)}
            </td>
            <td data-price="monthly" className={`${cell} font-medium text-text-secondary`}>
              {formatWon(current.monthly)}
            </td>
          </tr>
          <tr className="border-b border-border-subtle">
            <th scope="row" className={`${cell} font-medium text-text-secondary`}>
              할인 후 실납부액
            </th>
            <td data-price="net" className={`${cell} font-semibold text-text-primary`}>
              {formatWon(selected.net)}
            </td>
            <td data-price="net" className={`${cell} font-medium text-text-secondary`}>
              {formatWon(current.net)}
            </td>
          </tr>
          <tr className="border-b border-border-subtle">
            <th scope="row" className={`${cell} font-medium text-text-secondary`}>
              기본 제공량
            </th>
            <td className={`${cell} font-semibold text-text-primary`}>{dataAllowanceText(selected.plan)}</td>
            <td className={`${cell} font-medium text-text-secondary`}>{dataAllowanceText(current.plan)}</td>
          </tr>
          <tr className="border-b border-border-subtle">
            <th scope="row" className={`${cell} font-medium text-text-secondary`}>
              추가 혜택
            </th>
            <td className={`${cell} font-semibold text-text-primary`}>{benefitsText(selected.plan)}</td>
            <td className={`${cell} font-medium text-text-secondary`}>{benefitsText(current.plan)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
