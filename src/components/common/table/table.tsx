"use client";

import React from "react";
import Link from "next/link";
import {
	ExternalLink,
	Target,
	CheckCircle,
	Clock,
	AlertTriangle,
} from "lucide-react";
import { Supplier } from "@/types/supplier-types";

interface TableColumn {
	key: string;
	label: string;
	width?: string;
	align?: "left" | "center" | "right";
	sortable?: boolean;
}

interface TableRow {
	id: string;
	[key: string]: React.ReactNode;
}

interface TableProps {
	columns: TableColumn[];
	data: TableRow[];
	onRowClick?: (row: TableRow) => void;
	className?: string;
}

export function Table({
	columns,
	data,
	onRowClick,
	className = "",
}: TableProps) {
	return (
		<div className={`overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b">
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									className={`px-6 py-3 text-${
										column.align || "left"
									} text-xs font-medium text-gray-500 uppercase tracking-wider ${
										column.width ? `w-${column.width}` : ""
									}`}>
									{column.label}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((row) => (
							<tr
								key={row.id}
								className="hover:bg-gray-50 cursor-pointer"
								onClick={() => onRowClick?.(row)}>
								{columns.map((column) => (
									<td
										key={column.key}
										className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900`}>
										{row[column.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// 협력사 테이블 전용 컴포넌트
interface SupplierTableProps {
	suppliers: Supplier[];
	getStatusColor: (status: string) => string;
	getStatusText: (status: string) => string;
	getRiskLevelColor: (riskLevel: string) => string;
	getRiskLevelText: (riskLevel: string) => string;
}

export function SupplierTable({
	suppliers,
	getStatusColor,
	getStatusText,
	getRiskLevelColor,
	getRiskLevelText,
}: SupplierTableProps) {
	const columns: TableColumn[] = [
		{ key: "name", label: "상호명", width: "48" },
		{ key: "products", label: "제품", width: "64" },
		{ key: "status", label: "진행상황", width: "32" },
		{ key: "relationship", label: "관계", width: "32" },
		{ key: "transactionStartDate", label: "거래시작일", width: "40" },
		{ key: "totalEmissions", label: "총 탄소배출량", width: "48" },
		{ key: "targetEmissions", label: "목표 탄소배출량", width: "48" },
		{ key: "expectedSavings", label: "예상 저축", width: "40" },
		{ key: "riskLevel", label: "상태", width: "32" },
		{ key: "sustainabilityReport", label: "지속가능성 보고서", width: "48" },
	];

	const formatSupplierData = (suppliers: Supplier[]) => {
		return suppliers.map((supplier) => ({
			id: supplier.id,
			name: (
				<div className="flex items-center">
					<Link
						href={`/suppliers/${supplier.id}`}
						className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
						onClick={(e) => e.stopPropagation()}>
						{supplier.name}
					</Link>
					<Link
						href={`/suppliers/${supplier.id}`}
						onClick={(e) => e.stopPropagation()}>
						<ExternalLink className="ml-2 h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
					</Link>
				</div>
			),
			products: (
				<div className="text-sm text-gray-900">
					{supplier.products.join(", ")}
				</div>
			),
			status: (
				<span
					className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
						supplier.status
					)}`}>
					{getStatusText(supplier.status)}
				</span>
			),
			relationship: (
				<span className="text-sm text-gray-900">
					{supplier.relationship === "supplier"
						? "협력사"
						: supplier.relationship === "partner"
						? "파트너"
						: "자회사"}
				</span>
			),
			transactionStartDate: supplier.transactionStartDate,
			totalEmissions: `${supplier.totalEmissions.toFixed(1)} tCO2e`,
			targetEmissions: (
				<div className="flex items-center">
					<span className="text-sm text-gray-900">
						{supplier.targetEmissions.toFixed(1)} tCO2e
					</span>
					<Link
						href={`/suppliers/${supplier.id}/target`}
						onClick={(e) => e.stopPropagation()}>
						<Target className="ml-2 h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
					</Link>
				</div>
			),
			expectedSavings: `${supplier.expectedSavings.toFixed(1)} tCO2e`,
			riskLevel: (
				<span
					className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskLevelColor(
						supplier.riskLevel
					)}`}>
					{supplier.riskLevel === "normal" && (
						<CheckCircle className="h-3 w-3 mr-1" />
					)}
					{supplier.riskLevel === "warning" && (
						<Clock className="h-3 w-3 mr-1" />
					)}
					{supplier.riskLevel === "danger" && (
						<AlertTriangle className="h-3 w-3 mr-1" />
					)}
					{getRiskLevelText(supplier.riskLevel)}
				</span>
			),
			sustainabilityReport: supplier.sustainabilityReport ? (
				<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
					{supplier.sustainabilityReport}
				</span>
			) : (
				<span className="text-gray-400">-</span>
			),
		}));
	};

	return (
		<Table
			columns={columns}
			data={formatSupplierData(suppliers)}
		/>
	);
}
