/** 소수 1자리 반올림 (NaN/Infinity 안전) */
export function round1(n: number): number {
	if (!Number.isFinite(n)) return 0;
	return Math.round(n * 10) / 10;
}

export function clampMonth(m: number): number {
	if (m < 1) return 1;
	if (m > 12) return 12;
	return m;
}

export function quarterOf(month: number): 1 | 2 | 3 | 4 {
	const m = clampMonth(month);
	if (m <= 3) return 1;
	if (m <= 6) return 2;
	if (m <= 9) return 3;
	return 4;
}

export function rangeMonthsOfQuarter(q: 1 | 2 | 3 | 4): {
	start: number;
	end: number;
} {
	const start = (q - 1) * 3 + 1;
	return { start, end: start + 2 };
}

export function sumSafe(nums: number[]): number {
	return nums.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
}
