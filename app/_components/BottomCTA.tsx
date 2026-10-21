import Button from "./Button";

// design.md 4.11 BottomCTA (Layout=single). 상12·좌우16·하32, 구분선 border/subtle
type BottomCTAProps = {
  label: string;
  href: string;
};

export default function BottomCTA({ label, href }: BottomCTAProps) {
  return (
    <div className="sticky bottom-0 w-full border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32">
      <Button label={label} href={href} fullWidth />
    </div>
  );
}
