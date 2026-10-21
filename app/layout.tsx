import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 글꼴은 --font-sans 토큰(Noto Sans KR)을 따른다. next/font가 같은 변수에 불러온 Noto Sans KR을 연결한다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "요금제 추천",
  description: "사용량에 맞는 요금제를 추천하고 비교합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="min-h-full bg-bg-surface font-sans text-body font-medium text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
