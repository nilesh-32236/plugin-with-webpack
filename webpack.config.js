const path = require('path');

const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const glob = require('glob');

module.exports = {
	entry: getEntries(
		[path.resolve(__dirname, 'admin'), path.resolve(__dirname, 'public')],
		['.js', '.png', '.jpg', '.jpeg', 'gif', 'svg']
	),
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|vendor)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				// include: [path.resolve(__dirname, 'admin/img')],
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'images',
						},
					},
				],
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'commons',
					chunks: 'all',
				},
			},
		},
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
			new CssMinimizerPlugin(),
		],
	},
	mode: 'production',
	devtool: 'source-map',
	resolve: {
		modules: [
			path.resolve(__dirname, 'admin/js'),
			path.resolve(__dirname, 'public/js'),
			'node_modules',
		],
		extensions: ['.js', '.scss'],
	},
	externals: {
		jquery: 'jQuery',
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: ({ chunk }) => {
				const name = chunk.name.replace(/js/, 'css') + '.bundle.css';
				return name;
			},
		}),
		new ESLintWebpackPlugin(),
		new ImageminWebpWebpackPlugin({
			config: [{
				test: /\.(jpe?g|png)/,
				options: {
					quality: 75
				}
			}],
			overrideExtension: true,
			detailedLogs: false,
			silent: false,
			strict: true,
		}),
	],
};

function getEntries(directories, extensions) {
	const entry = {};
	const excludeDirectories = ['js/component'];
	const excludeFiles = ['util'];

	console.log(directories);
	directories.forEach((directory) => {
		extensions.forEach((extension) => {
			const files = glob.sync(path.join(directory, `**/*${extension}`));

			console.log(files);
			files.forEach((file) => {
				const relativePath = path.relative(directory, file);
				const entryName = path.join(path.basename(directory), relativePath.replace(extension, ''));

				if (!excludeFiles.some(excludeFile => entryName.includes(excludeFile)) &&
					!excludeDirectories.some(excludeDir => relativePath.includes(excludeDir))) {
					entry[entryName] = file;
				}
			});
		});
	});

	return entry;
}