const path = require("path");
const resolve = (p) => {
	return path.resolve(__dirname, p);
};
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html", 
		"./pages/**/*.vue", 
		"./pages/**/*.nvue",
		"./components/**/*.vue",
		"./components/**/*.nvue"
		].map(resolve),
	theme: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
};