const commonConfig = require('./webpack.config.common.js');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin   = require('extract-text-webpack-plugin');
const helpers             = require('./scripts/helpers');
const LoaderOptionsPlugin = require('webpack/lib/NoErrorsPlugin');
const NoErrorsPlugin = require('webpack/lib/NoErrorsPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');
const UglifyJsPlugin = require ('webpack/lib/optimize/UglifyJsPlugin');
const webpackMerge   = require('webpack-merge');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  /**
   * Wheren the assets will be built
   */
  output: {
    path: helpers.root('../','dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  module: {
    rules: [
      /**
       * compile angular using AoT
       */
      { test: /\.ts$/, use: '@ngtools/webpack' },
      /**
       * extract general styles to create a chuck
       */
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!postcss-loader!sass-loader'
          }),
        exclude: [ helpers.root('..', 'src', 'app') ]
      }
    ]
  },

  plugins: [
    new ngToolsWebpack.AotPlugin({
      tsConfigPath: helpers.root('..','tsconfig-aot.json'),
      entryModule: helpers.root('..','src/app/app.module#AppModule')
    }),
    /**
     * create css chuck with general styles
     */
    new ExtractTextPlugin('assets/stylesheets/[name].[hash].css'),
    /**
     * minify CSS code
     */
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    /**
     * remove webpack erros
     */
    new NoErrorsPlugin(),
    /**
     * uglifyJS
     */
    new UglifyJsPlugin({
      beautify: false, //prod
      output: {
        comments: false
      }, //prod
      mangle: {
        screw_ie8: true
      }, //prod
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false // we need this for lazy v8
      }
    }),
    /**
     * pass options to uglifyJS
     */
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    /**
     * define process.env variable in scripts
     */
    new DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
