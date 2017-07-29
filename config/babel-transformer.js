const babel = require('babel-core');

/**
 * This is your `.babelrc` equivalent.
 */
const babelRC = {
	presets: ['react-native'],
	// sourceMaps: true, // Enabling this slows down the chrome debugger by A LOT.
	plugins: [

		// The following plugin will rewrite imports. Reimplementations of node
		// libraries such as `assert`, `buffer`, etc. will be picked up
		// automatically by the React Native packager.  All other built-in node
		// libraries get rewritten to their browserify counterpart.

		["module-resolver", {
      alias: {
        crypto: 'react-native-crypto',
				stream: 'stream-browserify',
				vm: 'vm-browserify',
      },
    }],

		// The following is also an option, but `babel-plugin-rewrite-require` is less popular than `babel-plugin-module-resolver`.
		// See: https://stackoverflow.com/questions/40629856/can-we-use-nodejs-code-inside-react-native-application/45207249#45207249
		// [require('babel-plugin-rewrite-require'), {
		// 	aliases: {
		// 		crypto: 'react-native-crypto',
		// 		stream: 'stream-browserify',
		// 		vm: 'vm-browserify',
		// 		// constants: 'constants-browserify',
		// 		// dns: 'node-libs-browser/mock/dns',
		// 		// domain: 'domain-browser',
		// 		// fs: 'node-libs-browser/mock/empty',
		// 		// http: 'stream-http',
		// 		// https: 'https-browserify',
		// 		// net: 'node-libs-browser/mock/net',
		// 		// os: 'os-browserify/browser',
		// 		// path: 'path-browserify',
		// 		// querystring: 'querystring-es3',
		// 		// _stream_duplex: 'readable-stream/duplex',
		// 		// _stream_passthrough: 'readable-stream/passthrough',
		// 		// _stream_readable: 'readable-stream/readable',
		// 		// _stream_transform: 'readable-stream/transform',
		// 		// _stream_writable: 'readable-stream/writable',
		// 		// sys: 'util',
		// 		// timers: 'timers-browserify',
		// 		// tls: 'node-libs-browser/mock/tls',
		// 		// tty: 'tty-browserify',
		// 		// zlib: 'browserify-zlib'
		// 	},
		// 	throwForNonStringLiteral: true
		// }],
	]
};

module.exports = (src, filename) => {

	const babelConfig = Object.assign({}, babelRC, {
		filename,
		sourceFileName: filename
	});

	const result = babel.transform(src, babelConfig);
	return {
		ast: result.ast,
		code: result.code,
		map: result.map,
		filename
	};
}
