import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// 터보팩 비활성화
	experimental: {
		turbo: false,
	},

	// 성능 최적화
	swcMinify: true,

	// 이미지 최적화
	images: {
		domains: [],
		formats: ["image/webp", "image/avif"],
	},

	// 컴파일러 최적화
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},

	// 번들 분석 (개발 시에만)
	...(process.env.ANALYZE === "true" && {
		webpack: (config: any) => {
			config.plugins.push(
				new (require("webpack-bundle-analyzer").BundleAnalyzerPlugin)()
			);
			return config;
		},
	}),
};

export default nextConfig;
