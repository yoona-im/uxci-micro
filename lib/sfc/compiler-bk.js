
const args = process.argv
const srcNm = args[2]
const VueComponentCompiler = require('@vue/component-compiler');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const VueCompiler = VueComponentCompiler.createDefaultCompiler();
const vComponent = VueCompiler.compileToDescriptor(srcNm, fs.readFileSync(path.resolve(srcNm), 'utf8'));
const assembledComponent = VueComponentCompiler.assemble(VueCompiler, srcNm, vComponent);

const code = babel.transformSync(assembledComponent.code, {
    presets: [
        '@vue/babel-preset-jsx'
    ]
}).code;

const stdout = process.stdout;

stdout.setEncoding("utf8")
stdout.write(code)