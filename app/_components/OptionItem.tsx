import Link from "next/link";

// design.md 4.7 OptionItem (State=default). 추천 방식 선택지로 쓰며, 누르면 바로 해당 화면으로 이동한다.
type OptionItemProps = {
  title: string;
  desc: string;
  href: string;
};

export default function OptionItem({ title, desc, href }: OptionItemProps) {
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-12 rounded-12 border border-border-default bg-bg-surface px-20 py-16 hover:border-border-medium"
    >
      <span className="flex flex-1 flex-col gap-4">
        <span className="text-body font-semibold text-text-primary">{title}</span>
        <span className="text-body-small font-medium text-text-secondary">{desc}</span>
      </span>
    </Link>
  );
}
