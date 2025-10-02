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
import { useBudgetAllocation } from "@/hooks/useBudgetAllocation";
import { dummyAnnualTarget, defaultSeasonalWeights } from "@/lib/data";
import {
	getAllocationMethodText,
	getAllocationMethodDescription,
	calculateRemainingBudget,
	calculateCurrentTotalEmissions,
	calculateCurrentTotalBudget,
	calculateCurrentRemainingBudget,
	calculateBudgetUsageRate,
} from "@/utils/targetCalculations";
import { MonthlyEmission, QuarterlyTarget } from "@/types/target-types";

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
		ytd,
		achievementRate: ytdAchievementRate,
	} = useAnnualTarget(supplierId, year);
	const { monthlyEmissions, recordEmission } = useMonthlyEmission(
		supplierId,
		year
	);

	// 가중치 계산된 예산 데이터 가져오기 (수정된 훅 사용)
	const { data: budgetAllocationData } = useBudgetAllocation({
		companyId: supplierId,
		totalBudget: annualTarget?.totalBudget || 0,
		weights: defaultSeasonalWeights,
		year: year,
		ytdActual: annualTarget?.ytdActual || 0,
	});

	// 가중치 계산된 월별 데이터와 실제 데이터 합치기 (useMemo로 관리)
	const mergedMonthlyEmissions = useMemo(() => {
		if (!annualTarget || !budgetAllocationData) {
			return monthlyEmissions;
		}

		// 계산된 예산 데이터와 더미 데이터의 실제 값을 합침
		const result = budgetAllocationData.monthlyBudgets.map(
			(budgetItem: MonthlyEmission) => {
				const actualItem = annualTarget.monthlyEmissions.find(
					(actual) => actual.month === budgetItem.month
				);
				return {
					...budgetItem,
					actual: actualItem?.actual || 0, // 더미 데이터의 실제 값 사용
				};
			}
		);

		return result;
	}, [annualTarget, budgetAllocationData, monthlyEmissions]);

	// 가중치 계산된 분기 목표와 실제 데이터 합치기 (useMemo로 관리)
	const mergedQuarterlyTargets = useMemo(() => {
		if (!annualTarget || !budgetAllocationData) {
			return annualTarget?.quarterlyTargets || null;
		}

		const result = budgetAllocationData.quarterlyTargets.map(
			(budgetItem: QuarterlyTarget) => {
				const actualItem = annualTarget.quarterlyTargets.find(
					(actual) => actual.quarter === budgetItem.quarter
				);
				return {
					...budgetItem,
					actual: actualItem?.actual || 0, // 더미 데이터의 실제 값 사용
				};
			}
		);

		return result;
	}, [annualTarget, budgetAllocationData]);

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

	// 월별 가중치 계산값 콘솔 출력 (테스트용)
	useEffect(() => {
		if (annualTarget && budgetAllocationData && supplierId) {
			console.log("=== 월별 가중치 계산 테스트 ===");
			console.log("협력사 ID:", supplierId);
			console.log("기본 계절 가중치:", defaultSeasonalWeights);
			console.log("원본 연간 목표:", annualTarget);
			console.log("가중치 계산된 예산 데이터:", budgetAllocationData);

			// 합쳐진 월별 데이터 출력
			if (mergedMonthlyEmissions) {
				console.log("합쳐진 월별 데이터 (가중치 예산 + 더미 실제값):");
				mergedMonthlyEmissions.forEach((monthly: MonthlyEmission) => {
					const weight = defaultSeasonalWeights[monthly.month] || 1;
					console.log(
						`${
							monthly.month
						}월: 가중치(${weight}) → 예산 ${monthly.budget.toFixed(
							2
						)} tCO2e, 실적 ${monthly.actual.toFixed(2)} tCO2e`
					);
				});
			}

			// 합쳐진 분기별 목표도 출력
			if (mergedQuarterlyTargets) {
				console.log("합쳐진 분기별 목표:");
				mergedQuarterlyTargets.forEach((quarterly: QuarterlyTarget) => {
					console.log(
						`Q${quarterly.quarter}: 예산 ${quarterly.budget.toFixed(
							2
						)} tCO2e, 실적 ${quarterly.actual.toFixed(2)} tCO2e`
					);
				});
			}

			console.log("YTD 정보:");
			console.log(`- YTD 예산: ${annualTarget.ytdBudget.toFixed(2)} tCO2e`);
			console.log(`- YTD 실적: ${annualTarget.ytdActual.toFixed(2)} tCO2e`);
			console.log(`- YTD 분산: ${annualTarget.ytdVariance.toFixed(2)} tCO2e`);
			console.log("================================");
		}
	}, [
		annualTarget,
		budgetAllocationData,
		supplierId,
		mergedMonthlyEmissions,
		mergedQuarterlyTargets,
	]);

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

	// 월별 데이터 기반으로 현재까지의 누적 값들 계산
	const currentTotalEmissions = mergedMonthlyEmissions
		? calculateCurrentTotalEmissions(mergedMonthlyEmissions, currentMonth)
		: 0;
	const currentTotalBudget = mergedMonthlyEmissions
		? calculateCurrentTotalBudget(mergedMonthlyEmissions, currentMonth)
		: 0;
	const currentRemainingBudget = mergedMonthlyEmissions
		? calculateCurrentRemainingBudget(mergedMonthlyEmissions, currentMonth)
		: 0;
	const budgetUsageRate =
		currentTotalBudget > 0
			? calculateBudgetUsageRate(currentTotalEmissions, currentTotalBudget)
			: 0;
	const isOverBudget = budgetUsageRate > 100;

	// 전체 연간 예산 (12월 전체 예산)
	const totalAnnualBudget = budgetAllocationData?.totalMonthlyBudget || 0;

	// 디버깅용 콘솔 로그
	console.log("=== 미니 대시보드 계산 결과 ===");
	console.log("현재 월:", currentMonth);
	console.log("현재까지 총 배출량:", currentTotalEmissions);
	console.log("현재까지 총 예산:", currentTotalBudget);
	console.log("현재까지 남은 예산:", currentRemainingBudget);
	console.log("예산 사용률:", budgetUsageRate);
	console.log("전체 연간 예산:", totalAnnualBudget);
	console.log("================================");

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

				{/* 배출량 모니터링 대시보드 */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
					{/* 헤더 */}
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							2025년 배출량 모니터링
						</h2>
						<p className="text-gray-600">
							월별 예산 대비 실제 배출량 현황을 실시간으로 모니터링합니다.
						</p>
					</div>

					{/* 미니 대시보드 */}
					<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
						<StatCard
							icon={<Target className="h-8 w-8 text-purple-600" />}
							label="예산 배출량"
							value={`${totalAnnualBudget.toFixed(1)} tCO2e`}
						/>
						<StatCard
							icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
							label="현재 총배출량"
							value={`${currentTotalEmissions.toFixed(1)} tCO2e`}
						/>
						<StatCard
							icon={<BarChart3 className="h-8 w-8 text-orange-600" />}
							label="남은 예산"
							value={`${currentRemainingBudget.toFixed(1)} tCO2e`}
						/>
						<StatCard
							icon={
								isOverBudget ? (
									<TrendingUp className="h-8 w-8 text-red-600" />
								) : (
									<TrendingDown className="h-8 w-8 text-green-600" />
								)
							}
							label="예산 사용률"
							value={`${budgetUsageRate.toFixed(1)}%`}
						/>
						{annualTarget && (
							<StatCard
								icon={<Target className="h-8 w-8 text-green-600" />}
								label="배분방식"
								value={getAllocationMethodText(annualTarget.allocationMethod)}
								description={getAllocationMethodDescription(
									annualTarget.allocationMethod
								)}
							/>
						)}
					</div>
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
							mergedQuarterlyTargets={mergedQuarterlyTargets || undefined}
						/>

						{/* 차트 섹션 */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<AnnualTrendChart monthlyEmissions={mergedMonthlyEmissions} />
							{mergedQuarterlyTargets && (
								<QuarterlyComparisonChart
									quarterlyTargets={mergedQuarterlyTargets}
								/>
							)}
						</div>

						{/* 월별 배출 실적 테이블 */}
						<MonthlyEmissionTable
							monthlyEmissions={mergedMonthlyEmissions}
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
