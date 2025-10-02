"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Users, Factory, Network, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "대시보드", href: "/", icon: Home },
	{ name: "협력사 관리", href: "/suppliers", icon: Users },
	{ name: "사업장 관리", href: "/facilities", icon: Factory },
	{ name: "가치사슬 관리", href: "/value-chain", icon: Network },
	{ name: "전략 수립", href: "/strategy", icon: Target },
];

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}>
				{/* Logo */}
				<div className="flex items-center h-16 px-6 border-b border-gray-200">
					<Link
						href="/"
						className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
						<div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
							<Image
								src="/hanaloop-logo.png"
								alt="HanaLoop Logo"
								width={32}
								height={32}
								className="object-contain"
							/>
						</div>
						<span className="text-xl font-bold text-gray-900">HanaLoop</span>
					</Link>
				</div>

				{/* Navigation */}
				<nav className="mt-8 px-4">
					<ul className="space-y-2">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={cn(
											"flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
											isActive
												? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										)}
										onClick={() => onClose()}>
										<item.icon
											className={cn(
												"mr-3 h-5 w-5",
												isActive ? "text-blue-700" : "text-gray-400"
											)}
										/>
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}
