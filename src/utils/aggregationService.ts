import { round1, rangeMonthsOfQuarter } from "./numberUtils";

//특정 분기의 월별 실제 배출량을 합산해서 소수점 1자리까지 반올림해서 반환하는 함수
export function sumQuarterActual(
	monthly: { month: number; actual: number }[],
	quarter: 1 | 2 | 3 | 4
): number {
	const { start, end } = rangeMonthsOfQuarter(quarter);

	return round1(
		monthly.reduce((total, m) => {
			return m.month >= start && m.month <= end && Number.isFinite(m.actual)
				? total + m.actual
				: total;
		}, 0)
	);
}
