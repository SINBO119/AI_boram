import { formatWon } from "@/app/_lib/format";
import { dataAllowanceText } from "@/app/_lib/plan";
import type { CustomerContext } from "@/app/_lib/recommend";
import ListRow from "./ListRow";

// 신규: 현재 요금제 요약. 월정액, 할인 후 실납부액(R11), 적용 중 할인(R4), 요금 상한(R3)
export default function CurrentPlanSummary({ ctx }: { ctx: CustomerContext }) {
  const { currentPlan, customer, currentNet, cap } = ctx;
  return (
    <section className="flex w-full flex-col gap-12">
      <h2 className="text-subtitle font-bold text-text-primary">지금 쓰는 요금제</h2>
      <div className="flex w-full flex-col">
        <ListRow label="요금제" value={currentPlan.planName} />
        <ListRow label="기본 제공량" value={dataAllowanceText(currentPlan)} />
        <ListRow label="월정액" value={<span data-price="monthly">{formatWon(currentPlan.monthlyFee)}</span>} />
        <ListRow
          label="적용 중 할인"
          value={customer.discounts.length ? customer.discounts.map((d) => d.label).join(" · ") : "없음"}
        />
        <ListRow label="할인 후 실납부액" value={<span data-price="net">{formatWon(currentNet)}</span>} />
        <ListRow type="check" label="요금 상한 (실납부액의 120%)" value={formatWon(cap)} />
      </div>
    </section>
  );
}
