"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/search/Search";
import { Breadcrumb } from "@/components/common/nav/Breadcrumb";
import { SupplierTable } from "@/components/common/table/table";
import { StatCard } from "@/components/common/stats/Stats";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSuppliers } from "@/lib/api";
import { Supplier } from "@/types/supplier-types";
import {
	getRiskLevelColor,
	getRiskLevelText,
	getStatusColor,
	getStatusText,
} from "@/lib/supplier-utils";
import {
	Filter,
	AlertTriangle,
	CheckCircle,
	Clock,
	TrendingUp,
} from "lucide-react";

export default function SupplierManagement() {
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const loadSuppliers = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchSuppliers();
				setSuppliers(data);
			} catch (err) {
				setError("협력사 데이터를 불러오는 중 오류가 발생했습니다.");
				console.error("Error loading suppliers:", err);
			} finally {
				setLoading(false);
			}
		};

		loadSuppliers();
	}, []);

	const filteredSuppliers = suppliers.filter(
		(supplier) =>
			supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			supplier.products.some((product) =>
				product.toLowerCase().includes(searchTerm.toLowerCase())
			)
	);

	if (loading) {
		return <LoadingState fullScreen />;
	}

	if (error) {
		return (
			<ErrorState
				message={error}
				fullScreen
			/>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				{/* 페이지 헤더 */}
				<PageHeader
					title="협력사 관리 upstream "
					description="협력사의 탄소 배출량을 관리하고 목표를 설정합니다"
				/>

				{/* 브레드크럼 */}
				<Breadcrumb
					items={[
						{ label: "Home", href: "/" },
						{ label: "협력사", isActive: true },
					]}
				/>

				{/* 검색 및 필터 */}
				<Card className="p-4">
					<div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
						<div className="flex-1">
							<SearchInput
								value={searchTerm}
								onChange={setSearchTerm}
								placeholder="협력사명 또는 제품명으로 검색..."
							/>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="outline"
								size="sm">
								<Filter className="h-4 w-4 mr-2" />
								필터
							</Button>
							<Button size="sm">CSV</Button>
						</div>
					</div>
				</Card>

				{/* 협력사 테이블 */}
				<Card>
					<SupplierTable
						suppliers={filteredSuppliers}
						getStatusColor={getStatusColor}
						getStatusText={getStatusText}
						getRiskLevelColor={getRiskLevelColor}
						getRiskLevelText={getRiskLevelText}
					/>
				</Card>

				{/* 요약 통계 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<StatCard
						icon={<CheckCircle className="h-8 w-8 text-green-600" />}
						label="정상 상태"
						value={suppliers.filter((s) => s.riskLevel === "normal").length}
					/>
					<StatCard
						icon={<Clock className="h-8 w-8 text-yellow-600" />}
						label="관리요망"
						value={suppliers.filter((s) => s.riskLevel === "warning").length}
					/>
					<StatCard
						icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
						label="위험 상태"
						value={suppliers.filter((s) => s.riskLevel === "danger").length}
					/>
					<StatCard
						icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
						label="총 예상 저축"
						value={`${suppliers
							.reduce((sum, s) => sum + s.expectedSavings, 0)
							.toFixed(1)} tCO2e`}
					/>
				</div>
			</div>
		</Layout>
	);
}
