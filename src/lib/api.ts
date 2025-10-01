import {
	companies,
	posts,
	countries,
	suppliers,
	supplierEmissionDetails,
	supplierTargets,
	upstreamEmissionDetails,
} from "./data";
import {
	Company,
	Post,
	Country,
	EmissionSummary,
	MonthlyTrend,
	CompanyEmissionSummary,
	EmissionBySource,
} from "@/types";
import {
	Supplier,
	SupplierEmissionDetail,
	SupplierTarget,
} from "@/types/supplier-types";
import { UpstreamEmissionDetails } from "@/types/upstream-types";

// Mock 데이터 복사본 (수정 가능하도록)
const _countries = [...countries];
const _companies = [...companies];
let _posts = [...posts];
const _suppliers = [...suppliers];
const _supplierEmissionDetails = [...supplierEmissionDetails];
const _supplierTargets = [...supplierTargets];
const _upstreamEmissionDetails = [...upstreamEmissionDetails];

// 유틸리티 함수들
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

// 기본 API 함수들 (과제에서 제공된 것)
export async function fetchCountries(): Promise<Country[]> {
	await delay(jitter());
	return _countries;
}

export async function fetchCompanies(): Promise<Company[]> {
	await delay(jitter());
	return _companies;
}

export async function fetchPosts(): Promise<Post[]> {
	await delay(jitter());
	return _posts;
}

export async function createOrUpdatePost(
	p: Omit<Post, "id"> & { id?: string }
): Promise<Post> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Save failed");

	if (p.id) {
		_posts = _posts.map((x) => (x.id === p.id ? (p as Post) : x));
		return p as Post;
	}

	const created = { ...p, id: crypto.randomUUID() };
	_posts = [..._posts, created];
	return created;
}

// 대시보드용 추가 API 함수들
export async function fetchEmissionSummary(): Promise<EmissionSummary> {
	await delay(jitter());

	const allEmissions = _companies.flatMap((company) => company.emissions);
	const totalEmissions = allEmissions.reduce(
		(sum, emission) => sum + emission.emissions,
		0
	);
	const targetEmissions = totalEmissions * 0.85; // 15% 감축 목표

	const scope1 = allEmissions
		.filter((e) => e.scope === 1)
		.reduce((sum, e) => sum + e.emissions, 0);
	const scope2 = allEmissions
		.filter((e) => e.scope === 2)
		.reduce((sum, e) => sum + e.emissions, 0);
	const scope3 = allEmissions
		.filter((e) => e.scope === 3)
		.reduce((sum, e) => sum + e.emissions, 0);

	return {
		totalEmissions: Math.round(totalEmissions * 100) / 100,
		targetEmissions: Math.round(targetEmissions * 100) / 100,
		achievementRate:
			Math.round((targetEmissions / totalEmissions) * 100 * 100) / 100,
		scope1: Math.round(scope1 * 100) / 100,
		scope2: Math.round(scope2 * 100) / 100,
		scope3: Math.round(scope3 * 100) / 100,
	};
}

export async function fetchMonthlyTrends(): Promise<MonthlyTrend[]> {
	await delay(jitter());

	const monthlyData: { [key: string]: number } = {};

	_companies.forEach((company) => {
		company.emissions.forEach((emission) => {
			if (!monthlyData[emission.yearMonth]) {
				monthlyData[emission.yearMonth] = 0;
			}
			monthlyData[emission.yearMonth] += emission.emissions;
		});
	});

	const trends: MonthlyTrend[] = Object.entries(monthlyData)
		.map(([yearMonth, actual]) => ({
			yearMonth,
			actual: Math.round(actual * 100) / 100,
			target: Math.round(actual * 0.85 * 100) / 100, // 15% 감축 목표
			forecast:
				yearMonth >= "2024-07"
					? Math.round(actual * 0.9 * 100) / 100
					: undefined, // 미래 예측
		}))
		.sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

	return trends;
}

