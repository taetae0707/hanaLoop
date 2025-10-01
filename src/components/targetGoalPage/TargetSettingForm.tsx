"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";

interface TargetSettingFormProps {
	isEditing: boolean;
	saving: boolean;
	editTargetEmissions: number;
	editTargetSavings: number;
	totalTargetEmissions: number;
	targetSavings: number;
	onEdit: () => void;
	onCancel: () => void;
	onSave: () => void;
	onTargetEmissionsChange: (value: number) => void;
	onTargetSavingsChange: (value: number) => void;
}

export function TargetSettingForm({
	isEditing,
	saving,
	editTargetEmissions,
	editTargetSavings,
	totalTargetEmissions,
	targetSavings,
	onEdit,
	onCancel,
	onSave,
	onTargetEmissionsChange,
	onTargetSavingsChange,
}: TargetSettingFormProps) {
	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-medium text-gray-900">목표 설정</h3>
					<p className="text-sm text-gray-500">
						협력사의 탄소 배출량 목표를 설정하고 관리합니다
					</p>
				</div>
				{!isEditing ? (
					<Button onClick={onEdit}>
						<Edit3 className="h-4 w-4 mr-2" />
						목표 수정
					</Button>
				) : (
					<div className="flex space-x-2">
						<Button
							variant="outline"
							onClick={onCancel}>
							취소
						</Button>
						<Button
							onClick={onSave}
							disabled={saving}>
							{saving ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									저장 중...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									저장
								</>
							)}
						</Button>
					</div>
				)}
			</div>
			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							총 탄소배출량 목표치 (tCO2e)
						</label>
						{isEditing ? (
							<input
								type="number"
								step="0.1"
								value={editTargetEmissions}
								onChange={(e) =>
									onTargetEmissionsChange(parseFloat(e.target.value) || 0)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						) : (
							<div className="text-2xl font-semibold text-gray-900">
								{totalTargetEmissions.toFixed(1)} tCO2e
							</div>
						)}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							목표 탄소배출권 저축량 (tCO2e)
						</label>
						{isEditing ? (
							<input
								type="number"
								step="0.1"
								value={editTargetSavings}
								onChange={(e) =>
									onTargetSavingsChange(parseFloat(e.target.value) || 0)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						) : (
							<div className="text-2xl font-semibold text-gray-900">
								{targetSavings.toFixed(1)} tCO2e
							</div>
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}
