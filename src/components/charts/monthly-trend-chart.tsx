"use client";

import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Area,
	ComposedChart,
} from "recharts";
import { MonthlyTrend } from "@/types";
import { formatNumber, formatYearMonth } from "@/lib/utils";

interface MonthlyTrendChartProps {
	data: MonthlyTrend[];
	title?: string;
}

export function MonthlyTrendChart({
	data,
	title = "월별 배출량 추이",
}: MonthlyTrendChartProps) {
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-900 mb-2">
						{formatYearMonth(label)}
					</p>
					{payload.map((entry: any, index: number) => (
						<div
							key={index}
							className="flex items-center space-x-2 text-sm">
							<div
								className="w-3 h-3 rounded-full"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="text-gray-600">{entry.name}:</span>
							<span className="font-medium text-gray-900">
								{formatNumber(entry.value)} tCO₂eq
							</span>
						</div>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
			<div className="h-80">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<ComposedChart data={data}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#f0f0f0"
						/>
						<XAxis
							dataKey="yearMonth"
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => {
								const [, month] = value.split("-");
								return `${parseInt(month)}월`;
							}}
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => `${formatNumber(value, 0)}`}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />

						{/* 실제 배출량 */}
						<Line
							type="monotone"
							dataKey="actual"
							stroke="#3B82F6"
							strokeWidth={3}
							dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
							name="실제 배출량"
						/>

						{/* 목표 배출량 */}
						<Line
							type="monotone"
							dataKey="target"
							stroke="#10B981"
							strokeWidth={2}
							strokeDasharray="5 5"
							dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
							name="목표 배출량"
						/>

						{/* 예측 배출량 */}
						<Line
							type="monotone"
							dataKey="forecast"
							stroke="#F59E0B"
							strokeWidth={2}
							strokeDasharray="3 3"
							dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
							name="예측 배출량"
							connectNulls={false}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
