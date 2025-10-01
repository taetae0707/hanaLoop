"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface YTDDashboardProps {
	ytdActual: number;
	ytdBudget: number;
	ytdVariance: number;
	achievementRate: number;
	currentMonth: number;
}

export function YTDDashboard({
	ytdActual,
	ytdBudget,
	ytdVariance,
	achievementRate,
	currentMonth,
}: YTDDashboardProps) {
	const isOverBudget = ytdVariance > 0;
	const isWarning = achievementRate > 90 && achievementRate < 110;
	const isDanger = achievementRate >= 110;

	const getStatusIcon = () => {
		if (isDanger) return <AlertCircle className="h-5 w-5 text-red-500" />;
		if (isWarning) return <TrendingUp className="h-5 w-5 text-yellow-500" />;
		return <TrendingDown className="h-5 w-5 text-green-500" />;
	};

	const getStatusText = () => {
		if (isDanger) return "목표 초과 - 주의 필요";
		if (isWarning) return "목표 근접 - 모니터링 필요";
		return "목표 달성 중";
	};

	const getStatusColor = () => {
		if (isDanger) return "bg-red-50 border-red-300";
		if (isWarning) return "bg-yellow-50 border-yellow-300";
		return "bg-green-50 border-green-300";
	};

	return (
		<Card className={`overflow-hidden border-2 ${getStatusColor()}`}>
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-medium text-gray-900">
							YTD 누적 현황 (1월~{currentMonth}월)
						</h3>
						<p className="text-sm text-gray-500">
							연초부터 현재까지 누적 배출량
						</p>
					</div>
					<div className="flex items-center space-x-2">
						{getStatusIcon()}
						<span
							className={`text-sm font-medium ${
								isDanger
									? "text-red-700"
									: isWarning
									? "text-yellow-700"
									: "text-green-700"
							}`}>
							{getStatusText()}
						</span>
					</div>
				</div>
			</div>
			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<div>
						<p className="text-sm text-gray-500 mb-1">실제 배출량</p>
						<p className="text-2xl font-bold text-gray-900">
							{ytdActual.toFixed(1)}
						</p>
						<p className="text-xs text-gray-500">tCO₂e</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">예산 배출량</p>
						<p className="text-2xl font-bold text-gray-900">
							{ytdBudget.toFixed(1)}
						</p>
						<p className="text-xs text-gray-500">tCO₂e</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">차이</p>
						<p
							className={`text-2xl font-bold ${
								isOverBudget ? "text-red-600" : "text-green-600"
							}`}>
							{isOverBudget ? "+" : ""}
							{ytdVariance.toFixed(1)}
						</p>
						<p className="text-xs text-gray-500">tCO₂e</p>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">달성률</p>
						<p
							className={`text-2xl font-bold ${
								isDanger
									? "text-red-600"
									: isWarning
									? "text-yellow-600"
									: "text-green-600"
							}`}>
							{achievementRate.toFixed(1)}%
						</p>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div
								className={`h-2 rounded-full transition-all duration-300 ${
									isDanger
										? "bg-red-500"
										: isWarning
										? "bg-yellow-500"
										: "bg-green-500"
								}`}
								style={{
									width: `${Math.min(achievementRate, 125)}%`,
								}}></div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
