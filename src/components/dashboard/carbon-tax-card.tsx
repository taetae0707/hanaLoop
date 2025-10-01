"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, AlertTriangle, Calculator, Target } from "lucide-react";

interface CarbonTaxCardProps {
	totalEmissions: number;
	carbonTaxRate: number; // $/tCO2
	projectedTax: number;
	targetReduction: number; // percentage
	potentialSavings: number;
}

export function CarbonTaxCard({
	totalEmissions,
	carbonTaxRate,
	projectedTax,
	targetReduction,
	potentialSavings,
}: CarbonTaxCardProps) {
	const currentYearTax = totalEmissions * carbonTaxRate;
	const nextYearTax = projectedTax;
	const taxIncrease = nextYearTax - currentYearTax;
	const savingsFromReduction =
		((totalEmissions * targetReduction) / 100) * carbonTaxRate;

	return (
		<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2 text-blue-900">
					<Calculator className="h-5 w-5" />
					<span>탄소세 영향 분석</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* 현재 연도 탄소세 */}
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-600">2024년 예상 탄소세</span>
					<span className="text-lg font-semibold text-gray-900">
						₩{formatNumber(currentYearTax / 1000, 0)}만원
					</span>
				</div>

				{/* 다음 연도 탄소세 */}
				<div className="flex justify-between items-center">
					<span className="text-sm text-gray-600">2025년 예상 탄소세</span>
					<div className="text-right">
						<span className="text-lg font-semibold text-red-600">
							₩{formatNumber(nextYearTax / 1000, 0)}만원
						</span>
						{taxIncrease > 0 && (
							<div className="flex items-center text-red-500 text-xs">
								<TrendingUp className="h-3 w-3 mr-1" />
								+₩{formatNumber(taxIncrease / 1000, 0)}만원
							</div>
						)}
					</div>
				</div>

				<div className="border-t pt-3">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-1">
							<Target className="h-4 w-4 text-green-600" />
							<span className="text-sm text-gray-600">
								{targetReduction}% 감축시 절약
							</span>
						</div>
						<span className="text-lg font-semibold text-green-600">
							₩{formatNumber(savingsFromReduction / 1000, 0)}만원
						</span>
					</div>
				</div>

				{/* 탄소세율 정보 */}
				<div className="bg-white rounded-lg p-3 border">
					<div className="flex justify-between text-xs text-gray-500">
						<span>현재 탄소세율</span>
						<span>${carbonTaxRate}/tCO₂</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