export async function fetchCompanyEmissionSummaries(): Promise<
	CompanyEmissionSummary[]
> {
	await delay(jitter());

	return _companies.map((company) => {
		const totalEmissions = company.emissions.reduce(
			(sum, emission) => sum + emission.emissions,
			0
		);

		// 최근 2개월 데이터로 변화율 계산
		const recentMonths = company.emissions.reduce((acc, emission) => {
			if (!acc[emission.yearMonth]) acc[emission.yearMonth] = 0;
			acc[emission.yearMonth] += emission.emissions;
			return acc;
		}, {} as { [key: string]: number });

		const monthKeys = Object.keys(recentMonths).sort();
		const lastMonth = monthKeys[monthKeys.length - 1];
		const prevMonth = monthKeys[monthKeys.length - 2];

		const monthlyChange = prevMonth
			? ((recentMonths[lastMonth] - recentMonths[prevMonth]) /
					recentMonths[prevMonth]) *
			  100
			: 0;

		// 리스크 레벨 결정
		let riskLevel: "low" | "medium" | "high" = "low";
		if (totalEmissions > 800) riskLevel = "high";
		else if (totalEmissions > 400) riskLevel = "medium";

		return {
			companyId: company.id,
			companyName: company.name,
			totalEmissions: Math.round(totalEmissions * 100) / 100,
			monthlyChange: Math.round(monthlyChange * 100) / 100,
			riskLevel,
		};
	});
}

export async function fetchEmissionsBySource(): Promise<EmissionBySource[]> {
	await delay(jitter());

	const sourceData: { [key: string]: { emissions: number; scope: 1 | 2 | 3 } } =
		{};

	_companies.forEach((company) => {
		company.emissions.forEach((emission) => {
			if (!sourceData[emission.source]) {
				sourceData[emission.source] = { emissions: 0, scope: emission.scope };
			}
			sourceData[emission.source].emissions += emission.emissions;
		});
	});

	const totalEmissions = Object.values(sourceData).reduce(
		(sum, data) => sum + data.emissions,
		0
	);

	return Object.entries(sourceData)
		.map(([source, data]) => ({
			source,
			emissions: Math.round(data.emissions * 100) / 100,
			percentage:
				Math.round((data.emissions / totalEmissions) * 100 * 100) / 100,
			scope: data.scope,
		}))
		.sort((a, b) => b.emissions - a.emissions);
}

// 협력사 관련 API 함수들
export async function fetchSuppliers(): Promise<Supplier[]> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to fetch suppliers");
	return _suppliers;
}

export async function fetchSupplierById(id: string): Promise<Supplier | null> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to fetch supplier");
	return _suppliers.find((s) => s.id === id) || null;
}

export async function fetchSupplierEmissionDetails(
	supplierId: string
): Promise<SupplierEmissionDetail[]> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to fetch supplier emission details");
	return _supplierEmissionDetails.filter((d) => d.supplierId === supplierId);
}

export async function fetchSupplierTarget(
	supplierId: string
): Promise<SupplierTarget | null> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to fetch supplier target");
	return _supplierTargets.find((t) => t.supplierId === supplierId) || null;
}

export async function updateSupplierTarget(
	supplierId: string,
	target: Partial<SupplierTarget>
): Promise<SupplierTarget> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to update supplier target");

	const index = _supplierTargets.findIndex((t) => t.supplierId === supplierId);
	if (index === -1) throw new Error("Supplier target not found");

	_supplierTargets[index] = { ..._supplierTargets[index], ...target };
	return _supplierTargets[index];
}

// Upstream Scope 3 근거 자료 관련 API 함수들
export async function fetchUpstreamEmissionDetails(
	supplierId: string
): Promise<UpstreamEmissionDetails | null> {
	await delay(jitter());
	if (maybeFail()) throw new Error("Failed to fetch upstream emission details");

	const details = _upstreamEmissionDetails.find(
		(d) => d.supplierId === supplierId
	);
	return details || null;
}
