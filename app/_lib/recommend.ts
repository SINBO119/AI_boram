// 추천 계산 함수. 근거: PRD 6-1, 7장 (DOMAIN R1~R10).
import {
  BENEFITS,
  PLANS,
  type Benefit,
  type BenefitCategory,
  type Customer,
  type Discount,
  type MonthlyUsage,
  type Plan,
} from "@/app/_data/mock";

export const BASE_PERIOD_MONTHS = 3;
export const PRICE_CAP_RATE = 1.2;

// ---------- 사용량 (R1, F-A1, F-A2) ----------

export type UsageSummary = {
  months: MonthlyUsage[];
  maxGb: number;
  avgGb: number;
  isShortHistory: boolean;
};

export function summarizeUsage(history: MonthlyUsage[]): UsageSummary {
  // 미정 Q7: QoS 요금제 고객의 속도 제한 뒤 사용량 포함 여부. 목업 사용량을 그대로 쓴다
  const months = [...history].sort((a, b) => a.month.localeCompare(b.month)).slice(-BASE_PERIOD_MONTHS);
  const values = months.map((m) => m.usageGb);
  const maxGb = values.length ? Math.max(...values) : 0;
  const avgGb = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
  return { months, maxGb, avgGb, isShortHistory: months.length < BASE_PERIOD_MONTHS };
}

// ---------- 요금 (R3, R4) ----------

// R4: 지금 받는 할인을 종류별로 다시 적용한다. 비율 할인은 같은 비율(월정액 기준), 정액 할인은 같은 금액.
export function netPrice(monthlyFee: number, discounts: Discount[]): number {
  // 미정 Q5: 새 요금제에 적용되지 않는 할인의 처리. 지금은 모든 할인을 그대로 다시 적용한다
  const off = discounts.reduce((sum, d) => sum + (d.kind === "rate" ? monthlyFee * d.value : d.value), 0);
  return Math.max(0, Math.round(monthlyFee - off));
}

// R3: 요금 상한 = 현재 할인 후 실납부액 × 1.2
export function priceCap(currentNet: number): number {
  return Math.round(currentNet * PRICE_CAP_RATE);
}

// ---------- 데이터 충분 (R2) ----------

// 완전 무제한은 항상 충분, QoS는 기본 제공량만으로 판단
export function isDataSufficient(plan: Plan, maxGb: number): boolean {
  if (plan.dataType === "unlimited") return true;
  return (plan.baseDataGb ?? 0) >= maxGb;
}

// ---------- 혜택 (R8) ----------

export function benefitsOf(plan: Plan): Benefit[] {
  return plan.benefitIds.map((id) => BENEFITS.find((b) => b.benefitId === id)).filter((b): b is Benefit => !!b);
}

export function lostBenefits(plan: Plan, activeBenefitIds: string[]): Benefit[] {
  return activeBenefitIds
    .filter((id) => !plan.benefitIds.includes(id))
    .map((id) => BENEFITS.find((b) => b.benefitId === id))
    .filter((b): b is Benefit => !!b);
}

// ---------- 고객 맥락 ----------

export type CustomerContext = {
  customer: Customer;
  currentPlan: Plan;
  usage: UsageSummary;
  currentNet: number;
  cap: number;
};

export function findPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.planId === planId);
}

export function buildContext(customer: Customer): CustomerContext {
  const currentPlan = findPlan(customer.currentPlanId) ?? PLANS[0];
  const currentNet = netPrice(currentPlan.monthlyFee, customer.discounts);
  return {
    customer,
    currentPlan,
    usage: summarizeUsage(customer.usageHistory),
    currentNet,
    cap: priceCap(currentNet),
  };
}

// 요금제 한 개를 현재 요금제와 비교한 값 (F-A8, F-D1~F-D4, R11)
export type PlanQuote = {
  plan: Plan;
  monthly: number;
  net: number;
  diff: number;
  overCap: boolean;
  sufficient: boolean;
  lost: Benefit[];
  isCurrent: boolean;
};

export function quotePlan(plan: Plan, ctx: CustomerContext): PlanQuote {
  const net = netPrice(plan.monthlyFee, ctx.customer.discounts);
  return {
    plan,
    monthly: plan.monthlyFee,
    net,
    diff: net - ctx.currentNet,
    overCap: net > ctx.cap,
    sufficient: isDataSufficient(plan, ctx.usage.maxGb),
    lost: lostBenefits(plan, ctx.customer.activeBenefitIds),
    isCurrent: plan.planId === ctx.currentPlan.planId,
  };
}

