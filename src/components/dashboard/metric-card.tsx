"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
	title: string;
	value: number;
	unit: string;
	change?: number;
	changeType?: "increase" | "decrease" | "neutral";
	target?: number;
	icon?: React.ReactNode;
	className?: string;
}

export function MetricCard({
	title,
	value,
	unit,
	change,
	changeType = "neutral",
	target,
	icon,
	className,
}: MetricCardProps) {
	const getTrendIcon = () => {
		switch (changeType) {
			case "increase":
				return <TrendingUp className="h-4 w-4 text-red-500" />;
			case "decrease":
				return <TrendingDown className="h-4 w-4 text-green-500" />;
			default:
				return <Minus className="h-4 w-4 text-gray-500" />;
		}
	};

	const getTrendColor = () => {
		switch (changeType) {
			case "increase":
				return "text-red-600";
			case "decrease":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	const achievementRate = target ? (value / target) * 100 : null;

	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-gray-600">
					{title}
				</CardTitle>
				{icon && <div className="text-gray-400">{icon}</div>}
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{/* Main value */}
					<div className="flex items-baseline space-x-2">
						<div className="text-2xl font-bold text-gray-900">
							{formatNumber(value)}
						</div>
						<div className="text-sm text-gray-500">{unit}</div>
					</div>

					{/* Change indicator */}
					{change !== undefined && (
						<div className="flex items-center space-x-1">
							{getTrendIcon()}
							<span className={`text-sm font-medium ${getTrendColor()}`}>
								{Math.abs(change) > 0
									? formatPercentage(Math.abs(change))
									: "0%"}
							</span>
							<span className="text-sm text-gray-500">전월 대비</span>
						</div>
					)}

					{/* Target progress */}
					{target && (
						<div className="space-y-1">
							<div className="flex justify-between text-xs text-gray-500">
								<span>목표 대비</span>
								<span>{formatPercentage(achievementRate || 0)}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full ${
										(achievementRate || 0) <= 100
											? "bg-green-500"
											: "bg-red-500"
									}`}
									style={{ width: `${Math.min(achievementRate || 0, 100)}%` }}
								/>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
