"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { QuarterlyProgressCard } from "./QuarterlyProgressCard";
import { useQuarterlyProgress } from "@/hooks/useQuarterlyProgress";
import { QuarterlyTarget } from "@/types/target-types";

interface TargetManagementSectionProps {
	companyId: string;
	year: number;
	mergedQuarterlyTargets?: QuarterlyTarget[];
}

export function TargetManagementSection({
	companyId,
	year,
	mergedQuarterlyTargets,
}: TargetManagementSectionProps) {
	// 분기별 Hook (mergedQuarterlyTargets가 있으면 우선 사용)
	const q1Progress = useQuarterlyProgress(companyId, year, 1);
	const q2Progress = useQuarterlyProgress(companyId, year, 2);
	const q3Progress = useQuarterlyProgress(companyId, year, 3);
	const q4Progress = useQuarterlyProgress(companyId, year, 4);

	// mergedQuarterlyTargets가 있으면 해당 데이터 사용, 없으면 기본 Hook 사용
	const getQuarterlyTarget = (quarter: 1 | 2 | 3 | 4) => {
		if (mergedQuarterlyTargets) {
			return mergedQuarterlyTargets.find((qt) => qt.quarter === quarter);
		}
		return quarter === 1
			? q1Progress.quarterlyTarget
			: quarter === 2
			? q2Progress.quarterlyTarget
			: quarter === 3
			? q3Progress.quarterlyTarget
			: q4Progress.quarterlyTarget;
	};

	// mergedQuarterlyTargets가 있을 때 올바른 remaining 계산
	const getRemaining = (quarter: 1 | 2 | 3 | 4) => {
		const target = getQuarterlyTarget(quarter);
		if (target) {
			return target.budget - target.actual;
		}
		// fallback to hook values
		return quarter === 1
			? q1Progress.remaining
			: quarter === 2
			? q2Progress.remaining
			: quarter === 3
			? q3Progress.remaining
			: q4Progress.remaining;
	};

	return (
		<Card className="overflow-hidden">
			<div className="p-6 space-y-6">
				{/* 분기별 진행 현황 */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						분기별 진행 현황
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{getQuarterlyTarget(1) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(1)!}
								budgetUsageRate={q1Progress.budgetUsageRate}
								isOverBudget={q1Progress.isOverBudget}
								remaining={getRemaining(1)}
								onUpdateBudget={q1Progress.updateBudget}
							/>
						)}
						{getQuarterlyTarget(2) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(2)!}
								budgetUsageRate={q2Progress.budgetUsageRate}
								isOverBudget={q2Progress.isOverBudget}
								remaining={getRemaining(2)}
								onUpdateBudget={q2Progress.updateBudget}
							/>
						)}
						{getQuarterlyTarget(3) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(3)!}
								budgetUsageRate={q3Progress.budgetUsageRate}
								isOverBudget={q3Progress.isOverBudget}
								remaining={getRemaining(3)}
								onUpdateBudget={q3Progress.updateBudget}
							/>
						)}
						{getQuarterlyTarget(4) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(4)!}
								budgetUsageRate={q4Progress.budgetUsageRate}
								isOverBudget={q4Progress.isOverBudget}
								remaining={getRemaining(4)}
								onUpdateBudget={q4Progress.updateBudget}
							/>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
