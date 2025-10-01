"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/common/PageHeader";
import { Breadcrumb } from "@/components/common/nav/Breadcrumb";
import { StatCard } from "@/components/common/stats/Stats";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmissionDetailsTable } from "@/components/upstreamPage/EmissionDetailsTable";
import { TargetManagementSection } from "@/components/targetPage/TargetManagementSection";
import { MonthlyEmissionTable } from "@/components/targetPage/MonthlyEmissionTable";
import { AnnualTrendChart } from "@/components/charts/AnnualTrendChart";
import { QuarterlyComparisonChart } from "@/components/charts/QuarterlyComparisonChart";
import { Button } from "@/components/ui/button";
import {
	fetchSupplierById,
	fetchSupplierTarget,
	fetchUpstreamEmissionDetails,
} from "@/lib/api";
import { Supplier, SupplierTarget } from "@/types/supplier-types";
import { UpstreamEmissionDetails } from "@/types/upstream-types";
import {
	ArrowLeft,
	Target,
	TrendingUp,
	TrendingDown,
	BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEmissionStore } from "@/store/emissionStore";
import { useTargetStore } from "@/store/targetStore";
import { useAnnualTarget } from "@/hooks/useAnnualTarget";
import { useMonthlyEmission } from "@/hooks/useMonthlyEmission";
import { dummyAnnualTarget } from "@/lib/data";

