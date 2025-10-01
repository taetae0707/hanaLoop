"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { QuarterlyTarget } from "@/types/target-types";

interface QuarterlyComparisonChartProps {
	quarterlyTargets: QuarterlyTarget[];
}

export function QuarterlyComparisonChart({
	quarterlyTargets,
}: QuarterlyComparisonChartProps) {
	const chartData = useMemo(() => {
		return quarterlyTargets.map((qt) => ({
			quarter: `Q${qt.quarter}`,
			예산: Math.round(qt.budget * 10) / 10,
			실제: Math.round(qt.actual * 10) / 10,
		}));
	}, [quarterlyTargets]);

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900">분기별 비교</h3>
				<p className="text-sm text-gray-500">
					분기별 예산 배출량과 실제 배출량을 비교합니다
				</p>
			</div>
			<div className="p-6">
				<ResponsiveContainer
					width="100%"
					height={350}>
					<BarChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="quarter" />
						<YAxis
							label={{ value: "tCO₂e", angle: -90, position: "insideLeft" }}
						/>
						<Tooltip />
						<Legend />
						<Bar
							dataKey="예산"
							fill="#9333EA"
							radius={[8, 8, 0, 0]}
						/>
						<Bar
							dataKey="실제"
							fill="#3B82F6"
							radius={[8, 8, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
