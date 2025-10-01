"use client";

import React from "react";
// import { AddButton } from "./addButton";
// import { FileExportButton } from "./FileExportButton";

interface PageHeaderProps {
	title: string;
	description: string;
	// actions?: React.ReactNode;
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
				<div>
					<h1 className="text-2xl font-bold mb-2">{title}</h1>
					<p className="text-blue-200">{description}</p>
				</div>
				{/* {actions && <div className="flex space-x-2">{actions}</div>} */}
			</div>
		</div>
	);
}
