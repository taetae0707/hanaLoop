"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileExportButtonProps {
	onClick?: () => void;
	text?: string;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg" | "icon";
	className?: string;
	disabled?: boolean;
	fileType?: "CSV" | "Excel" | "PDF" | "JSON";
}

export function FileExportButton({
	onClick,
	text,
	variant = "outline",
	size = "default",
	className = "bg-white/10 border-white/20 text-white hover:bg-white/20",
	disabled = false,
	fileType = "CSV",
}: FileExportButtonProps) {
	const defaultText = text || `${fileType} 내보내기`;

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={onClick}
			disabled={disabled}>
			<Download className="h-4 w-4 mr-2" />
			{defaultText}
		</Button>
	);
}
