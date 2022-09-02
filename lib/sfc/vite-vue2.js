const {build} = require('vite')
const path = require("path")
const vue = require("@vitejs/plugin-vue2");
const vueJsx = require("@vitejs/plugin-vue-jsx");

const args = process.argv
const srcNm = path.resolve(args[2])
const sfcOutputStartPlaceholder = "*vfc_code*"

;(async () => {
       let result = await build({
            plugins: [
                vueJsx(),
                vue()
            ],
            build:{
                lib: {
                    entry: srcNm,
                    formats:["es"],
                    fileName:path.basename(srcNm)
                },
                rollupOptions:{
                    external: (id,parent,resolved) =>{
                        if (!parent || id.startsWith(parent+"?vue&type=style")){
                            return false
                        }
                        return true
                    },
                    output: {
                        globals: {
                            vue: 'Vue'
                        }
                    }
                },
                cssCodeSplit: false,
                sourcemap:'hidden',
                minify:false,
                write:false
            }
        })
        let output = {}
        let r = result[0]
        r.output.forEach(function (it){
            let fn = it.fileName
            let extNm = path.extname(fn)
            if (extNm == ".js" || extNm == ".mjs"){
                output.js = it.code
                output.maps = it.map
            }else if (extNm == ".css"){
                output.css = it.source
            }
        })
    const stdout = process.stdout
    stdout.setEncoding("utf8")
    stdout.write(sfcOutputStartPlaceholder)
    stdout.write(JSON.stringify(output))
})()