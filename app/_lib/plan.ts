// 화면 표시용 문구 도우미 (금액 문자열은 format.ts의 formatWon()만 만든다)
import { CUSTOMERS, DEFAULT_CUSTOMER_ID, type Customer, type Grade, type Plan } from "@/app/_data/mock";
import { benefitsOf } from "@/app/_lib/recommend";

export function formatGb(gb: number): string {
  return `${Math.round(gb * 10) / 10}GB`;
}

// F-D5: QoS 요금제는 기본 제공량과 그 뒤 제한 속도를 함께 표시
export function dataAllowanceText(plan: Plan): string {
  if (plan.dataType === "unlimited") return "완전 무제한";
  const base = formatGb(plan.baseDataGb ?? 0);
  if (plan.dataType === "qos") return `${base} 이후 최대 ${plan.qosSpeedMbps}Mbps`;
  return base;
}

export function benefitsText(plan: Plan): string {
  const list = benefitsOf(plan).map((b) => b.title);
  return list.length ? list.join(" · ") : "없음";
}

export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return `${y}년 ${Number(m)}월`;
}

export const GRADE_FILTERS: { value: Grade | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "basic", label: "베이직" },
  { value: "standard", label: "스탠다드" },
  { value: "premium", label: "프리미엄" },
];

export function parseGrade(raw: string | string[] | undefined): Grade | "all" {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return GRADE_FILTERS.some((g) => g.value === v) ? (v as Grade | "all") : "all";
}

// 고객은 customerId로만 식별한다 (PRD 8장). 쿼리 customerId로 목업 고객을 바꿔 분기 A/B/C를 확인할 수 있다.
export function resolveCustomer(raw: string | string[] | undefined): Customer {
  const id = Array.isArray(raw) ? raw[0] : raw;
  return (
    CUSTOMERS.find((c) => c.customerId === id) ??
    CUSTOMERS.find((c) => c.customerId === DEFAULT_CUSTOMER_ID) ??
    CUSTOMERS[0]
  );
}

export function withCustomer(path: string, customerId: string, extra: Record<string, string> = {}): string {
  const query = new URLSearchParams({ customerId, ...extra });
  return `${path}?${query.toString()}`;
}
