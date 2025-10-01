# 타입 구조 가이드

이 프로젝트의 타입 정의는 기능별로 분리되어 있습니다.

## 📁 타입 파일 구조

### `/src/types/index.ts`

**기본 공통 타입**

- `Country`: 국가 정보
- `GhgEmission`: 온실가스 배출 데이터
- `Company`: 회사 정보
- `Post`: 포스트/뉴스 정보
- `EmissionSummary`: 배출량 요약
- `MonthlyTrend`: 월별 추이
- `CompanyEmissionSummary`: 회사별 배출량 요약
- `EmissionBySource`: 배출원별 데이터

### `/src/types/supplier-types.ts`

**협력사 관리 관련 타입**

- `Supplier`: 협력사 기본 정보
- `SupplierEmissionDetail`: 협력사 배출 세부 정보
- `SupplierTarget`: 협력사 목표 설정
- `SupplierSummary`: 협력사 요약 통계
- `SupplierFilter`: 협력사 필터링 옵션

### `/src/types/facility-types.ts`

**사업장 관리 관련 타입**

- `Facility`: 사업장 기본 정보
- `EmissionFacility`: 배출시설 정보
- `FacilityEmissionData`: 사업장 배출 데이터
- `FacilityFilter`: 사업장 필터링 옵션
- `FacilitySummary`: 사업장 요약 통계
- `MonthlyEmissionTrend`: 월별 배출 추이

### `/src/types/value-chain-types.ts`

**가치사슬 관리 관련 타입**

- `ValueChain`: 가치사슬 기본 정보
- `ValueChainActivity`: 가치사슬 활동
- `ValueChainPartner`: 가치사슬 파트너
- `ValueChainSummary`: 가치사슬 요약 통계
- `ValueChainFilter`: 가치사슬 필터링 옵션
- `ValueChainEmissionTrend`: 가치사슬 배출 추이

### `/src/types/strategy-types.ts`

**전략 수립 관련 타입**

- `ReductionScenario`: 감축 시나리오
- `ReductionAction`: 감축 액션
- `CarbonCredit`: 탄소배출권
- `StrategySummary`: 전략 요약 통계
- `StrategyFilter`: 전략 필터링 옵션
- `ScenarioROI`: 시나리오 투자수익률

## 🔗 사용 방법

### 협력사 관리 페이지에서 사용

```typescript
import {
	Supplier,
	SupplierEmissionDetail,
	SupplierTarget,
} from "@/types/supplier-types";
```

### 사업장 관리 페이지에서 사용

```typescript
import {
	Facility,
	EmissionFacility,
	FacilityEmissionData,
} from "@/types/facility-types";
```

### 가치사슬 관리 페이지에서 사용

```typescript
import {
	ValueChain,
	ValueChainActivity,
	ValueChainPartner,
} from "@/types/value-chain-types";
```

### 전략 수립 페이지에서 사용

```typescript
import {
	ReductionScenario,
	ReductionAction,
	CarbonCredit,
} from "@/types/strategy-types";
```

### 공통 타입 사용

```typescript
import { Company, Country, GhgEmission } from "@/types";
```

## 📋 타입 확장 가이드

새로운 기능을 추가할 때:

1. **기존 기능 확장**: 해당 타입 파일에 추가
2. **새로운 기능**: 새로운 타입 파일 생성
3. **공통 기능**: `index.ts`에 추가

### 예시: 새로운 타입 추가

```typescript
// supplier-types.ts에 추가
export interface SupplierAudit {
	supplierId: string;
	auditDate: string;
	auditor: string;
	findings: string[];
	recommendations: string[];
	status: "pending" | "completed" | "failed";
}
```

## 🎯 장점

1. **모듈화**: 각 기능별로 타입이 분리되어 관리가 용이
2. **재사용성**: 필요한 타입만 import하여 번들 크기 최적화
3. **확장성**: 새로운 기능 추가 시 기존 코드에 영향 없음
4. **가독성**: 각 파일의 역할이 명확하여 코드 이해가 쉬움
5. **유지보수**: 특정 기능의 타입 수정 시 해당 파일만 수정하면 됨
