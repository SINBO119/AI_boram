import Link from "next/link";

// design.md 4.8 FilterChip. selected는 한 번에 1개, 어두운 배경으로 표시
type FilterChipProps = {
  label: string;
  href: string;
  state?: "default" | "selected";
};

export default function FilterChip({ label, href, state = "default" }: FilterChipProps) {
  const isSelected = state === "selected";
  return (
    <Link
      href={href}
      aria-current={isSelected ? "true" : undefined}
      className={`flex h-40 shrink-0 items-center justify-center rounded-full px-16 py-8 text-body-small ${
        isSelected
          ? "bg-fill-secondary font-semibold text-text-on-dark"
          : "border border-border-default bg-bg-surface font-medium text-text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
