import BackButton from "./BackButton";
import Logo from "./Logo";

// design.md 4.4 Header. root: 제목 + Logo / default: 뒤로가기 + 가운데 제목 + spacer
type HeaderProps = {
  type?: "default" | "root";
  title: string;
};

export default function Header({ type = "default", title }: HeaderProps) {
  if (type === "root") {
    return (
      <header className="flex h-56 w-full shrink-0 items-center gap-12 bg-bg-surface px-16 py-4">
        <h1 className="flex-1 text-heading-h4 font-bold text-text-primary">{title}</h1>
        <Logo />
      </header>
    );
  }
  return (
    <header className="flex h-56 w-full shrink-0 items-center gap-8 bg-bg-surface px-16 py-4">
      <BackButton />
      <h1 className="flex-1 text-center text-subtitle font-semibold text-text-primary">{title}</h1>
      <span aria-hidden="true" className="size-24 shrink-0" />
    </header>
  );
}
