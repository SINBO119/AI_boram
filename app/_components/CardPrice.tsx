import { formatWon } from "@/app/_lib/format";
import type { PlanQuote } from "@/app/_lib/recommend";

// 신규(시안의 Card/Price, design.md 4.14에 정의 없음): 요금제 상세의 요금 요약 박스
// 대표 금액은 할인 후 실납부액, 보조 줄에 월정액을 함께 둔다 (R11)
export default function CardPrice({ quote }: { quote: PlanQuote }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-12 bg-bg-default p-20">
      <p className="text-caption font-medium text-text-tertiary">{quote.plan.planName}</p>
      <p className="text-heading-h2 font-bold text-text-primary">
        <span className="sr-only">할인 후 실납부액 </span>
        <span data-price="net">월 {formatWon(quote.net)}</span>
      </p>
      <p className="text-caption font-medium text-text-tertiary">
        할인 후 실납부액 · 월정액 <span data-price="monthly">{formatWon(quote.monthly)}</span> · 부가세 포함
      </p>
    </section>
  );
}
