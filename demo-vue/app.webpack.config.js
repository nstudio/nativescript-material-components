const webpackConfig = require('./webpack.config.js');
const { readFileSync } = require('fs');
const { relative, resolve } = require('path');
const nsWebpack = require('@nativescript/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const NsVueTemplateCompiler = require('nativescript-vue-template-compiler');

// temporary hack to support v-model using ns-vue-template-compiler
// See https://github.com/nativescript-vue/nativescript-vue/issues/371
NsVueTemplateCompiler.registerElement('MDTextField', () => require('@nativescript-community/ui-material-textfield').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
NsVueTemplateCompiler.registerElement('MDTextView', () => require('@nativescript-community/ui-material-textview').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
NsVueTemplateCompiler.registerElement('MDSlider', () => require('@nativescript-community/ui-material-slider').Slider, {
    model: {
        prop: 'value',
        event: 'valueChange'
    }
});
module.exports = (env, params = {}) => {
    const {
        appPath = 'app',
        appResourcesPath = 'app/App_Resources',
        hmr, // --env.hmr
        production, // --env.production
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        inlineSourceMap, // --env.inlineSourceMap
        development, // --env.development
        verbose, // --env.verbose
        uglify // --env.uglify
    } = env;
    const config = webpackConfig(env, params);
    const mode = production ? 'production' : 'development';
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const tsconfig = 'tsconfig.json';
    const projectRoot = params.projectRoot || __dirname;
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    if (!!development) {
        const srcFullPath = resolve(projectRoot, '..', 'src');
        Object.assign(config.resolve.alias, {
            '#': srcFullPath,
            '@nativescript-community/ui-material-core$': '#/core/index.' + platform,
            '@nativescript-community/ui-material-core/android/utils$': '#/core/android/utils',
            '@nativescript-community/ui-material-core/cssproperties$': '#/core/cssproperties',
            '@nativescript-community/ui-material-core/textbase/cssproperties$': '#/core/textbase/cssproperties',

            '@nativescript-community/ui-material-bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,
            '@nativescript-community/ui-material-bottomsheet/vue$': '#/bottomsheet/vue/index',
            '@nativescript-community/ui-material-bottomsheet/bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,
            '../bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,

            '@nativescript-community/ui-material-bottomnavigationbar$': '#/bottomnavigationbar/bottomnavigationbar.' + platform,
            '@nativescript-community/ui-material-bottomnavigationbar/vue$': '#/bottomnavigationbar/vue/index',
            '@nativescript-community/ui-material-bottomnavigationbar/bottomnavigationbar$': '#/bottomnavigationbar/bottomnavigationbar.' + platform,
            '../bottomnavigationbar$': '#/bottomnavigationbar/bottomnavigationbar.' + platform,

            '@nativescript-community/ui-material-progress$': '#/progress/progress.' + platform,
            '@nativescript-community/ui-material-progress/vue$': '#/progress/vue/index',
            '@nativescript-community/ui-material-progress/progress$': '#/progress/progress.' + platform,
            '../progress$': '#/progress/progress.' + platform,

            '@nativescript-community/ui-material-cardview$': '#/cardview/cardview.' + platform,
            '@nativescript-community/ui-material-cardview/vue$': '#/cardview/vue/index',
            '@nativescript-community/ui-material-cardview/cardview$': '#/cardview/cardview.' + platform,
            '../cardview$': '#/cardview/cardview.' + platform,

            '@nativescript-community/ui-material-slider$': '#/slider/slider.' + platform,
            '@nativescript-community/ui-material-slider/vue$': '#/slider/vue/index',
            '@nativescript-community/ui-material-slider/slider$': '#/slider/slider.' + platform,
            '../slider$': '#/slider/slider.' + platform,

            '@nativescript-community/ui-material-button$': '#/button/button.' + platform,
            '@nativescript-community/ui-material-button/vue$': '#/button/vue/index',
            '@nativescript-community/ui-material-button/button$': '#/button/button.' + platform,
            '../button$': '#/button/button.' + platform,

            '@nativescript-community/ui-material-speeddial$': '#/speeddial/index',
            '@nativescript-community/ui-material-speeddial/vue$': '#/speeddial/vue/index',

            '@nativescript-community/ui-material-tabs$': '#/tabs/tabs.' + platform,
            '@nativescript-community/ui-material-tabs/vue$': '#/tabs/vue/index',
            '@nativescript-community/ui-material-tabs/tabs$': '#/tabs/button.' + platform,
            '../tabs$': '#/tabs/tabs.' + platform,

            '@nativescript-community/ui-material-textfield$': '#/textfield/textfield',
            '@nativescript-community/ui-material-textfield': '#/textfield',

            '@nativescript-community/ui-material-textview$': '#/textview/textview',
            '@nativescript-community/ui-material-textview': '#/textview',

            '@nativescript-community/ui-material-floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,
            '@nativescript-community/ui-material-floatingactionbutton/vue$': '#/floatingactionbutton/vue/index',
            '@nativescript-community/ui-material-floatingactionbutton/floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,
            '../floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,

            '@nativescript-community/ui-material-activityindicator$': '#/activityindicator/index.' + platform,
            '@nativescript-community/ui-material-activityindicator/vue$': '#/activityindicator/vue/index',
            '@nativescript-community/ui-material-activityindicator/activityindicator$': '#/activityindicator/index.' + platform,
            '../activityindicator$': '#/activityindicator/index.' + platform,

            '@nativescript-community/ui-material-ripple$': '#/ripple/ripple.' + platform,
            '@nativescript-community/ui-material-ripple/vue$': '#/ripple/vue/index',
            '@nativescript-community/ui-material-ripple/ripple$': '#/ripple/ripple.' + platform,
            '../ripple$': '#/ripple/ripple.' + platform,

            '@nativescript-community/ui-material-dialogs$': '#/dialogs/dialogs.' + platform,
            '@nativescript-community/ui-material-dialogs/dialogs$': '#/dialogs/dialogs.' + platform,

            '@nativescript-community/ui-material-snackbar$': '#/snackbar/snackbar.' + platform,
            '@nativescript-community/ui-material-snackbar/snackbar$': '#/snackbar/snackbar.' + platform,
            './snackbar$': '#/snackbar/snackbar.' + platform
        });
        console.log(config.resolve.alias);
    }
    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);
    // const forecastSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'css/forecastfont.scss')).toString());
    // const forecastIcons = JSON.parse(`{${forecastSymbols.variables[forecastSymbols.variables.length - 1].value.replace(/'forecastfont-(\w+)' (F|f|0)(.*?)([,\n]|$)/g, '"$1": "$2$3"$4')}}`);

    // const weatherIconsCss = resolve(projectRoot, 'css/weather-icons/weather-icons-variables.scss');
    // const weatherSymbols = symbolsParser.parseSymbols(readFileSync(weatherIconsCss).toString()).imports.reduce(function (acc, value) {
    //     return acc.concat(symbolsParser.parseSymbols(readFileSync(resolve(dirname(weatherIconsCss), value.filepath)).toString()).variables);
    // }, []);
    // // console.log('weatherSymbols', weatherSymbols);
    // const weatherIcons = weatherSymbols.reduce(function (acc, value) {
    //     acc[value.name.slice(1)] = '\\u' + value.value.slice(2, -1);
    //     return acc;
    // }, {});
    const scssPrepend = `$mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};`;

    const css2jsonLoaderRuleIndex = config.module.rules.findIndex(r => r.use && r.use.loader === 'css-loader');
    const scssLoaderRuleIndex = config.module.rules.findIndex(r => Array.isArray(r.use) && r.use.indexOf('sass-loader') !== -1);
    config.module.rules.splice(scssLoaderRuleIndex, 1);
    config.module.rules.splice(
        css2jsonLoaderRuleIndex,
        0,
        {
            test: /\.scss$/,
            exclude: /\.module\.scss$/,
            use: [
                {
                    loader: '@nativescript/webpack/helpers/css2json-loader',
                    options: { useForImports: true }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        },
        {
            test: /\.module\.scss$/,
            use: [
                { loader: 'css-loader', options: { url: false } },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: false,
                        additionalData: scssPrepend
                    }
                }
            ]
        }
    );
    const indexOfTsLoaderRule = config.module.rules.findIndex(r => r.loader === 'ts-loader');
    config.module.rules[indexOfTsLoaderRule].options.transpileOnly = true;
    // config.module.rules[indexOfTsLoaderRule].use.options.getCustomTransformers = (program) => ({
    //     before: [nativeClassTransformer],
    // });
    // const mjsRule = {
    //     test: /\.m?js$/,
    //     use: {
    //         loader: 'babel-loader',
    //         options: {
    //             presets: [
    //                 [
    //                     '@babel/preset-env',
    //                     {
    //                         useBuiltIns: 'entry',
    //                         exclude: ['@babel/plugin-transform-regenerator'],
    //                         modules:'commonjs',
    //                     },
    //                 ],
    //             ],
    //         },
    //     },
    // };

    config.module.rules.push({
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|vue)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z-]+)',
                    replace: (match, p1, offset, str) => {
                        if (mdiIcons[p1]) {
                            return String.fromCharCode(parseInt(mdiIcons[p1], 16));
                        }
                        return match;
                    },
                    flags: 'g'
                }
            }
        ]
    });

    // // we remove default rules
    config.plugins = config.plugins.filter(p => ['CopyWebpackPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    config.plugins.unshift(
        new CopyWebpackPlugin([
                { from: 'fonts/!(ios|android)/**/*', to: 'fonts', flatten: true, noErrorOnMissing: true },
                { from: 'fonts/*', to: 'fonts', flatten: true, noErrorOnMissing: true },
                { from: `fonts/${platform}/**/*`, to: 'fonts', flatten: true, noErrorOnMissing: true },
                {
                    from: '**/*.+(jpg|png)',
                    globOptions: {
                        ignore: [`${relative(appPath, appResourcesFullPath)}/**`]
                    },
                    noErrorOnMissing: true
                },
                { from: 'assets/**/*', noErrorOnMissing: true },
                {
                    from: '../node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
                    to: 'fonts',
                    noErrorOnMissing: true
                }
            ])
    );

    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                tsconfig: resolve(tsconfig),
                async: false,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                memoryLimit: 4096,
                workers: 1
            })
        );
    }

    return config;
};
