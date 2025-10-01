"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EmissionSummary } from "@/types";
import { formatNumber, getScopeColor } from "@/lib/utils";

interface ScopeDonutChartProps {
	data: EmissionSummary;
	title?: string;
}

export function ScopeDonutChart({
	data,
	title = "스코프별 배출량",
}: ScopeDonutChartProps) {
	const chartData = [
		{ name: "Scope 1", value: data.scope1, color: getScopeColor(1) },
		{ name: "Scope 2", value: data.scope2, color: getScopeColor(2) },
		{ name: "Scope 3", value: data.scope3, color: getScopeColor(3) },
	];

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-900">{data.name}</p>
					<p className="text-sm text-gray-600">
						{formatNumber(data.value)} tCO₂eq
					</p>
					<p className="text-sm font-medium text-blue-600">
						{(
							(data.value / (data.scope1 + data.scope2 + data.scope3)) *
							100
						).toFixed(1)}
						%
					</p>
				</div>
			);
		}
		return null;
	};

	const centerValue = data.totalEmissions;
	const centerText = formatNumber(centerValue);

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
			<div className="relative h-80">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<PieChart>
						<Pie
							data={chartData}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey="value">
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.color}
								/>
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
					</PieChart>
				</ResponsiveContainer>

				{/* Center text */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900">{centerText}</div>
						<div className="text-sm text-gray-500">tCO₂eq</div>
					</div>
				</div>
			</div>

			{/* Legend */}
			<div className="mt-4 space-y-2">
				{chartData.map((item, index) => (
					<div
						key={index}
						className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<div
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-sm text-gray-700">{item.name}</span>
						</div>
						<div className="text-sm font-medium text-gray-900">
							{formatNumber(item.value)} tCO₂eq
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
