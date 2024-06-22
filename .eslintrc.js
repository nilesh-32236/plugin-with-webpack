module.exports = {
	parser: '@babel/eslint-parser',
	parserOptions: {
		requireConfigFile: false,
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			modules: true,
		},
	},
	env: {
		browser: true,
		es6: true,
		jquery: true,
		mocha: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@wordpress/eslint-plugin/recommended-with-formatting',
	],
	plugins: [
		"align-assignments"
	],
	globals: {
		"wp": false,
		"ajaxurl": false,
		"pmNonceAjaxObject": false,
	},
	rules: {
		// Formatting Rules
		'indent': [ 'error', 'tab' ],     // Use tab for indentation
		'quotes': [ 'error', 'single' ],  // Use single quotes
		'semi': [ 'error', 'always' ],    // Use semicolons at the end of statements
		'no-alert': 1,
		'no-console': 0,
		'no-unused-vars': 1,
		'no-undef': 1,
		'no-multi-spaces': 0,
		'align-assignments/align-assignments': [2, { "requiresOnly": false }],
		// Yoda Condition
		'yoda': [ 'error', 'always' ],
	},
};