// 협력사 관련 유틸리티 함수들

export const getRiskLevelColor = (riskLevel: string) => {
	switch (riskLevel) {
		case "normal":
			return "text-green-600 bg-green-50 border-green-200";
		case "warning":
			return "text-yellow-600 bg-yellow-50 border-yellow-200";
		case "danger":
			return "text-red-600 bg-red-50 border-red-200";
		default:
			return "text-gray-600 bg-gray-50 border-gray-200";
	}
};

export const getRiskLevelText = (riskLevel: string) => {
	switch (riskLevel) {
		case "normal":
			return "정상";
		case "warning":
			return "관리요망";
		case "danger":
			return "위험";
		default:
			return "알 수 없음";
	}
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "text-green-600 bg-green-50";
		case "draft":
			return "text-yellow-600 bg-yellow-50";
		case "inactive":
			return "text-gray-600 bg-gray-50";
		default:
			return "text-gray-600 bg-gray-50";
	}
};

export const getStatusText = (status: string) => {
	switch (status) {
		case "active":
			return "활성";
		case "draft":
			return "초안";
		case "inactive":
			return "비활성";
		default:
			return "알 수 없음";
	}
};
