"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { AnnualTargetCard } from "./AnnualTargetCard";
import { QuarterlyProgressCard } from "./QuarterlyProgressCard";
import { YTDDashboard } from "./YTDDashboard";
import { AnnualTarget, AllocationMethod } from "@/types/target-types";
import { useQuarterlyProgress } from "@/hooks/useQuarterlyProgress";

interface TargetManagementSectionProps {
	companyId: string;
	year: number;
	annualTarget: AnnualTarget;
	ytdActual: number;
	ytdBudget: number;
	ytdVariance: number;
	achievementRate: number;
	currentMonth: number;
	onSaveTarget: (totalBudget: number, method: AllocationMethod) => void;
}

export function TargetManagementSection({
	companyId,
	year,
	annualTarget,
	ytdActual,
	ytdBudget,
	ytdVariance,
	achievementRate,
	currentMonth,
	onSaveTarget,
}: TargetManagementSectionProps) {
	// 분기별 Hook
	const q1Progress = useQuarterlyProgress(companyId, year, 1);
	const q2Progress = useQuarterlyProgress(companyId, year, 2);
	const q3Progress = useQuarterlyProgress(companyId, year, 3);
	const q4Progress = useQuarterlyProgress(companyId, year, 4);

	return (
		<Card className="overflow-hidden">
			<div className="p-6 space-y-6">
				{/* 연간 목표 설정 */}
				<AnnualTargetCard
					year={year}
					totalBudget={annualTarget.totalBudget}
					allocationMethod={annualTarget.allocationMethod}
					ytdActual={ytdActual}
					onSave={onSaveTarget}
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
								budgetUsageRate={q1Progress.budgetUsageRate}
								isOverBudget={q1Progress.isOverBudget}
								onUpdateBudget={q1Progress.updateBudget}
							/>
						)}
						{q2Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q2Progress.quarterlyTarget}
								budgetUsageRate={q2Progress.budgetUsageRate}
								isOverBudget={q2Progress.isOverBudget}
								onUpdateBudget={q2Progress.updateBudget}
							/>
						)}
						{q3Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q3Progress.quarterlyTarget}
								budgetUsageRate={q3Progress.budgetUsageRate}
								isOverBudget={q3Progress.isOverBudget}
								onUpdateBudget={q3Progress.updateBudget}
							/>
						)}
						{q4Progress.quarterlyTarget && (
							<QuarterlyProgressCard
								quarterlyTarget={q4Progress.quarterlyTarget}
								budgetUsageRate={q4Progress.budgetUsageRate}
								isOverBudget={q4Progress.isOverBudget}
								onUpdateBudget={q4Progress.updateBudget}
							/>
						)}
					</div>
				</div>

				{/* YTD 누적 현황 */}
				<YTDDashboard
					ytdActual={ytdActual}
					ytdBudget={ytdBudget}
					ytdVariance={ytdVariance}
					achievementRate={achievementRate}
					currentMonth={currentMonth}
				/>
			</div>
		</Card>
	);
}
