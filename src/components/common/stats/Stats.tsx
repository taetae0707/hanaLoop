"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	className?: string;
}

export function StatCard({
	icon,
	label,
	value,
	className = "",
}: StatCardProps) {
	return (
		<Card className={`p-4 ${className}`}>
			<div className="flex items-center">
				<div className="flex-shrink-0">{icon}</div>
				<div className="ml-4">
					<p className="text-sm font-medium text-gray-500">{label}</p>
					<p className="text-2xl font-semibold text-gray-900">{value}</p>
				</div>
			</div>
		</Card>
	);
}
