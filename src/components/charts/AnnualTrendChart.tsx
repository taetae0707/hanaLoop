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

interface AnnualTrendChartProps {
	monthlyEmissions: MonthlyEmission[];
}

export function AnnualTrendChart({ monthlyEmissions }: AnnualTrendChartProps) {
	const chartData = useMemo(() => {
		let cumulativeActual = 0;
		let cumulativeBudget = 0;

		return monthlyEmissions.map((me) => {
			cumulativeActual += me.actual;
			cumulativeBudget += me.budget;

			return {
				month: `${me.month}월`,
				실제배출량: Math.round(me.actual * 10) / 10,
				예산배출량: Math.round(me.budget * 10) / 10,
				누적실제: Math.round(cumulativeActual * 10) / 10,
				누적예산: Math.round(cumulativeBudget * 10) / 10,
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
				<ResponsiveContainer
					width="100%"
					height={400}>
					<LineChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis
							label={{ value: "tCO₂e", angle: -90, position: "insideLeft" }}
						/>
						<Tooltip />
						<Legend />
						<Line
							type="monotone"
							dataKey="예산배출량"
							stroke="#9333EA"
							strokeWidth={2}
							strokeDasharray="5 5"
							dot={{ r: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="실제배출량"
							stroke="#3B82F6"
							strokeWidth={2}
							dot={{ r: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="누적예산"
							stroke="#A78BFA"
							strokeWidth={2}
							strokeDasharray="3 3"
							dot={false}
						/>
						<Line
							type="monotone"
							dataKey="누적실제"
							stroke="#10B981"
							strokeWidth={3}
							dot={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
