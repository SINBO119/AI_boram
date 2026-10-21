import type { ReactNode } from "react";

// 신규: 경고·안내 문구 상자. warning은 사라지는 혜택·상한 초과·데이터 부족, info는 일반 안내
type NoticeProps = {
  tone?: "warning" | "info";
  children: ReactNode;
};

export default function Notice({ tone = "info", children }: NoticeProps) {
  return (
    <p
      role="note"
      className={`w-full rounded-8 px-12 py-8 text-body-small font-medium ${
        tone === "warning" ? "bg-bg-error-subtle text-text-error" : "bg-bg-subtle text-text-secondary"
      }`}
    >
      {children}
    </p>
  );
}
