import Link from "next/link";

// design.md 4.1 Button. href가 있으면 링크, 없으면 카드 안의 표시용(span)으로 그린다.
type ButtonProps = {
  label: string;
  href?: string;
  type?: "Primary" | "Secondary";
  size?: "xl" | "lg" | "sm";
  fullWidth?: boolean;
};

const SIZE_CLASS = {
  xl: "px-24 py-16",
  lg: "px-24 py-12",
  sm: "px-24 py-8",
} as const;

const TYPE_CLASS = {
  Primary: "bg-fill-primary text-text-on-dark hover:bg-fill-primary-hover",
  Secondary: "border border-border-default bg-surface-default text-text-primary hover:bg-bg-subtle",
} as const;

export default function Button({ label, href, type = "Primary", size = "xl", fullWidth = false }: ButtonProps) {
  const className = `flex items-center justify-center rounded-8 text-body font-semibold ${SIZE_CLASS[size]} ${TYPE_CLASS[type]} ${fullWidth ? "w-full" : "shrink-0"}`;
  if (!href) return <span className={className}>{label}</span>;
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
