import type { ReactNode } from "react";

// design.md 4.5 List/Row. default: 정보 행 / check: 강조 점이 있는 행
type ListRowProps = {
  label: string;
  value: ReactNode;
  type?: "default" | "check";
};

export default function ListRow({ label, value, type = "default" }: ListRowProps) {
  const isCheck = type === "check";
  return (
    <div className="flex w-full items-center gap-12 border-b border-border-subtle px-4 py-12">
      {isCheck && <span aria-hidden="true" className="size-6 shrink-0 rounded-full bg-icon-accent" />}
      <p className={`flex-1 text-body-small font-medium ${isCheck ? "text-text-primary" : "text-text-secondary"}`}>
        {label}
      </p>
      <p className={`text-right text-body-small font-semibold ${isCheck ? "text-text-accent" : "text-text-primary"}`}>
        {value}
      </p>
    </div>
  );
}
