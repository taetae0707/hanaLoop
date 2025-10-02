"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface TargetProgressChartProps {
	achievementRate: number;
	isDanger: boolean;
	isWarning: boolean;
	isOverTarget: boolean;
	currentEmissions: number;
	targetEmissions: number;
	targetSavings: number;
}

export function TargetProgressChart({
	achievementRate,
	isDanger,
	isWarning,
	isOverTarget,
	currentEmissions,
	targetEmissions,
	targetSavings,
}: TargetProgressChartProps) {
	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900">목표 달성 현황</h3>
				<p className="text-sm text-gray-500">현재 배출량과 목표 배출량 비교</p>
			</div>
			<div className="p-6">
				<div className="space-y-4">
					{/* 진행률 바 */}
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>목표 달성률</span>
							<span>{achievementRate.toFixed(1)}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3">
							<div
								className={`h-3 rounded-full transition-all duration-300 ${
									isDanger
										? "bg-red-500"
										: isWarning
										? "bg-yellow-500"
										: "bg-green-500"
								}`}
								style={{
									width: `${Math.min(achievementRate, 200)}%`,
								}}></div>
						</div>
					</div>

					{/* 상세 정보 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
						<div>
							<p className="text-sm text-gray-500">현재 배출량</p>
							<p className="text-lg font-semibold text-gray-900">
								{currentEmissions.toFixed(1)} tCO2e
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">목표 배출량</p>
							<p className="text-lg font-semibold text-gray-900">
								{targetEmissions.toFixed(1)} tCO2e
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">차이</p>
							<p
								className={`text-lg font-semibold ${
									isOverTarget ? "text-red-600" : "text-green-600"
								}`}>
								{isOverTarget ? "+" : "-"}
								{Math.abs(currentEmissions - targetEmissions).toFixed(1)} tCO2e
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-500">예상 저축</p>
							<p className="text-lg font-semibold text-gray-900">
								{targetSavings.toFixed(1)} tCO2e
							</p>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
