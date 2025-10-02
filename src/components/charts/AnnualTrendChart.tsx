"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { MonthlyEmission } from "@/types/target-types";

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		const actualData = payload.find((p: any) => p.dataKey === "실제배출량");
		const budgetData = payload.find((p: any) => p.dataKey === "예산배출량");

		if (actualData && budgetData) {
			const actual = actualData.value;
			const budget = budgetData.value;
			const excess = actual > budget ? actual - budget : 0;

			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-900">{label}</p>
					<p className="text-sm text-gray-600">
						실제배출량: <span className="font-medium">{actual} tCO₂e</span>
					</p>
					<p className="text-sm text-gray-600">
						예산배출량: <span className="font-medium">{budget} tCO₂e</span>
					</p>
					{excess > 0 && (
						<p className="text-sm font-medium text-red-600">
							예산 초과량: {excess.toFixed(1)} tCO₂e
						</p>
					)}
				</div>
			);
		}
	}
	return null;
};

interface AnnualTrendChartProps {
	monthlyEmissions: MonthlyEmission[];
}

export function AnnualTrendChart({ monthlyEmissions }: AnnualTrendChartProps) {
	const chartData = useMemo(() => {
		return monthlyEmissions.map((me) => {
			return {
				month: `${me.month}월`,
				실제배출량: Math.round(me.actual * 10) / 10,
				예산배출량: Math.round(me.budget * 10) / 10,
			};
		});
	}, [monthlyEmissions]);

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900">연간 배출 추이</h3>
				<p className="text-sm text-gray-500">
					월별 실제 배출량과 예산 배출량의 추이를 비교합니다
				</p>
			</div>
			<div className="p-6">
				<div style={{ height: "30rem" }}>
					<ResponsiveContainer
						width="100%"
						height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis
								label={{ value: "tCO₂e", angle: -90, position: "insideLeft" }}
								domain={[0, 150]}
								tickCount={7}
								tick={{ fontSize: 12 }}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Line
								type="monotone"
								dataKey="예산배출량"
								stroke="#6B7280"
								strokeWidth={2}
								strokeDasharray="5 5"
								dot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="실제배출량"
								stroke="#10B981"
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Card>
	);
}
