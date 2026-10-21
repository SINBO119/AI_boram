// design.md 4.10 Tag. 짧은 상태 표시 (기본 문구: 추천)
export default function Tag({ label = "추천" }: { label?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center self-start rounded-999 bg-border-subtle px-12 py-4 text-caption font-bold text-text-secondary">
      {label}
    </span>
  );
}
