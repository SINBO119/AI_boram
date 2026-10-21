"use client";

import { useRouter } from "next/navigation";
import IconArrowLeft from "./IconArrowLeft";

// Header(Type=default)의 뒤로가기. 목적지가 정해지지 않아 브라우저 이전 화면으로 간다 (screen-spec [5-4])
export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="뒤로가기"
      onClick={() => router.back()}
      className="flex size-24 shrink-0 items-center justify-center"
    >
      <IconArrowLeft />
    </button>
  );
}
