import Link from "next/link";
import type { ReactNode } from "react";
import { formatWon } from "@/app/_lib/format";
import { benefitsText, dataAllowanceText } from "@/app/_lib/plan";
import type { PlanQuote } from "@/app/_lib/recommend";
import Button from "./Button";
import Tag from "./Tag";

// design.md 4.6 Card/Plan. 카드 전체를 누르면 요금제 상세로 이동한다 (F-L4).
// 표시: 이름, 기본 제공량(QoS면 제한 속도), 추가 혜택, 월정액 + 할인 후 실납부액(R11), 선택 시 현재 대비 차이(F-A8)
type CardPlanProps = {
  quote: PlanQuote;
  href: string;
  badge?: string;
  state?: "default" | "selected";
  showDiff?: boolean;
  children?: ReactNode;
};

export default function CardPlan({ quote, href, badge, state = "default", showDiff = false, children }: CardPlanProps) {
  const { plan, monthly, net, diff } = quote;
  const diffSign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  return (
    <Link
      href={href}
      className={`flex w-full flex-col gap-8 rounded-16 border bg-bg-surface p-20 ${
        state === "selected" ? "border-border-medium" : "border-border-default"
      }`}
    >
      {badge && <Tag label={badge} />}
      <h3 className="text-subtitle font-bold text-text-primary">{plan.planName}</h3>
      <p className="text-body-small font-medium text-text-secondary">
        기본 제공량 {dataAllowanceText(plan)} · 추가 혜택 {benefitsText(plan)}
      </p>
      <div className="flex w-full items-center gap-12 pt-8">
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-caption font-medium text-text-tertiary">
            월정액 <span data-price="monthly">{formatWon(monthly)}</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-caption font-medium text-text-secondary">할인 후</span>
            <span data-price="net" className="text-subtitle font-bold text-text-primary">
              월 {formatWon(net)}
            </span>
          </p>
          {showDiff && (
            <p className={`text-caption font-medium ${diff > 0 ? "text-text-accent" : "text-text-secondary"}`}>
              {diff === 0 ? "현재와 같은 금액이에요" : `현재보다 월 ${diffSign}${formatWon(Math.abs(diff))}`}
            </p>
          )}
        </div>
        <Button label="요금제 보기" type="Secondary" size="sm" />
      </div>
      {children && <div className="flex w-full flex-col gap-8">{children}</div>}
    </Link>
  );
}
