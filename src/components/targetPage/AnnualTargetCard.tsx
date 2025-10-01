"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";
import { AllocationMethod } from "@/types/target-types";
import {
	calculateRemainingBudget,
	calculateAnnualGoal,
	getAllocationMethodText,
	getAllocationMethodDescription,
} from "@/utils/targetCalculations";

interface AnnualTargetCardProps {
	year: number;
	totalBudget: number;
	allocationMethod: AllocationMethod;
	ytdActual: number;
	onSave: (totalBudget: number, method: AllocationMethod) => void;
}

export function AnnualTargetCard({
	year,
	totalBudget,
	allocationMethod,
	ytdActual,
	onSave,
}: AnnualTargetCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editBudget, setEditBudget] = useState(totalBudget);
	const [editMethod, setEditMethod] =
		useState<AllocationMethod>(allocationMethod);

	// 남은 예산 계산
	const remainingBudget = calculateRemainingBudget(totalBudget, ytdActual);
	// 연간 목표 (현재배출 + 남은예산)
	const annualGoal = calculateAnnualGoal(ytdActual, remainingBudget);

	const handleSave = () => {
		onSave(editBudget, editMethod);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditBudget(totalBudget);
		setEditMethod(allocationMethod);
		setIsEditing(false);
	};

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
				<div>
					<h3 className="text-xl font-medium text-gray-900">
						{year}년 탄소 배출량 목표
					</h3>
					<p className="text-sm text-gray-500">
						연간 총 배출량 목표와 분기별 배분 방식을 설정합니다
					</p>
				</div>
				{!isEditing ? (
					<Button onClick={() => setIsEditing(true)}>
						<Edit3 className="h-4 w-4 mr-2" />
						수정
					</Button>
				) : (
					<div className="flex space-x-2">
						<Button
							variant="outline"
							onClick={handleCancel}>
							취소
						</Button>
						<Button onClick={handleSave}>
							<Save className="h-4 w-4 mr-2" />
							저장
						</Button>
					</div>
				)}
			</div>
			<div className="p-6">
				{isEditing ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								연간 총 목표 (tCO₂e)
							</label>
							<input
								type="number"
								step="0.1"
								value={editBudget}
								onChange={(e) => setEditBudget(parseFloat(e.target.value) || 0)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								배분 방식
							</label>
							<select
								value={editMethod}
								onChange={(e) =>
									setEditMethod(e.target.value as AllocationMethod)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
								<option value="pro-rata">균등 배분 (Pro-rata)</option>
								<option value="seasonal">계절 가중 (Seasonal)</option>
							</select>
							<p className="text-xs text-gray-500 mt-1">
								{editMethod === "seasonal"
									? "난방(1-3월, 11-12월), 냉방(6-8월) 계절 가중 적용"
									: "4개 분기에 균등하게 배분"}
							</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{/* 연간목표 */}
						<div className="border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-500 mb-1">연간목표</div>
							<div className="text-2xl font-semibold text-gray-900">
								{annualGoal.toLocaleString()}
							</div>
							<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
						</div>

						{/* 현재배출 */}
						<div className="border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-500 mb-1">현재배출</div>
							<div className="text-2xl font-semibold text-gray-900">
								{ytdActual.toLocaleString()}
							</div>
							<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
						</div>

						{/* 남은예산 */}
						<div className="border border-gray-200 rounded-lg p-4">
							<div className="text-sm text-gray-500 mb-1">남은예산</div>
							<div className="text-2xl font-semibold text-gray-900">
								{remainingBudget.toLocaleString()}
							</div>
							<div className="text-xs text-gray-400 mt-1">tCO₂e</div>
						</div>

						{/* 배분방식 */}
						<div className="border border-gray-200 rounded-lg p-4 bg-green-50">
							<div className="text-sm text-gray-500 mb-1">배분방식</div>
							<div className="text-lg font-semibold text-gray-900">
								{getAllocationMethodText(allocationMethod)}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{getAllocationMethodDescription(allocationMethod)}
							</div>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