export default function SupplierTargetManagement() {
	const params = useParams();
	const supplierId = params.id as string;
	const year = 2025;
	const currentMonth = new Date().getMonth() + 1; // 1-12

	// Zustand 스토어
	const emissionStore = useEmissionStore();
	const targetStore = useTargetStore();

	// 목표 관리 Hooks
	const {
		annualTarget,
		setTarget: setAnnualTarget,
		ytd,
		achievementRate: ytdAchievementRate,
	} = useAnnualTarget(supplierId, year);
	const { monthlyEmissions, recordEmission } = useMonthlyEmission(
		supplierId,
		year
	);

	// 계절 가중치를 적용한 분기 목표 (useMemo로 관리)
	const seasonalQuarterlyTargets = useMemo(() => {
		if (!annualTarget) return null;
		return annualTarget.quarterlyTargets;
	}, [annualTarget]);

	const [supplier, setSupplier] = useState<Supplier | null>(null);
	const [supplierTarget, setSupplierTarget] = useState<SupplierTarget | null>(
		null
	);
	const [emissionDetails, setEmissionDetails] =
		useState<UpstreamEmissionDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 초기 데이터 로딩
	useEffect(() => {
		const loadSupplierData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [supplierData, targetData, emissionDetailsData] =
					await Promise.all([
						fetchSupplierById(supplierId),
						fetchSupplierTarget(supplierId),
						fetchUpstreamEmissionDetails(supplierId),
					]);

				if (!supplierData) {
					throw new Error("협력사를 찾을 수 없습니다.");
				}

				setSupplier(supplierData);
				setSupplierTarget(targetData);
				setEmissionDetails(emissionDetailsData);

				// 목표 배출량 초기화 (스토어에 없으면 생성)
				if (targetData) {
					let supplierTargets = emissionStore.getSupplierTargets(supplierId);

					if (!supplierTargets) {
						// 총 목표 배출량을 기반으로 각 항목별 목표 생성
						supplierTargets = emissionStore.generateTargetsFromTotal(
							targetData.totalTargetEmissions
						);
						emissionStore.setSupplierTargets(supplierId, supplierTargets);
					}

					// emissionDetails에 targets 추가
					if (emissionDetailsData && supplierTargets) {
						setEmissionDetails({
							...emissionDetailsData,
							targets: supplierTargets,
						});
					}
				}
			} catch (err) {
				setError("협력사 데이터를 불러오는 중 오류가 발생했습니다.");
				console.error("Error loading supplier data:", err);
			} finally {
				setLoading(false);
			}
		};

		if (supplierId) {
			loadSupplierData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supplierId]);

	// 연간 목표 초기화 및 더미 데이터 로드
	useEffect(() => {
		// 항상 더미 데이터를 로드 (캐시된 이전 데이터 덮어쓰기)
		if (supplierId) {
			console.log(`Supplier page: Loading dummy data for ${supplierId}...`);

			// dummyAnnualTarget 데이터를 직접 사용
			targetStore.loadAnnualTarget(supplierId, dummyAnnualTarget);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supplierId]);

	// YTD는 loadAnnualTarget에서 자동으로 계산되므로 별도 처리 불필요

	const handleRecordEmission = (month: number, actual: number) => {
		recordEmission(month, actual);
	};

	if (loading) {
		return <LoadingState fullScreen />;
	}

	if (error || !supplier || !supplierTarget) {
		return (
			<ErrorState
				message={error || "협력사 또는 목표 데이터를 찾을 수 없습니다."}
				actionText="협력사 목록으로 돌아가기"
				actionHref="/suppliers"
				fullScreen
			/>
		);
	}

	const supplierAchievementRate =
		(supplier.totalEmissions / supplierTarget.totalTargetEmissions) * 100;
	const isOverTarget = supplierAchievementRate > 100;

	return (
		<Layout>
			<div className="space-y-6">
				{/* 뒤로가기 버튼 */}
				<div className="flex items-center">
					<Link href={`/suppliers/${supplierId}`}>
						<Button
							variant="outline"
							size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							협력사 상세로 돌아가기
						</Button>
					</Link>
				</div>

				{/* 페이지 헤더 */}
				<PageHeader
					title={`${supplier.name}`}
					description={`${supplier.products.join(", ")} | 거래시작일: ${
						supplier.transactionStartDate
					} | ${
						supplier.relationship === "supplier"
							? "협력사"
							: supplier.relationship === "partner"
							? "파트너"
							: "자회사"
					}`}
				/>

				{/* 브레드크럼 */}
				<Breadcrumb
					items={[
						{ label: "Home", href: "/" },
						{ label: "협력사", href: "/suppliers" },
						{ label: supplier.name, href: `/suppliers/${supplierId}` },
					]}
				/>

				{/* 미니 대쉬보드 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<StatCard
						icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
						label="현재 총배출량"
						value={`${supplier.totalEmissions.toFixed(1)} tCO2e`}
					/>
					<StatCard
						icon={<Target className="h-8 w-8 text-purple-600" />}
						label="목표 배출량"
						value={`${supplierTarget.totalTargetEmissions.toFixed(1)} tCO2e`}
					/>
					<StatCard
						icon={
							isOverTarget ? (
								<TrendingUp className="h-8 w-8 text-red-600" />
							) : (
								<TrendingDown className="h-8 w-8 text-green-600" />
							)
						}
						label="달성률"
						value={`${supplierAchievementRate.toFixed(1)}%`}
					/>
				</div>

				{/* 총 배출량 근거 자료 */}
				{emissionDetails && (
					<EmissionDetailsTable emissionDetails={emissionDetails} />
				)}

				{/* 목표 관리 섹션 */}
				{annualTarget && ytd ? (
					<>
						{/* 연간 목표 설정 + 분기별 진행 + YTD 누적 (한 박스로 통합) */}
						<TargetManagementSection
							companyId={supplierId}
							year={year}
							annualTarget={annualTarget}
							ytdActual={ytd.actual}
							ytdBudget={ytd.budget}
							ytdVariance={ytd.variance}
							achievementRate={ytdAchievementRate}
							currentMonth={currentMonth}
						/>

						{/* 차트 섹션 */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<AnnualTrendChart monthlyEmissions={monthlyEmissions} />
							{seasonalQuarterlyTargets && (
								<QuarterlyComparisonChart
									quarterlyTargets={seasonalQuarterlyTargets}
								/>
							)}
						</div>

						{/* 월별 배출 실적 테이블 */}
						<MonthlyEmissionTable
							monthlyEmissions={monthlyEmissions}
							onRecordEmission={handleRecordEmission}
						/>
					</>
				) : (
					<LoadingState message="목표 데이터를 불러오는 중..." />
				)}
			</div>
		</Layout>
	);
}
