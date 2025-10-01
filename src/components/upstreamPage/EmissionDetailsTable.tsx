"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { UpstreamEmissionDetails } from "@/types/upstream-types";
import { Package, Truck, Zap, Trash2 } from "lucide-react";
import { EmissionRow } from "./EmissionRow";
import {
	PurchasedProductsData,
	TransportationData,
	EnergyData,
	WasteData,
} from "./EmissionDataDisplay";

interface EmissionDetailsTableProps {
	emissionDetails: UpstreamEmissionDetails;
}

export function EmissionDetailsTable({
	emissionDetails,
}: EmissionDetailsTableProps) {
	const { purchasedProducts, transportation, energy, waste, targets } =
		emissionDetails;

	// 현재 월과 전달 월 계산
	const getCurrentMonth = () => {
		const now = new Date();
		return now.getMonth() + 1; // 1-12
	};

	const getPreviousMonth = () => {
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		return thirtyDaysAgo.getMonth() + 1; // 1-12
	};

	const currentMonth = getCurrentMonth();
	const previousMonthNumber = getPreviousMonth();

	// 8월 더미 데이터 생성 (9월 데이터와 비슷하지만 숫자만 다르게)
	const generateDummyPreviousMonthData = () => {
		return {
			purchasedProducts: {
				rawMaterialQuantity: Math.round(
					purchasedProducts.rawMaterialQuantity * 0.85
				), // 15% 감소
				rawMaterialPCF:
					Math.round(purchasedProducts.rawMaterialPCF * 1.1 * 10) / 10, // 10% 증가
			},
			transportation: {
				distance: Math.round(transportation.distance * 1.2), // 20% 증가
				cargoWeight: Math.round(transportation.cargoWeight * 0.9), // 10% 감소
				transportMode: transportation.transportMode,
			},
			energy: {
				totalElectricityUsage: Math.round(energy.totalElectricityUsage * 0.95), // 5% 감소
				totalFuelUsage: Math.round(energy.totalFuelUsage * 1.15), // 15% 증가
			},
			waste: waste.map((item) => ({
				...item,
				treatmentVolume: Math.round(item.treatmentVolume * 0.8), // 20% 감소
			})),
		};
	};

	const dummyPreviousMonthData = generateDummyPreviousMonthData();

	return (
		<Card className="overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-200">
				<h3 className="text-lg font-medium text-gray-900">
					총 배출량 근거 자료
				</h3>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								우선순위
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								항목
							</th>

							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{previousMonthNumber}월 데이터
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								{currentMonth}월 데이터
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								배출량 증감
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								목표 배출량
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{/* 구매한 제품 및 서비스 */}
						<EmissionRow
							priorityText="Priority 1"
							priorityColor="red"
							icon={Package}
							title="구매한 제품 및 서비스"
							currentMonthData={
								<PurchasedProductsData data={purchasedProducts} />
							}
							previousMonthData={
								<PurchasedProductsData
									data={dummyPreviousMonthData.purchasedProducts}
								/>
							}
							targetEmission={targets?.purchasedProducts}
							currentMonthValues={
								purchasedProducts as unknown as Record<string, string | number>
							}
							previousMonthValues={
								dummyPreviousMonthData.purchasedProducts as unknown as Record<
									string,
									string | number
								>
							}
						/>

						{/* 업스트림 운송 및 유통 */}
						<EmissionRow
							priorityText="Priority 2"
							priorityColor="orange"
							icon={Truck}
							title="업스트림 운송 및 유통"
							currentMonthData={<TransportationData data={transportation} />}
							previousMonthData={
								<TransportationData
									data={dummyPreviousMonthData.transportation}
								/>
							}
							targetEmission={targets?.transportation}
							currentMonthValues={
								transportation as unknown as Record<string, string | number>
							}
							previousMonthValues={
								dummyPreviousMonthData.transportation as unknown as Record<
									string,
									string | number
								>
							}
						/>

						{/* 연료 및 에너지 관련 활동 */}
						<EmissionRow
							priorityText="Priority 3"
							priorityColor="yellow"
							icon={Zap}
							title="연료 및 에너지 관련 활동"
							currentMonthData={<EnergyData data={energy} />}
							previousMonthData={
								<EnergyData data={dummyPreviousMonthData.energy} />
							}
							targetEmission={targets?.energy}
							currentMonthValues={
								energy as unknown as Record<string, string | number>
							}
							previousMonthValues={
								dummyPreviousMonthData.energy as unknown as Record<
									string,
									string | number
								>
							}
						/>

						{/* 사업 활동에서 발생한 폐기물 */}
						<EmissionRow
							priorityText="Priority 4"
							priorityColor="green"
							icon={Trash2}
							title="사업 활동에서 발생한 폐기물"
							currentMonthData={<WasteData data={waste} />}
							previousMonthData={
								<WasteData data={dummyPreviousMonthData.waste} />
							}
							targetEmission={targets?.waste}
							currentMonthValues={
								waste[0] as unknown as Record<string, string | number>
							} // 첫 번째 폐기물 항목 사용
							previousMonthValues={
								dummyPreviousMonthData.waste[0] as unknown as Record<
									string,
									string | number
								>
							}
						/>
					</tbody>
				</table>
			</div>
			<div className="px-6 py-3 bg-gray-50 border-t">
				<div className="flex justify-between items-center text-sm text-gray-600">
					<span>마지막 업데이트: {emissionDetails.lastUpdated}</span>
					<span className="font-semibold text-gray-900">
						총 배출량: {emissionDetails.totalEmissions.toFixed(1)} tCO2e
					</span>
				</div>
			</div>
		</Card>
	);
}
