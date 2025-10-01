"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { AllocationMethod } from "@/types/target-types";
import {
	calculateRemainingBudget,
	calculateAnnualGoal,
	getAllocationMethodText,
	getAllocationMethodDescription,
} from "@/utils/targetCalculations";

interface AnnualTargetCardProps {
	year: number;
	totalBudget: number;
	allocationMethod: AllocationMethod;
	ytdActual: number;
}

export function AnnualTargetCard({
	year,
	totalBudget,
	allocationMethod,
	ytdActual,
}: AnnualTargetCardProps) {
	// 남은 예산 계산
	const remainingBudget = calculateRemainingBudget(totalBudget, ytdActual);
	// 연간 목표 (현재배출 + 남은예산)
	const annualGoal = calculateAnnualGoal(ytdActual, remainingBudget);

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<div>
					<h3 className="text-xl font-medium text-gray-900">
						{year}년 탄소 배출량 목표
					</h3>
					<p className="text-sm text-gray-500">
						연간 총 배출량 목표와 분기별 배분 방식을 설정합니다
					</p>
				</div>
			</div>
			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* 연간목표 */}
					<div className="border border-gray-200 rounded-lg p-4">
						<div className="text-sm text-gray-500 mb-1">연간목표</div>
						<div className="text-2xl font-semibold text-gray-900">
							{annualGoal.toLocaleString()}
						</div>
						<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
					</div>

					{/* 현재배출 */}
					<div className="border border-gray-200 rounded-lg p-4">
						<div className="text-sm text-gray-500 mb-1">현재배출</div>
						<div className="text-2xl font-semibold text-gray-900">
							{ytdActual.toLocaleString()}
						</div>
						<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
					</div>

					{/* 남은예산 */}
					<div className="border border-gray-200 rounded-lg p-4">
						<div className="text-sm text-gray-500 mb-1">남은예산</div>
						<div className="text-2xl font-semibold text-gray-900">
							{remainingBudget.toLocaleString()}
						</div>
						<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
					</div>

					{/* 배분방식 */}
					<div className="border border-gray-200 rounded-lg p-4 bg-green-50">
						<div className="text-sm text-gray-500 mb-1">배분방식</div>
						<div className="text-lg font-semibold text-gray-900">
							{getAllocationMethodText(allocationMethod)}
						</div>
						<div className="text-xs text-gray-500 mt-1">
							{getAllocationMethodDescription(allocationMethod)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
