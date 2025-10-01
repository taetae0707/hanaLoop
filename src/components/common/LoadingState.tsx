"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";

interface LoadingStateProps {
	message?: string;
	fullScreen?: boolean;
}

export function LoadingState({
	message = "데이터를 불러오는 중...",
	fullScreen = false,
}: LoadingStateProps) {
	const content = (
		<div
			className={`flex items-center justify-center ${
				fullScreen ? "h-screen" : "min-h-[400px]"
			}`}>
			<div className="flex items-center space-x-2">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span className="text-gray-600">{message}</span>
			</div>
		</div>
	);

	if (fullScreen) {
		return <Layout>{content}</Layout>;
	}

	return content;
}
