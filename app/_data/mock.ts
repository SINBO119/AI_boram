// 목업 데이터. 모든 수치·요금제·고객은 가상이다 (PRD 7장 계산 예시 수치를 일부 사용).
// 고객은 customerId로만 식별하고 개인정보는 담지 않는다 (PRD 8장).

export type DataType = "limited" | "qos" | "unlimited";
export type Grade = "basic" | "standard" | "premium";
export type BenefitCategory = "subscription" | "membership";

export type Benefit = {
  benefitId: string;
  title: string;
  category: BenefitCategory;
};

export type Plan = {
  planId: string;
  planName: string;
  // 미정 Q1: 등급 구간 값이 없어 요금제 마스터의 grade 값을 그대로 쓴다
  grade: Grade;
  monthlyFee: number;
  dataType: DataType;
  // 완전 무제한이면 null
  baseDataGb: number | null;
  // QoS 요금제만 값이 있음 (기본 제공량을 다 쓴 뒤의 제한 속도)
  qosSpeedMbps: number | null;
  benefitIds: string[];
};

export type Discount = {
  discountId: string;
  label: string;
  // rate: 월정액 대비 비율(0~1), amount: 정액
  kind: "rate" | "amount";
  value: number;
};

export type MonthlyUsage = {
  // YYYY-MM
  month: string;
  usageGb: number;
};

export type Customer = {
  customerId: string;
  currentPlanId: string;
  usageHistory: MonthlyUsage[];
  discounts: Discount[];
  activeBenefitIds: string[];
};

export const BENEFITS: Benefit[] = [
  { benefitId: "benefit-membership-basic", title: "멤버십 기본 등급", category: "membership" },
  { benefitId: "benefit-membership-vip", title: "멤버십 VIP 등급", category: "membership" },
  { benefitId: "benefit-music", title: "음악 스트리밍 구독", category: "subscription" },
  { benefitId: "benefit-video", title: "영상 OTT 구독", category: "subscription" },
];

export const PLANS: Plan[] = [
  {
    planId: "plan-slim-7",
    planName: "슬림 7GB",
    grade: "basic",
    monthlyFee: 33000,
    dataType: "limited",
    baseDataGb: 7,
    qosSpeedMbps: null,
    benefitIds: [],
  },
  {
    planId: "plan-basic-15",
    planName: "베이직 15GB",
    grade: "basic",
    monthlyFee: 43000,
    dataType: "limited",
    baseDataGb: 15,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-basic"],
  },
  {
    planId: "plan-standard-20",
    planName: "스탠다드 20GB",
    grade: "standard",
    monthlyFee: 60000,
    dataType: "limited",
    baseDataGb: 20,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-basic", "benefit-music"],
  },
  {
    planId: "plan-standard-22",
    planName: "스탠다드 22GB",
    grade: "standard",
    monthlyFee: 57000,
    dataType: "limited",
    baseDataGb: 22,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-basic"],
  },
  {
    planId: "plan-standard-30",
    planName: "스탠다드 30GB",
    grade: "standard",
    monthlyFee: 66000,
    dataType: "limited",
    baseDataGb: 30,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-basic"],
  },
  {
    planId: "plan-premium-50",
    planName: "프리미엄 50GB",
    grade: "premium",
    monthlyFee: 72000,
    dataType: "limited",
    baseDataGb: 50,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-vip", "benefit-music"],
  },
  {
    planId: "plan-premium-qos-100",
    planName: "프리미엄 100GB 플러스",
    grade: "premium",
    monthlyFee: 75000,
    dataType: "qos",
    baseDataGb: 100,
    qosSpeedMbps: 5,
    benefitIds: ["benefit-membership-vip"],
  },
  {
    planId: "plan-unlimited-lite",
    planName: "완전 무제한 라이트",
    grade: "premium",
    monthlyFee: 85000,
    dataType: "unlimited",
    baseDataGb: null,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-vip"],
  },
  {
    planId: "plan-unlimited-ott",
    planName: "완전 무제한 OTT",
    grade: "premium",
    monthlyFee: 95000,
    dataType: "unlimited",
    baseDataGb: null,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-vip", "benefit-video"],
  },
  {
    planId: "plan-unlimited-plus",
    planName: "완전 무제한 플러스",
    grade: "premium",
    monthlyFee: 110000,
    dataType: "unlimited",
    baseDataGb: null,
    qosSpeedMbps: null,
    benefitIds: ["benefit-membership-vip", "benefit-video", "benefit-music"],
  },
];

// 분기별 확인용 가상 고객 3명. 화면에는 customerId만 쓴다.
export const CUSTOMERS: Customer[] = [
  // 분기 A: PRD 7장 예시 (사용량 18 / 25 / 22 GB, 현재 실납부액 50000 → 상한 60000)
  {
    customerId: "C-0001",
    currentPlanId: "plan-standard-20",
    usageHistory: [
      { month: "2026-07", usageGb: 18 },
      { month: "2026-08", usageGb: 25 },
      { month: "2026-09", usageGb: 22 },
    ],
    discounts: [
      { discountId: "discount-contract", label: "선택약정 할인", kind: "rate", value: 0.1 },
      { discountId: "discount-bundle", label: "결합 할인", kind: "amount", value: 4000 },
    ],
    activeBenefitIds: ["benefit-membership-basic", "benefit-music"],
  },
  // 분기 B: 지금 완전 무제한 사용
  {
    customerId: "C-0002",
    currentPlanId: "plan-unlimited-lite",
    usageHistory: [
      { month: "2026-07", usageGb: 40 },
      { month: "2026-08", usageGb: 52 },
      { month: "2026-09", usageGb: 61 },
    ],
    discounts: [{ discountId: "discount-bundle", label: "결합 할인", kind: "amount", value: 5000 }],
    activeBenefitIds: ["benefit-membership-vip"],
  },
  // 분기 C: 현재 기본 제공량이 최대 사용량 이상, 이력 2개월
  {
    customerId: "C-0003",
    currentPlanId: "plan-premium-50",
    usageHistory: [
      { month: "2026-08", usageGb: 30 },
      { month: "2026-09", usageGb: 35 },
    ],
    discounts: [{ discountId: "discount-contract", label: "선택약정 할인", kind: "rate", value: 0.25 }],
    activeBenefitIds: ["benefit-membership-vip", "benefit-music"],
  },
];

export const DEFAULT_CUSTOMER_ID = "C-0001";
