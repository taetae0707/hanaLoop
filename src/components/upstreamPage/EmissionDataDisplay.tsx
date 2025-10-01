"use client";

import React from "react";

interface DataItemProps {
	label: string;
	value: string | number;
	unit?: string;
	className?: string;
}

interface EmissionDataDisplayProps {
	data: DataItemProps[];
}

export function EmissionDataDisplay({ data }: EmissionDataDisplayProps) {
	return (
		<>
			{data.map((item, index) => (
				<div
					key={index}
					className={item.className}>
					{item.label}:{" "}
					<span className="font-semibold">
						{item.value}
						{item.unit && ` ${item.unit}`}
					</span>
				</div>
			))}
		</>
	);
}

// 특정 데이터 타입별 컴포넌트들
interface PurchasedProductsDataProps {
	data: {
		rawMaterialQuantity: number;
		rawMaterialPCF: number;
	};
}

export function PurchasedProductsData({ data }: PurchasedProductsDataProps) {
	return (
		<EmissionDataDisplay
			data={[
				{
					label: "원자재 구매량",
					value: data.rawMaterialQuantity,
					unit: "ton",
				},
				{
					label: "원자재 PCF 데이터",
					value: data.rawMaterialPCF,
					unit: "kgCO2e/kg",
				},
			]}
		/>
	);
}

interface TransportationDataProps {
	data: {
		distance: number;
		cargoWeight: number;
		transportMode: string;
	};
}

export function TransportationData({ data }: TransportationDataProps) {
	return (
		<EmissionDataDisplay
			data={[
				{
					label: "운송거리",
					value: data.distance,
					unit: "km",
				},
				{
					label: "화물무게",
					value: data.cargoWeight,
					unit: "ton",
				},
				{
					label: "운송수단",
					value: data.transportMode,
				},
			]}
		/>
	);
}

interface EnergyDataProps {
	data: {
		totalElectricityUsage: number;
		totalFuelUsage: number;
	};
}

export function EnergyData({ data }: EnergyDataProps) {
	return (
		<EmissionDataDisplay
			data={[
				{
					label: "총 전기 사용량",
					value: data.totalElectricityUsage.toLocaleString(),
					unit: "kWh",
				},
				{
					label: "총 연료 사용량",
					value: data.totalFuelUsage.toLocaleString(),
					unit: "L",
				},
			]}
		/>
	);
}

interface WasteDataProps {
	data: Array<{
		wasteType: string;
		treatmentVolume: number;
		treatmentMethod: string;
	}>;
}

export function WasteData({ data }: WasteDataProps) {
	return (
		<>
			{data.map((wasteItem, index) => (
				<div key={index}>
					<EmissionDataDisplay
						data={[
							{
								label: wasteItem.wasteType,
								value: wasteItem.treatmentVolume,
								unit: "ton",
							},
						]}
					/>
					<div className="text-xs text-gray-500">
						처리방법: {wasteItem.treatmentMethod}
					</div>
				</div>
			))}
		</>
	);
}
