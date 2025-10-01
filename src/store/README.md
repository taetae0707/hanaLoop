# Emission Store

배출량 관리를 위한 전역 상태 관리 스토어입니다.

## 기술 스택

- **Zustand**: 경량 상태 관리 라이브러리
- **TypeScript**: 타입 안정성 보장
- **LocalStorage**: 데이터 지속성

## 주요 기능

### 1. 목표 배출량 관리

협력사별 목표 배출량을 관리합니다.

```typescript
import { useEmissionStore } from "@/store/emissionStore";

function MyComponent() {
	const { setSupplierTargets, getSupplierTargets, calculateTotalTarget } =
		useEmissionStore();

	// 목표 배출량 설정
	setSupplierTargets("supplier-1", {
		purchasedProducts: 40.0, // 40%
		transportation: 25.0, // 25%
		energy: 25.0, // 25%
		waste: 10.0, // 10%
	});

	// 목표 배출량 조회
	const targets = getSupplierTargets("supplier-1");

	// 총합 계산
	const total = calculateTotalTarget("supplier-1"); // 100.0
}
```

### 2. 자동 목표 배출량 생성

총 목표 배출량을 기반으로 각 항목별 목표를 자동 생성합니다.

```typescript
const { generateTargetsFromTotal, setSupplierTargets } = useEmissionStore();

// 총 목표 배출량: 100.0 tCO2e
const targets = generateTargetsFromTotal(100.0);
// {
//   purchasedProducts: 40.0,  // 40%
//   transportation: 25.0,      // 25%
//   energy: 25.0,              // 25%
//   waste: 10.0,               // 10%
// }

setSupplierTargets("supplier-1", targets);
```

### 3. 배출량 증감 데이터 캐싱

계산된 배출량 증감 데이터를 캐싱하여 성능을 최적화합니다.

```typescript
import { useEmissionStore } from "@/store/emissionStore";
import { calculateEmissionChange } from "@/hooks/useEmissionChange";

function MyComponent() {
	const { setEmissionChanges, getEmissionChanges } = useEmissionStore();

	// 배출량 증감 계산 및 저장
	const change = calculateEmissionChange(currentData, previousData);
	setEmissionChanges("supplier-1", "purchasedProducts", change);

	// 배출량 증감 데이터 조회
	const changes = getEmissionChanges("supplier-1");
	console.log(changes?.purchasedProducts); // EmissionChangeData | null
}
```

## 데이터 구조

### EmissionTargets

```typescript
interface EmissionTargets {
	purchasedProducts: number; // 구매한 제품 및 서비스 목표 (tCO2e)
	transportation: number; // 업스트림 운송 및 유통 목표 (tCO2e)
	energy: number; // 연료 및 에너지 관련 활동 목표 (tCO2e)
	waste: number; // 사업 활동에서 발생한 폐기물 목표 (tCO2e)
}
```

### EmissionChangeData

```typescript
interface EmissionChangeData {
	percent: number; // 증감률 (절대값)
	isIncrease: boolean; // 증가 여부
	current: number; // 현재 월 값
	previous: number; // 전달 월 값
	absoluteChange: number; // 절대 변화량
}
```

## 비율 설정

각 항목별 기본 비율은 다음과 같습니다:

- **구매한 제품 및 서비스**: 40%
- **업스트림 운송 및 유통**: 25%
- **연료 및 에너지 관련 활동**: 25%
- **사업 활동에서 발생한 폐기물**: 10%

이 비율은 `generateTargetsFromTotal` 함수에서 사용됩니다.

## 데이터 지속성

- **LocalStorage 키**: `emission-storage`
- **저장 데이터**: `supplierTargets` (목표 배출량만)
- **세션 데이터**: `emissionChanges` (매번 재계산)

## 디버깅

Redux DevTools를 사용하여 상태 변화를 추적할 수 있습니다.

```typescript
// 상태 초기화
const { reset } = useEmissionStore();
reset();
```

## 예시: 페이지에서 사용

```typescript
import { useEmissionStore } from "@/store/emissionStore";

export default function SupplierPage() {
	const { getSupplierTargets, setSupplierTargets, generateTargetsFromTotal } =
		useEmissionStore();

	useEffect(() => {
		// 목표 배출량이 없으면 생성
		let targets = getSupplierTargets(supplierId);

		if (!targets) {
			targets = generateTargetsFromTotal(totalTargetEmissions);
			setSupplierTargets(supplierId, targets);
		}

		// emissionDetails에 targets 추가
		setEmissionDetails({
			...emissionDetailsData,
			targets: targets,
		});
	}, [supplierId]);

	return <EmissionDetailsTable emissionDetails={emissionDetails} />;
}
```

## 주의사항

1. **총합 검증**: `calculateTotalTarget` 결과가 목표 배출량과 일치하는지 확인
2. **소수점 처리**: 모든 값은 소수점 첫째 자리까지 반올림
3. **타입 안정성**: TypeScript 타입을 활용하여 안전한 데이터 관리

## 추후 확장 가능성

- [ ] 목표 배출량 비율 커스터마이징
- [ ] 배출량 이력 관리
- [ ] 서버 동기화
- [ ] 실시간 업데이트