// ---------- 분기 (PRD 6-1 조건표) ----------

export type Branch = "A" | "B" | "C";

export function decideBranch(ctx: CustomerContext): Branch {
  if (ctx.currentPlan.dataType === "unlimited") return "B";
  // R10: 현재 기본 제공량 ≥ 최대 사용량 → C
  if ((ctx.currentPlan.baseDataGb ?? 0) >= ctx.usage.maxGb) return "C";
  return "A";
}

// ---------- 분기 A: 사용량 기준 추천 ----------

export type RecommendationA = {
  branch: "A";
  best: PlanQuote | null;
  // F-A7: 후보가 없어 상한을 넘는 요금제를 추천했는지
  overCapFallback: boolean;
  upper: PlanQuote | null;
  lower: PlanQuote | null;
};

// 가정 Q3: 단계는 기본 제공량 순서. 완전 무제한은 가장 위 단계
function dataRank(plan: Plan): number {
  return plan.dataType === "unlimited" ? Number.POSITIVE_INFINITY : plan.baseDataGb ?? 0;
}

export function recommendA(ctx: CustomerContext): RecommendationA {
  const ladder = PLANS.filter((p) => p.planId !== ctx.currentPlan.planId)
    .map((p) => quotePlan(p, ctx))
    .sort((a, b) => dataRank(a.plan) - dataRank(b.plan) || a.net - b.net);

  // F-A3: 데이터 충분(R2) + 실납부액 ≤ 요금 상한(R3)
  // 미정 Q9: 5G / LTE 구분은 후보 조건에 넣지 않았다
  const candidates = ladder.filter((q) => q.sufficient && !q.overCap);
  const sufficient = ladder.filter((q) => q.sufficient);
  const cheapest = (list: PlanQuote[]) => list.reduce<PlanQuote | null>((m, q) => (!m || q.net < m.net ? q : m), null);

  // 가정 Q2: 최적 요금제 = 후보 중 실납부액 최저
  const overCapFallback = candidates.length === 0;
  const best = overCapFallback ? cheapest(sufficient) : cheapest(candidates);
  if (!best) return { branch: "A", best: null, overCapFallback, upper: null, lower: null };

  const idx = ladder.indexOf(best);
  // 미정 Q4: 대안에 상한을 적용할지 정해지지 않아 거르지 않고, 상한 초과 여부만 표시한다
  const upper = ladder[idx + 1] ?? null;
  const lowerRaw = ladder[idx - 1] ?? null;
  // F-A6: 한 단계 아래 대안은 기본 제공량 ≥ 평균 사용량일 때만
  const lower =
    lowerRaw && lowerRaw.plan.dataType !== "unlimited" && (lowerRaw.plan.baseDataGb ?? 0) >= ctx.usage.avgGb
      ? lowerRaw
      : null;
  return { branch: "A", best, overCapFallback, upper, lower };
}

// ---------- 분기 B: 혜택 기준 추천 ----------

export type RecommendationB = {
  branch: "B";
  category: BenefitCategory | null;
  candidates: PlanQuote[];
};

export const BENEFIT_CATEGORIES: { value: BenefitCategory; label: string }[] = [
  { value: "subscription", label: "제휴 구독" },
  { value: "membership", label: "멤버십·할인" },
];

export function parseCategory(raw: string | string[] | undefined): BenefitCategory | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return BENEFIT_CATEGORIES.some((c) => c.value === v) ? (v as BenefitCategory) : null;
}

// F-B1: 사용량은 근거로 쓰지 않는다. F-B3: 다른 완전 무제한 + 고른 혜택 + 실납부액 ≤ 상한
export function recommendB(ctx: CustomerContext, category: BenefitCategory | null): RecommendationB {
  if (!category) return { branch: "B", category, candidates: [] };
  // 미정 Q6: 복수 선택, 보여 줄 개수·정렬이 정해지지 않아 한 개만 고르고 마스터 순서대로 모두 보여 준다
  const candidates = PLANS.filter(
    (p) =>
      p.dataType === "unlimited" &&
      p.planId !== ctx.currentPlan.planId &&
      benefitsOf(p).some((b) => b.category === category),
  )
    .map((p) => quotePlan(p, ctx))
    .filter((q) => !q.overCap);
  return { branch: "B", category, candidates };
}
