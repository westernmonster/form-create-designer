module.exports = {
    'presets': [
        ['@vue/cli-plugin-babel/preset', {
            'useBuiltIns': false,
            'targets': {
                'esmodules': true
            }
        }]
    ],
    'plugins': [
        '@vue/babel-plugin-jsx',
        '@babel/plugin-transform-optional-chaining',
        '@babel/plugin-transform-nullish-coalescing-operator'
    ]
}
