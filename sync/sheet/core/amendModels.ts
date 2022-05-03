const {js } = require( 'js-beautify')
const beautify = js;
const { exec } = require( "child_process")
const fs = require( 'fs')
const path = require( 'path')
const util = require( 'util')

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const ex = util.promisify(exec);

const {config} = require('dotenv');

if (fs.existsSync('.env.'+process.env.NODE_ENV)) {
  config({ path: '.env.'+process.env.NODE_ENV })
}else{
    config()
}



const maker = (type,field,func)=>{
    const nFieldGetter = `args[0]['${field}'] = {...args[0]['${field}'],...{
        ${type}(${type === "set" ? "rawValue" : ""}){
            ${type === "get" ? `const rawValue = this.getDataValue('${field}');` : ``}
            ${type === "get" ? 'return' :''} ${func}${type === "get" ? "Getter" : "Setter"}(rawValue,"${field}")
        }
    }}`
    return nFieldGetter;
}

export default async()=>{
    const files:string[] = await readdir(path.resolve(process?.env?.MODELS_DIR ?? "./api/server/models"))
    const migrationDir = await readdir(path.resolve(process?.env?.MIGRATION_DIR ?? "./api/server/migrations"))
    const migrationFile = migrationDir.filter(f=>f.includes(".json"))[migrationDir.filter(f=>f.includes(".json")).length-1]
    const fieldMetaRaw = await readFile(path.resolve(process?.env?.MIGRATION_DIR ?? "./api/server/migrations" ) +"/"+migrationFile, "binary")
    files.filter(f=>!["model-meta.json","index.ts","index.js","init-models.ts","getters","setters","sync_meta.js","SequelizeMeta.js","init-models.js"].includes(f)).forEach(async file=>{
        const fieldMeta = JSON.parse(fieldMetaRaw)
    .filter(f=>f.table === file.replace(".js",""))
    .filter(fm=> (typeof fm.getter !== "undefined" || typeof fm.setter !== "undefined"  || typeof fm.references !== "undefined" )  )
    
    //     console.log(file)
    // if(fieldMeta.length){
        const getterImports:string[] = [];
        const setterImports:string[] = [];

        const filePath = path.resolve(process.env.MODELS_DIR ?? "./api/server/models")+"/"+file;
        let contents = await readFile(filePath, "binary")
        const replace = `return sequelize.define('${file.replace(".js","")}',`
        contents = contents.replace(replace,"const args = [")
contents = contents.replace(`);
};`,"]").replace("timestamps: true,","timestamps: false,")

            

                fieldMeta.forEach((fm)=>{
                    if(fm.getter){
                        getterImports.push(fm.getter)
                        contents = contents +  maker("get",fm.field,fm.getter)
                    } 
                    if(fm.setter){
                        setterImports.push(fm.setter)
                        contents = contents +  maker("set",fm.field,fm.setter)

                    }
                })
            
            contents = contents +`
                return sequelize.define('${file.replace(".js","")}', args[0],args[1]);
            };
            `
            contents = getterImports
            .map((importThing)=>`const ${importThing}Getter =  require("../../services/models/getters/${importThing}Getter").default`)
            .join("\n")+
            "\n"+
            setterImports
            .map((importThing)=>`const ${importThing}Setter =  require("../../services/models/setters/${importThing}Setter").default`)
            .join("\n")+
            "\n"+contents
            console.log(filePath)
            await fs.writeFileSync(filePath,beautify(contents, { indent_size: 2, space_in_empty_paren: true }))
            
    // }
    })
}