import { redirect } from "next/navigation";

// 서비스 진입점: 요금제 추천 페이지로 보낸다
export default function Home() {
  redirect("/plans/recommend");
}
