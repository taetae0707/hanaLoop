"use client";

import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
	onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	return (
		<header className="bg-white shadow-sm border-b border-gray-200">
			<div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
				{/* 왼쪽: 메뉴 버튼 */}
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						onClick={onMenuClick}
						className="lg:hidden">
						<Menu className="h-5 w-5" />
					</Button>
					<div className="ml-4 lg:ml-0">
						<h1 className="text-xl font-semibold text-gray-900">
							하나루프 대시보드
						</h1>
					</div>
				</div>

				{/* 오른쪽: 알림, 사용자 메뉴 */}
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="sm">
						<Bell className="h-5 w-5 text-gray-600" />
					</Button>
					<Button
						variant="ghost"
						size="sm">
						<User className="h-5 w-5 text-gray-600" />
					</Button>
				</div>
			</div>
		</header>
	);
}
