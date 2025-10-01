"use client";

import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
	label: string;
	href?: string;
	isActive?: boolean;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
	separator?: string;
}

export function Breadcrumb({
	items,
	className = "text-sm text-gray-600",
	separator = "›",
}: BreadcrumbProps) {
	return (
		<nav className={className}>
			{items.map((item, index) => (
				<React.Fragment key={index}>
					{item.href && !item.isActive ? (
						<Link
							href={item.href}
							className="text-gray-600 hover:text-gray-800 hover:underline">
							{item.label}
						</Link>
					) : (
						<span
							className={
								item.isActive ? "text-blue-600 font-medium" : "text-gray-600"
							}>
							{item.label}
						</span>
					)}
					{index < items.length - 1 && (
						<span className="mx-2">{separator}</span>
					)}
				</React.Fragment>
			))}
		</nav>
	);
}
