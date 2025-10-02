# hanaLoop

탄소 배출량 목표 관리 및 추적 시스템

## 프로젝트 개요

hanaLoop는 기업의 탄소 배출량 목표를 설정하고 관리하는 웹 애플리케이션입니다. 연간 목표 설정부터 월별 실적 추적, 협력사별 관리까지 종합적인 탄소 관리 솔루션을 제공합니다.

## 주요 기능

### 🎯 목표 관리

- 연간 탄소 배출량 목표 설정
- 계절별 가중치를 적용한 분기별 배분
- 실시간 진행률 추적 및 시각화

### 📊 실적 관리

- 월별 배출 실적 입력 및 관리
- 누적 배출량 자동 계산
- 목표 대비 차이 분석

### 🤝 협력사 관리

- 협력사별 목표 설정 및 추적
- Scope 3 배출량 관리
- 위험도 평가 및 알림

### 📈 시각화

- 연간 트렌드 차트
- 분기별 비교 차트
- 실시간 대시보드

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js
- **Icons**: Lucide React

## 시작하기

### 설치

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```
