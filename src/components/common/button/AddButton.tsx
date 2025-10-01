"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
	onClick?: () => void;
	text?: string;
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg" | "icon";
	className?: string;
	disabled?: boolean;
}

export function AddButton({
	onClick,
	text = "새 항목",
	variant = "outline",
	size = "default",
	className = "bg-white/10 border-white/20 text-white hover:bg-white/20",
	disabled = false,
}: AddButtonProps) {
	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={onClick}
			disabled={disabled}>
			<Plus className="h-4 w-4 mr-2" />
			{text}
		</Button>
	);
}
