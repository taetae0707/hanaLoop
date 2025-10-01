"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
	title?: string;
	message: string;
	actionText?: string;
	actionHref?: string;
	fullScreen?: boolean;
}

export function ErrorState({
	title = "오류가 발생했습니다",
	message,
	actionText,
	actionHref,
	fullScreen = false,
}: ErrorStateProps) {
	const content = (
		<div
			className={`flex items-center justify-center ${
				fullScreen ? "h-screen" : "min-h-[400px]"
			}`}>
			<div className="text-center">
				<AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
				<p className="text-gray-600">{message}</p>
				{actionText && actionHref && (
					<Link href={actionHref}>
						<Button className="mt-4">{actionText}</Button>
					</Link>
				)}
			</div>
		</div>
	);

	if (fullScreen) {
		return <Layout>{content}</Layout>;
	}

	return content;
}
