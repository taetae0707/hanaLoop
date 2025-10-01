"use client";

import React, { useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { AnnualTargetCard } from "@/components/targetPage/AnnualTargetCard";
import { QuarterlyProgressCard } from "@/components/targetPage/QuarterlyProgressCard";
import { YTDDashboard } from "@/components/targetPage/YTDDashboard";
import { MonthlyEmissionTable } from "@/components/targetPage/MonthlyEmissionTable";
import { AnnualTrendChart } from "@/components/charts/AnnualTrendChart";
import { QuarterlyComparisonChart } from "@/components/charts/QuarterlyComparisonChart";
import { useAnnualTarget } from "@/hooks/useAnnualTarget";
import { useQuarterlyProgress } from "@/hooks/useQuarterlyProgress";
import { useMonthlyEmission } from "@/hooks/useMonthlyEmission";
import { useTargetStore } from "@/store/targetStore";
import { AllocationMethod } from "@/types/target-types";
import { dummyCompanyTargets } from "@/lib/data";

export default function TargetsPage() {
	// 기본 회사 ID (나중에 사용자 선택 또는 로그인 정보에서 가져올 수 있음)
	const companyId = "c1";
	const year = 2025;
	const currentMonth = new Date().getMonth() + 1; // 1-12

	const store = useTargetStore();
	const { annualTarget, setTarget, ytd, achievementRate } = useAnnualTarget(
		companyId,
		year
	);
	const { monthlyEmissions, recordEmission } = useMonthlyEmission(
		companyId,
		year
	);

	// 분기별 Hook (useMemo로 최적화)
	const q1Progress = useQuarterlyProgress(companyId, year, 1);
	const q2Progress = useQuarterlyProgress(companyId, year, 2);
	const q3Progress = useQuarterlyProgress(companyId, year, 3);
	const q4Progress = useQuarterlyProgress(companyId, year, 4);

	// 계절 가중치를 적용한 분기 목표 (useMemo로 관리)
	const seasonalQuarterlyTargets = useMemo(() => {
		if (!annualTarget) return null;
		return annualTarget.quarterlyTargets;
	}, [annualTarget]);

	// 초기 데이터 로딩
	useEffect(() => {
		const dummyCompany = dummyCompanyTargets.find(
			(c) => c.companyId === companyId
		);
		if (!dummyCompany || dummyCompany.targets.length === 0) return;

		const dummyTarget = dummyCompany.targets[0];

		// 스토어에 데이터가 없거나, 월별 실적이 모두 0인 경우 더미 데이터 로드
		const needsLoad =
			!annualTarget ||
			annualTarget.monthlyEmissions.every((me) => me.actual === 0);

		if (needsLoad) {
			console.log("Loading dummy data with actual emissions...");
			// 더미 데이터를 직접 로드 (actual 값 포함)
			store.loadAnnualTarget(companyId, dummyTarget);
		}
	}, [annualTarget, companyId, year, store]);

	// YTD 재계산
	useEffect(() => {
		if (annualTarget) {
			store.recalculateYTD(companyId, year, currentMonth);
		}
	}, [annualTarget, companyId, year, currentMonth, store]);

	const handleSaveTarget = (totalBudget: number, method: AllocationMethod) => {
		setTarget(totalBudget, method);
	};

	const handleRecordEmission = (month: number, actual: number) => {
		recordEmission(month, actual);
	};

	// 개발용: 스토어 초기화 및 더미 데이터 다시 로드
	const handleResetData = () => {
		const dummyCompany = dummyCompanyTargets.find(
			(c) => c.companyId === companyId
		);
		if (dummyCompany && dummyCompany.targets.length > 0) {
			const target = dummyCompany.targets[0];
			store.loadAnnualTarget(companyId, target);
			console.log("Data reset and reloaded!");
		}
	};

	if (!annualTarget) {
		return (
			<LoadingState
				message="목표 데이터를 불러오는 중..."
				fullScreen
			/>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<PageHeader
						title="목표 달성 현황"
						description="연간 배출량 목표를 설정하고 달성 현황을 모니터링합니다"
					/>
					{/* 개발용 초기화 버튼 */}
					<button
						onClick={handleResetData}
						className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
						title="더미 데이터 다시 로드">
						🔄 데이터 초기화
					</button>
				</div>

				{/* 연간 목표 설정 */}
				<AnnualTargetCard
					year={year}
					totalBudget={annualTarget.totalBudget}
					allocationMethod={annualTarget.allocationMethod}
					ytdActual={ytd?.actual || 0}
					onSave={handleSaveTarget}
				/>

				{/* 분기별 진행 현황 */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						분기별 진행 현황
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{q1Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q1Progress.quarterlyTarget}
								progressRate={q1Progress.progressRate}
								isOverBudget={q1Progress.isOverBudget}
								onUpdateBudget={q1Progress.updateBudget}
							/>
						)}
						{q2Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q2Progress.quarterlyTarget}
								progressRate={q2Progress.progressRate}
								isOverBudget={q2Progress.isOverBudget}
								onUpdateBudget={q2Progress.updateBudget}
							/>
						)}
						{q3Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q3Progress.quarterlyTarget}
								progressRate={q3Progress.progressRate}
								isOverBudget={q3Progress.isOverBudget}
								onUpdateBudget={q3Progress.updateBudget}
							/>
						)}
						{q4Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q4Progress.quarterlyTarget}
								progressRate={q4Progress.progressRate}
								isOverBudget={q4Progress.isOverBudget}
								onUpdateBudget={q4Progress.updateBudget}
							/>
						)}
					</div>
				</div>

				{/* YTD 누적 현황 */}
				{ytd && (
					<YTDDashboard
						ytdActual={ytd.actual}
						ytdBudget={ytd.budget}
						ytdVariance={ytd.variance}
						achievementRate={achievementRate}
						currentMonth={currentMonth}
					/>
				)}

				{/* 차트 섹션 */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<AnnualTrendChart monthlyEmissions={monthlyEmissions} />
					{seasonalQuarterlyTargets && (
						<QuarterlyComparisonChart
							quarterlyTargets={seasonalQuarterlyTargets}
						/>
					)}
				</div>

				{/* 월별 배출 실적 테이블 */}
				<MonthlyEmissionTable
					monthlyEmissions={monthlyEmissions}
					onRecordEmission={handleRecordEmission}
				/>
			</div>
		</Layout>
	);
}
