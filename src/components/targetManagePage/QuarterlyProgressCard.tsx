"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { QuarterlyTarget } from "@/types/target-types";

interface QuarterlyProgressCardProps {
	quarterlyTarget: QuarterlyTarget;
	budgetUsageRate: number;
	isOverBudget: boolean;
	remaining: number;
}

export function QuarterlyProgressCard({
	quarterlyTarget,
	budgetUsageRate,
	isOverBudget,
	remaining,
}: QuarterlyProgressCardProps) {
	const getUsageColor = () => {
		if (budgetUsageRate >= 100) return "bg-red-500"; // 100% 이상
		if (budgetUsageRate >= 90) return "bg-yellow-500"; // 90% 이상
		return "bg-green-500"; // 90% 미만
	};

	return (
		<Card className="overflow-hidden border-2 border-gray-200">
			<div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
				<h4 className="font-medium text-gray-900">
					Q{quarterlyTarget.quarter}
				</h4>
			</div>
			<div className="p-4 space-y-3">
				<div>
					<p className="text-xs text-gray-500">분기 예산</p>
					<p className="text-lg font-bold text-gray-900">
						{quarterlyTarget.budget.toFixed(1)} tCO₂e
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">실제 배출량</p>
					<p className="text-lg font-semibold text-gray-700">
						{quarterlyTarget.actual.toFixed(1)} tCO₂e
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">남은 예산</p>
					<p
						className={`text-lg font-semibold ${
							remaining < 0 ? "text-red-600" : "text-green-600"
						}`}>
						{remaining >= 0 && "+"}
						{remaining.toFixed(1)} tCO₂e
					</p>
				</div>
				<div>
					<div className="flex justify-between text-xs text-gray-600 mb-1">
						<span>예산 사용률</span>
						<span
							className={`font-medium ${
								budgetUsageRate >= 100
									? "text-red-600"
									: budgetUsageRate >= 90
									? "text-yellow-600"
									: "text-gray-600"
							}`}>
							{budgetUsageRate.toFixed(1)}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all duration-300 ${getUsageColor()}`}
							style={{
								width: `${Math.min(budgetUsageRate, 100)}%`,
							}}></div>
					</div>
				</div>
			</div>
		</Card>
	);
}
