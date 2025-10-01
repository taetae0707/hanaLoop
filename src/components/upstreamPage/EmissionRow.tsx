"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useEmissionCompare } from "@/hooks/useEmissionCompare";

interface EmissionRowProps {
	priorityText: string;
	priorityColor: "red" | "orange" | "yellow" | "green";
	icon: LucideIcon;
	title: string;
	currentMonthData: React.ReactNode;
	previousMonthData?: React.ReactNode;
	targetEmission?: number;
	currentMonthValues?: { [key: string]: string | number };
	previousMonthValues?: { [key: string]: string | number };
}

export function EmissionRow({
	priorityText,
	priorityColor,
	icon: Icon,
	title,
	currentMonthData,
	previousMonthData,
	targetEmission,
	currentMonthValues,
	previousMonthValues,
}: EmissionRowProps) {
	const getPriorityStyles = (color: string) => {
		switch (color) {
			case "red":
				return "bg-red-100 text-red-800";
			case "orange":
				return "bg-orange-100 text-orange-800";
			case "yellow":
				return "bg-yellow-100 text-yellow-800";
			case "green":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// 커스텀 훅을 사용하여 배출량 비교 데이터 계산
	const emissionCompare = useEmissionCompare({
		currentMonthValues,
		previousMonthValues,
	});

	return (
		<tr>
			<td className="px-6 py-4 whitespace-nowrap">
				<span
					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(
						priorityColor
					)}`}>
					{priorityText}
				</span>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center">
					<Icon className="h-5 w-5 text-gray-400 mr-2" />
					<span className="text-sm font-medium text-gray-900">{title}</span>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="text-sm text-gray-900">
					<div className="space-y-1">
						{previousMonthData || (
							<div className="text-gray-400 text-sm">데이터 없음</div>
						)}
					</div>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="text-sm text-gray-900">
					<div className="space-y-1">{currentMonthData}</div>
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="text-sm text-gray-900">
					{emissionCompare ? (
						<div
							className={`flex items-center space-x-1 ${
								emissionCompare.isIncrease ? "text-red-600" : "text-green-600"
							}`}>
							{emissionCompare.isIncrease ? (
								<TrendingUp className="h-4 w-4" />
							) : (
								<TrendingDown className="h-4 w-4" />
							)}
							<span className="font-semibold">
								{emissionCompare.isIncrease ? "+" : "-"}
								{emissionCompare.percent.toFixed(1)}%
							</span>
						</div>
					) : (
						<div className="text-gray-400 text-sm">비교 불가</div>
					)}
				</div>
			</td>
			<td className="px-6 py-4">
				<div className="text-sm text-gray-900">
					{targetEmission !== undefined ? (
						<div className="text-sm font-semibold text-gray-900">
							{targetEmission.toFixed(1)} tCO2e
						</div>
					) : (
						<div className="text-gray-400 text-sm">목표 없음</div>
					)}
				</div>
			</td>
		</tr>
	);
}
