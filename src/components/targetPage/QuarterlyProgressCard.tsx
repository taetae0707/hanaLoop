"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Save } from "lucide-react";
import { QuarterlyTarget } from "@/types/target-types";

interface QuarterlyProgressCardProps {
	quarterlyTarget: QuarterlyTarget;
	budgetUsageRate: number;
	isOverBudget: boolean;
	remaining: number;
	onUpdateBudget: (budget: number) => void;
}

export function QuarterlyProgressCard({
	quarterlyTarget,
	budgetUsageRate,
	isOverBudget,
	remaining,
	onUpdateBudget,
}: QuarterlyProgressCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editBudget, setEditBudget] = useState(quarterlyTarget.budget);

	const handleSave = () => {
		onUpdateBudget(editBudget);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditBudget(quarterlyTarget.budget);
		setIsEditing(false);
	};

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
				{!isEditing ? (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setIsEditing(true)}>
						<Edit3 className="h-3 w-3" />
					</Button>
				) : (
					<div className="flex space-x-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={handleCancel}>
							취소
						</Button>
						<Button
							size="sm"
							onClick={handleSave}>
							<Save className="h-3 w-3" />
						</Button>
					</div>
				)}
			</div>
			<div className="p-4 space-y-3">
				<div>
					<p className="text-xs text-gray-500">분기 예산</p>
					{isEditing ? (
						<input
							type="number"
							step="0.1"
							value={editBudget}
							onChange={(e) => setEditBudget(parseFloat(e.target.value) || 0)}
							className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
					) : (
						<p className="text-lg font-bold text-gray-900">
							{quarterlyTarget.budget.toFixed(1)} tCO₂e
						</p>
					)}
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
