import { CompanyTargetManagement, AnnualTarget } from "@/types/target-types";

/** 회사 목표에서 특정 연도의 인덱스를 찾음 */
export function findTargetIndex(
	companyTarget: CompanyTargetManagement,
	year: number
): number {
	return companyTarget.targets.findIndex((t) => t.year === year);
}

/** 회사 목표 업데이트 (기존 회사가 있는 경우) */
export function updateExistingCompanyTarget(
	state: { companyTargets: { [companyId: string]: CompanyTargetManagement } },
	companyId: string,
	updatedTarget: AnnualTarget
): { companyTargets: { [companyId: string]: CompanyTargetManagement } } {
	const companyTarget = state.companyTargets[companyId];
	const existingTargetIndex = findTargetIndex(
		companyTarget,
		updatedTarget.year
	);
	const updatedTargets = [...companyTarget.targets];

	if (existingTargetIndex >= 0) {
		updatedTargets[existingTargetIndex] = updatedTarget;
	} else {
		updatedTargets.push(updatedTarget);
	}

	return {
		companyTargets: {
			...state.companyTargets,
			[companyId]: {
				...companyTarget,
				targets: updatedTargets,
			},
		},
	};
}

/** 새 회사 목표 추가 */
export function addNewCompanyTarget(
	state: { companyTargets: { [companyId: string]: CompanyTargetManagement } },
	companyId: string,
	target: AnnualTarget
): { companyTargets: { [companyId: string]: CompanyTargetManagement } } {
	return {
		companyTargets: {
			...state.companyTargets,
			[companyId]: {
				companyId,
				companyName: companyId, // 실제로는 API에서 가져와야 함
				targets: [target],
				currentYear: target.year,
			},
		},
	};
}

/** 회사 목표 업데이트 또는 추가 (통합 함수) */
export function upsertCompanyTarget(
	state: { companyTargets: { [companyId: string]: CompanyTargetManagement } },
	companyId: string,
	target: AnnualTarget
): { companyTargets: { [companyId: string]: CompanyTargetManagement } } {
	const companyTarget = state.companyTargets[companyId];

	if (companyTarget) {
		return updateExistingCompanyTarget(state, companyId, target);
	} else {
		return addNewCompanyTarget(state, companyId, target);
	}
}
