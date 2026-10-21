// 금액 문자열을 만드는 유일한 곳. 다른 파일은 formatWon()만 쓴다.
const wonNumber = new Intl.NumberFormat("ko-KR");

export function formatWon(amount: number): string {
  return `${wonNumber.format(Math.round(amount))}원`;
}
