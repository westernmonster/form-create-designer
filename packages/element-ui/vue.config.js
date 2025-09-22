/*
 * @Author       : djkloop
 * @Date         : 2020-08-15 21:16:03
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-09-21 17:18:46
 * @Description  : 头部注释
 * @FilePath     : /form-create2/packages/element-ui/vue.config.js
 */
module.exports = {
    pages: {
        app: {
            entry: 'examples/main.js',
            template: 'examples/index.html',
            filename: 'index.html'
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                'naive-ui': require.resolve('naive-ui/es/index.mjs')
            }
        },
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        esmodules: true
                                    }
                                }]
                            ],
                            plugins: [
                                '@babel/plugin-transform-optional-chaining',
                                '@babel/plugin-transform-nullish-coalescing-operator'
                            ]
                        }
                    }
                }
            ]
        }
    }
}
