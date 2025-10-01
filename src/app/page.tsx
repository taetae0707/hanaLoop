"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { CarbonTaxCard } from "@/components/dashboard/carbon-tax-card";
import { SubsidiaryEmissionsChart } from "@/components/charts/subsidiary-emissions-chart";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { ScopeDonutChart } from "@/components/charts/scope-donut-chart";
import { CompanyTable } from "@/components/dashboard/company-table";
import {
	fetchEmissionSummary,
	fetchMonthlyTrends,
	fetchCompanyEmissionSummaries,
	fetchCompanies,
} from "@/lib/api";
import {
	EmissionSummary,
	MonthlyTrend,
	CompanyEmissionSummary,
	Company,
} from "@/types";
import { AlertTriangle, TrendingUp, Calculator } from "lucide-react";

export default function Dashboard() {
	const [summary, setSummary] = useState<EmissionSummary | null>(null);
	const [trends, setTrends] = useState<MonthlyTrend[]>([]);
	const [companySummaries, setCompanySummaries] = useState<
		CompanyEmissionSummary[]
	>([]);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 탄소세 관련 상수
	const CARBON_TAX_RATE = 25; // $25/tCO2
	const TARGET_REDUCTION = 15; // 15% 감축 목표

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [summaryData, trendsData, companySummariesData, companiesData] =
					await Promise.all([
						fetchEmissionSummary(),
						fetchMonthlyTrends(),
						fetchCompanyEmissionSummaries(),
						fetchCompanies(),
					]);

				setSummary(summaryData);
				setTrends(trendsData);
				setCompanySummaries(companySummariesData);
				setCompanies(companiesData);
			} catch (err) {
				setError("데이터를 불러오는 중 오류가 발생했습니다.");
				console.error("Error loading dashboard data:", err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	if (loading) {
		return (
			<Layout>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="flex items-center space-x-2">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<span className="text-gray-600">데이터를 불러오는 중...</span>
					</div>
				</div>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							오류가 발생했습니다
						</h3>
						<p className="text-gray-600">{error}</p>
					</div>
				</div>
			</Layout>
		);
	}

	if (!summary) return null;

	// 탄소세 계산
	const currentYearTax = summary.totalEmissions * CARBON_TAX_RATE;
	const nextYearProjectedEmissions = summary.totalEmissions * 1.05; // 5% 증가 가정
	const nextYearTax = nextYearProjectedEmissions * CARBON_TAX_RATE * 1.1; // 탄소세율 10% 인상 가정
	const potentialSavings =
		((summary.totalEmissions * TARGET_REDUCTION) / 100) * CARBON_TAX_RATE;

	return (
		<Layout>
			<div className="space-y-6">
				{/* Page Header - 임원 중심 */}
				<div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 md:p-6 text-white">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
						<div>
							<h1 className="text-xl md:text-2xl font-bold mb-2">
								탄소 경영 대시보드
							</h1>
							<p className="text-slate-300 text-sm md:text-base">
								자회사/관계사 탄소 배출량 통합 관리 • 탄소세 영향 분석
							</p>
						</div>
						<div className="text-left md:text-right">
							<div className="text-2xl md:text-3xl font-bold">
								₩{((nextYearTax * 1300) / 100000000).toFixed(0)}억
							</div>
							<div className="text-sm text-slate-300">2025년 예상 탄소세</div>
						</div>
					</div>
				</div>

				{/* Executive Summary - 임원용 핵심 지표 */}
				<ExecutiveSummary
					summary={summary}
					companies={companySummaries}
					carbonTaxRate={CARBON_TAX_RATE}
				/>

				{/* 탄소세 영향 분석 카드 */}
				<CarbonTaxCard
					totalEmissions={summary.totalEmissions}
					carbonTaxRate={CARBON_TAX_RATE}
					projectedTax={nextYearTax}
					targetReduction={TARGET_REDUCTION}
					potentialSavings={potentialSavings}
				/>

				{/* 자회사/관계사별 배출량 분석 */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					{/* 월별 추이 - 더 넓은 영역 */}
					<div className="xl:col-span-2">
						<MonthlyTrendChart
							data={trends}
							title="월별 배출량 추이 및 탄소세 영향"
						/>
					</div>

					{/* 스코프별 비율 */}
					<div className="xl:col-span-1">
						<ScopeDonutChart data={summary} />
					</div>
				</div>

				{/* 자회사별 상세 분석 */}
				<SubsidiaryEmissionsChart companies={companies} />

				{/* 회사별 리스크 관리 테이블 */}
				<CompanyTable
					data={companySummaries}
					title="자회사/관계사 배출량 및 리스크 현황"
				/>

				{/* 경영진 액션 아이템 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
						<div className="flex items-center space-x-2 mb-4">
							<AlertTriangle className="h-5 w-5 text-red-600" />
							<h3 className="font-semibold text-red-900">즉시 조치 필요</h3>
						</div>
						<p className="text-2xl font-bold text-red-600 mb-2">
							{companySummaries.filter((c) => c.riskLevel === "high").length}개
							회사
						</p>
						<p className="text-sm text-red-700">
							배출량 급증으로 탄소세 부담 증가
						</p>
					</div>

					<div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
						<div className="flex items-center space-x-2 mb-4">
							<Calculator className="h-5 w-5 text-green-600" />
							<h3 className="font-semibold text-green-900">절약 기회</h3>
						</div>
						<p className="text-2xl font-bold text-green-600 mb-2">
							₩{((potentialSavings * 1300) / 100000000).toFixed(1)}억원
						</p>
						<p className="text-sm text-green-700">
							{TARGET_REDUCTION}% 감축 달성시 연간 절약
						</p>
					</div>

					<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
						<div className="flex items-center space-x-2 mb-4">
							<TrendingUp className="h-5 w-5 text-blue-600" />
							<h3 className="font-semibold text-blue-900">투자 권고</h3>
						</div>
						<p className="text-2xl font-bold text-blue-600 mb-2">
							₩{((potentialSavings * 0.3 * 1300) / 100000000).toFixed(1)}억원
						</p>
						<p className="text-sm text-blue-700">감축 기술 투자 권장 규모</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}
