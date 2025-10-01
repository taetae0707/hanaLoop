"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Company } from "@/types";
import { formatNumber } from "@/lib/utils";

interface SubsidiaryEmissionsChartProps {
	companies: Company[];
	title?: string;
}

export function SubsidiaryEmissionsChart({
	companies,
	title = "자회사/관계사별 배출량",
}: SubsidiaryEmissionsChartProps) {
	// 회사별 총 배출량 계산
	const chartData = companies
		.map((company) => {
			const totalEmissions = company.emissions.reduce(
				(sum, emission) => sum + emission.emissions,
				0
			);
			const scope1 = company.emissions
				.filter((e) => e.scope === 1)
				.reduce((sum, e) => sum + e.emissions, 0);
			const scope2 = company.emissions
				.filter((e) => e.scope === 2)
				.reduce((sum, e) => sum + e.emissions, 0);
			const scope3 = company.emissions
				.filter((e) => e.scope === 3)
				.reduce((sum, e) => sum + e.emissions, 0);

			return {
				name: company.name,
				scope1: Math.round(scope1 * 100) / 100,
				scope2: Math.round(scope2 * 100) / 100,
				scope3: Math.round(scope3 * 100) / 100,
				total: Math.round(totalEmissions * 100) / 100,
				industry: company.industry,
				country: company.country,
			};
		})
		.sort((a, b) => b.total - a.total);

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
					<p className="font-medium text-gray-900 mb-2">{label}</p>
					<p className="text-xs text-gray-500 mb-2">
						{data.industry} • {data.country}
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
					<div className="border-t mt-2 pt-2">
						<div className="flex justify-between text-sm font-medium">
							<span>총 배출량:</span>
							<span>{formatNumber(data.total)} tCO₂eq</span>
						</div>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
				<div className="text-sm text-gray-500">
					총 {companies.length}개 회사
				</div>
			</div>
			<div className="h-80">
				<ResponsiveContainer
					width="100%"
					height="100%">
					<BarChart
						data={chartData}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#f0f0f0"
						/>
						<XAxis
							dataKey="name"
							tick={{ fontSize: 12 }}
							angle={-45}
							textAnchor="end"
							height={100}
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => formatNumber(value, 0)}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Bar
							dataKey="scope1"
							stackId="a"
							fill="#ef4444"
							name="Scope 1"
						/>
						<Bar
							dataKey="scope2"
							stackId="a"
							fill="#f59e0b"
							name="Scope 2"
						/>
						<Bar
							dataKey="scope3"
							stackId="a"
							fill="#10b981"
							name="Scope 3"
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
