"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyEmissionSummary } from "@/types";
import { formatNumber, getRiskLevelColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

interface CompanyTableProps {
	data: CompanyEmissionSummary[];
	title?: string;
}

export function CompanyTable({
	data,
	title = "회사별 배출량 현황",
}: CompanyTableProps) {
	const getTrendIcon = (change: number) => {
		if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
		if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
		return <Minus className="h-4 w-4 text-gray-500" />;
	};

	const getRiskBadge = (riskLevel: "low" | "medium" | "high") => {
		const colors = {
			low: "bg-green-100 text-green-800",
			medium: "bg-yellow-100 text-yellow-800",
			high: "bg-red-100 text-red-800",
		};

		const labels = {
			low: "낮음",
			medium: "보통",
			high: "높음",
		};

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[riskLevel]}`}>
				{riskLevel === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
				{labels[riskLevel]}
			</span>
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-gray-900">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50">
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									회사명
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									총 배출량
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									월간 변화
								</th>
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									리스크 레벨
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{data.map((company) => (
								<tr
									key={company.companyId}
									className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">
											{company.companyName}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<div className="text-sm font-medium text-gray-900">
											{formatNumber(company.totalEmissions)} tCO₂eq
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right">
										<div className="flex items-center justify-end space-x-1">
											{getTrendIcon(company.monthlyChange)}
											<span
												className={`text-sm font-medium ${
													company.monthlyChange > 0
														? "text-red-600"
														: company.monthlyChange < 0
														? "text-green-600"
														: "text-gray-600"
												}`}>
												{Math.abs(company.monthlyChange).toFixed(1)}%
											</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-center">
										{getRiskBadge(company.riskLevel)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
