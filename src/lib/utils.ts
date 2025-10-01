import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// 숫자 포맷팅 유틸리티
export function formatNumber(num: number, decimals: number = 1): string {
	return new Intl.NumberFormat("ko-KR", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	}).format(num);
}

// 큰 숫자 포맷팅 (K, M 단위)
export function formatLargeNumber(num: number): string {
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toString();
}

// 퍼센트 포맷팅
export function formatPercentage(num: number): string {
	return `${num.toFixed(1)}%`;
}

// 날짜 포맷팅
export function formatYearMonth(yearMonth: string): string {
	const [year, month] = yearMonth.split("-");
	return `${year}년 ${parseInt(month)}월`;
}

// 색상 유틸리티
export function getScopeColor(scope: 1 | 2 | 3): string {
	switch (scope) {
		case 1:
			return "#ef4444"; // red-500
		case 2:
			return "#f59e0b"; // amber-500
		case 3:
			return "#10b981"; // emerald-500
		default:
			return "#6b7280"; // gray-500
	}
}

export function getRiskLevelColor(
	riskLevel: "low" | "medium" | "high"
): string {
	switch (riskLevel) {
		case "low":
			return "#10b981"; // emerald-500
		case "medium":
			return "#f59e0b"; // amber-500
		case "high":
			return "#ef4444"; // red-500
		default:
			return "#6b7280"; // gray-500
	}
}
