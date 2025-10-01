"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
	children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<div className="flex-1 ">
				<Header onMenuClick={() => setSidebarOpen(true)} />

				<main className="py-6">
					<div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
