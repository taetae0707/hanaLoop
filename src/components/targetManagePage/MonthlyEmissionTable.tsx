"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyEmission } from "@/types/target-types";
import { Edit3, Save, X } from "lucide-react";
import { defaultSeasonalWeights } from "@/lib/data";

interface MonthlyEmissionTableProps {
	monthlyEmissions: MonthlyEmission[];
	onRecordEmission: (month: number, actual: number) => void;
}

export function MonthlyEmissionTable({
	monthlyEmissions,
	onRecordEmission,
}: MonthlyEmissionTableProps) {
	const [editingMonth, setEditingMonth] = useState<number | null>(null);
	const [editValue, setEditValue] = useState<number>(0);

	// 디버깅: 월별 배출량 데이터 확인
	React.useEffect(() => {
		console.log("MonthlyEmissionTable - monthlyEmissions:", monthlyEmissions);
		const hasActualData = monthlyEmissions.some((me) => me.actual > 0);
		console.log("Has actual data:", hasActualData);
	}, [monthlyEmissions]);

	const handleStartEdit = (month: number, currentActual: number) => {
		setEditingMonth(month);
		setEditValue(currentActual);
	};

	const handleSave = (month: number) => {
		onRecordEmission(month, editValue);
		setEditingMonth(null);
	};

	const handleCancel = () => {
		setEditingMonth(null);
		setEditValue(0);
	};

	// 누적 계산
	const calculateCumulative = (upToMonth: number): number => {
		return monthlyEmissions
			.filter((me) => me.month <= upToMonth)
			.reduce((sum, me) => sum + me.actual, 0);
	};

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900">월별 배출량 관리</h3>
				<p className="text-sm text-gray-500">
					월별 예산과 실제 배출량을 기록하고 관리합니다
				</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full table-fixed">
					<thead className="bg-gray-50 border-b">
						<tr>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								월
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								예산 배출량 (tCO₂e)
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								계절별 가중치
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								실제 배출량 (tCO₂e)
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								차이 (tCO₂e)
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								누적 실제 배출량
							</th>
							<th className="w-1/7 px-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								작업
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{monthlyEmissions.map((me) => {
							const variance = me.actual - me.budget;
							const isOverBudget = variance > 0;
							const cumulative = calculateCumulative(me.month);
							const isEditing = editingMonth === me.month;

							return (
								<tr
									key={me.month}
									className="hover:bg-gray-50">
									<td className="px-3 py-4 text-center text-sm font-medium text-gray-900">
										{me.month}월
									</td>
									<td className="px-3 py-4 text-center text-sm text-gray-700">
										{me.budget.toFixed(1)}
									</td>
									<td className="px-3 py-4 text-center text-sm text-gray-700">
										{
											defaultSeasonalWeights[
												me.month as keyof typeof defaultSeasonalWeights
											]
										}
										x
									</td>
									<td className="px-3 py-4 text-center text-sm">
										{isEditing ? (
											<input
												type="number"
												step="0.1"
												value={editValue}
												onChange={(e) =>
													setEditValue(parseFloat(e.target.value) || 0)
												}
												className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
												autoFocus
											/>
										) : (
											<span
												className={
													me.actual > 0
														? "font-semibold text-gray-900"
														: "text-gray-400"
												}>
												{me.actual > 0 ? me.actual.toFixed(1) : "-"}
											</span>
										)}
									</td>
									<td className="px-3 py-4 text-center text-sm">
										{me.actual > 0 ? (
											<span
												className={`font-semibold ${
													isOverBudget ? "text-red-600" : "text-green-600"
												}`}>
												{isOverBudget ? "+" : ""}
												{variance.toFixed(1)}
											</span>
										) : (
											<span className="text-gray-400">-</span>
										)}
									</td>
									<td className="px-3 py-4 text-center text-sm font-semibold text-gray-900">
										{cumulative > 0 ? cumulative.toFixed(1) : "-"}
									</td>
									<td className="px-3 py-4 text-center text-sm">
										{isEditing ? (
											<div className="flex justify-center space-x-1">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleSave(me.month)}>
													<Save className="h-4 w-4 text-green-600" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={handleCancel}>
													<X className="h-4 w-4 text-red-600" />
												</Button>
											</div>
										) : (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleStartEdit(me.month, me.actual)}>
												<Edit3 className="h-4 w-4 text-gray-600" />
											</Button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</Card>
	);
}
