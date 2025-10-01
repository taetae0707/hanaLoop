"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmissionSummary, CompanyEmissionSummary } from "@/types";
import { formatNumber } from "@/lib/utils";
import {
	TrendingUp,
	TrendingDown,
	AlertTriangle,
	Building2,
	DollarSign,
	Target,
} from "lucide-react";

interface ExecutiveSummaryProps {
	summary: EmissionSummary;
	companies: CompanyEmissionSummary[];
	carbonTaxRate: number;
}

export function ExecutiveSummary({
	summary,
	companies,
	carbonTaxRate = 25, // $25/tCO2 기본값
}: ExecutiveSummaryProps) {
	const highRiskCompanies = companies.filter(
		(c) => c.riskLevel === "high"
	).length;
	const totalTaxLiability = summary.totalEmissions * carbonTaxRate;
	const potentialSavings =
		(summary.totalEmissions - summary.targetEmissions) * carbonTaxRate;
	const averageMonthlyChange =
		companies.reduce((sum, c) => sum + c.monthlyChange, 0) / companies.length;

	const getSummaryIcon = (value: number, isGood: boolean) => {
		if (value === 0) return <TrendingDown className="h-4 w-4 text-gray-500" />;
		if (isGood) {
			return value > 0 ? (
				<TrendingUp className="h-4 w-4 text-green-500" />
			) : (
				<TrendingDown className="h-4 w-4 text-red-500" />
			);
		} else {
			return value > 0 ? (
				<TrendingUp className="h-4 w-4 text-red-500" />
			) : (
				<TrendingDown className="h-4 w-4 text-green-500" />
			);
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{/* 총 배출량 */}
			<Card className="border-l-4 border-l-blue-500">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">
						총 배출량 (전체)
					</CardTitle>
					<Building2 className="h-4 w-4 text-blue-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-gray-900">
						{formatNumber(summary.totalEmissions)}
					</div>
					<div className="text-xs text-gray-500">tCO₂eq</div>
					<div className="flex items-center space-x-1 mt-2">
						{getSummaryIcon(averageMonthlyChange, false)}
						<span className="text-xs text-gray-600">
							평균 {Math.abs(averageMonthlyChange).toFixed(1)}% 변화
						</span>
					</div>
				</CardContent>
			</Card>

			{/* 탄소세 부담 */}
			<Card className="border-l-4 border-l-red-500">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">
						연간 탄소세 부담
					</CardTitle>
					<DollarSign className="h-4 w-4 text-red-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-red-600">
						₩{formatNumber((totalTaxLiability * 1300) / 10000, 0)}
					</div>
					<div className="text-xs text-gray-500">
						억원 (${carbonTaxRate}/tCO₂)
					</div>
					<div className="text-xs text-gray-600 mt-2">
						월 평균 ₩{formatNumber((totalTaxLiability * 1300) / 120000, 1)}억원
					</div>
				</CardContent>
			</Card>

			{/* 절약 가능 금액 */}
			<Card className="border-l-4 border-l-green-500">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">
						목표 달성시 절약
					</CardTitle>
					<Target className="h-4 w-4 text-green-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">
						₩{formatNumber((potentialSavings * 1300) / 10000, 1)}
					</div>
					<div className="text-xs text-gray-500">억원</div>
					<div className="text-xs text-gray-600 mt-2">
						{((potentialSavings / totalTaxLiability) * 100).toFixed(1)}% 절약
						가능
					</div>
				</CardContent>
			</Card>

			{/* 고위험 회사 수 */}
			<Card className="border-l-4 border-l-amber-500">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-gray-600">
						주의 필요 회사
					</CardTitle>
					<AlertTriangle className="h-4 w-4 text-amber-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-amber-600">
						{highRiskCompanies}
					</div>
					<div className="text-xs text-gray-500">
						개 / 총 {companies.length}개
					</div>
					<div className="text-xs text-gray-600 mt-2">
						{((highRiskCompanies / companies.length) * 100).toFixed(0)}% 고위험
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
