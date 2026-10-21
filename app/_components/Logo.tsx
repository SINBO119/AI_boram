// design.md 4.13 Logo (32×24, brand/primary). 시안의 로고 도형 대신 같은 색의 글자로 표시한다.
export default function Logo() {
  return (
    <span
      role="img"
      aria-label="로고"
      className="flex h-24 w-32 shrink-0 items-center justify-center text-subtitle font-bold text-brand-primary"
    >
      U+
    </span>
  );
}
