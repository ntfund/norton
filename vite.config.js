import path from "path";
import {
	defineConfig
} from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// import vwt from "weapp-tailwindcss-webpack-plugin/vite";
// import postcssWeappTailwindcssRename from "weapp-tailwindcss-webpack-plugin/postcss";

// import {
// 	nodeModulesPolyfillPlugin
// } from 'esbuild-plugins-node-modules-polyfill';


const isH5 = process.env.UNI_PLATFORM === "h5";

// vite 插件配置，注意一定要把 uni 注册在 vwt 前
const vitePlugins = [
	uni(),
	// nodeModulesPolyfillPlugin({
	// 	globals: {
	// 		process: true,
	// 		Buffer: true,
	// 	},
	// 	modules: ['crypto', 'ethers'],
	// }),
];

const resolve = (p) => {
	return path.resolve(__dirname, p);
};

const postcssPlugins = [
	require("autoprefixer")(),
	require("tailwindcss")({
		config: resolve("./tailwind.config.js"),
	}),
];
// if (!isH5) {
// 	vitePlugins.push(vwt());
// 	postcssPlugins.push(postcssWeappTailwindcssRename({}));
// }
// https://vitejs.dev/config/
export default defineConfig({
	plugins: vitePlugins,
	css: {
		postcss: {
			// 内联写法
			plugins: postcssPlugins,
		},
	},
	// 设置路径别名
	resolve: {
		alias: [{
			find: '@',
			replacement: path.resolve('./')
		}]
	},
	alias: {
		'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
	}
});