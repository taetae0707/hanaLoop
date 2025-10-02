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

	// mergedQuarterlyTargets가 있을 때 올바른 budgetUsageRate 계산
	const getBudgetUsageRate = (quarter: 1 | 2 | 3 | 4) => {
		const target = getQuarterlyTarget(quarter);
		if (target && target.budget > 0) {
			return (target.actual / target.budget) * 100;
		}
		// fallback to hook values
		return quarter === 1
			? q1Progress.budgetUsageRate
			: quarter === 2
			? q2Progress.budgetUsageRate
			: quarter === 3
			? q3Progress.budgetUsageRate
			: q4Progress.budgetUsageRate;
	};

	// mergedQuarterlyTargets가 있을 때 올바른 isOverBudget 계산
	const getIsOverBudget = (quarter: 1 | 2 | 3 | 4) => {
		const target = getQuarterlyTarget(quarter);
		if (target) {
			return target.actual > target.budget;
		}
		// fallback to hook values
		return quarter === 1
			? q1Progress.isOverBudget
			: quarter === 2
			? q2Progress.isOverBudget
			: quarter === 3
			? q3Progress.isOverBudget
			: q4Progress.isOverBudget;
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
								budgetUsageRate={getBudgetUsageRate(1)}
								isOverBudget={getIsOverBudget(1)}
								remaining={getRemaining(1)}
							/>
						)}
						{getQuarterlyTarget(2) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(2)!}
								budgetUsageRate={getBudgetUsageRate(2)}
								isOverBudget={getIsOverBudget(2)}
								remaining={getRemaining(2)}
							/>
						)}
						{getQuarterlyTarget(3) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(3)!}
								budgetUsageRate={getBudgetUsageRate(3)}
								isOverBudget={getIsOverBudget(3)}
								remaining={getRemaining(3)}
							/>
						)}
						{getQuarterlyTarget(4) && (
							<QuarterlyProgressCard
								quarterlyTarget={getQuarterlyTarget(4)!}
								budgetUsageRate={getBudgetUsageRate(4)}
								isOverBudget={getIsOverBudget(4)}
								remaining={getRemaining(4)}
							/>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
