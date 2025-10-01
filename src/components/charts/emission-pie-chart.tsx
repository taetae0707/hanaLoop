"use client";

import React from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";
import { EmissionBySource } from "@/types";
import { getScopeColor, formatNumber } from "@/lib/utils";

interface EmissionPieChartProps {
	data: EmissionBySource[];
	title?: string;
}

export function EmissionPieChart({
	data,
	title = "배출원별 비율",
}: EmissionPieChartProps) {
	const COLORS = [
		"#3B82F6", // blue-500
		"#EF4444", // red-500
		"#10B981", // emerald-500
		"#F59E0B", // amber-500
		"#8B5CF6", // violet-500
		"#EC4899", // pink-500
		"#6B7280", // gray-500
		"#14B8A6", // teal-500
	];

	// Recharts 호환 데이터로 변환
	const chartData = data.map((item) => ({
		...item,
		name: item.source,
		value: item.emissions,
	}));

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload as EmissionBySource;
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-900">{data.source}</p>
					<p className="text-sm text-gray-600">
						스코프 {data.scope} • {formatNumber(data.emissions)} tCO₂eq
					</p>
					<p className="text-sm font-medium text-blue-600">
						{data.percentage}%
					</p>
				</div>
			);
		}
		return null;
	};

	const CustomLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
	}: any) => {
		if (percent < 0.05) return null; // 5% 미만은 라벨 생략

		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				fontSize={12}
				fontWeight="medium">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
			<div className="h-80">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<PieChart>
						<Pie
							data={chartData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={CustomLabel}
							outerRadius={100}
							fill="#8884d8"
							dataKey="value">
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
						<Legend
							formatter={(value, entry) => (
								<span className="text-sm text-gray-700">
									{value} (
									{formatNumber(
										(entry.payload as EmissionBySource)?.emissions || 0
									)}{" "}
									tCO₂eq)
								</span>
							)}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
