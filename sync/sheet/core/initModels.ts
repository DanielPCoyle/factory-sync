import fs from 'fs';
import { ListValues } from "./util";

export const initModels = async(auth,sheet,args)=>ListValues(auth,"fields",(data)=>{
        const modelsDir = process.env.NODE_ENV === "test" ? 'api/__tests__/models' : 'api/server/models';
        const references = data.filter(d=>Boolean(d.references)).map((d)=>{
          const obj = {};
          const ref = d.references.split("|").forEach(o=>{
            o = o.split(":")
            if(o[0] === "table"){
              o[0] = "referenced_table"
            }
            obj[o[0]] = o[1].trim()
          })


          return {
          ...{
          table:d.table,
          field:d.field,
          },...obj

          }
        } 
        )


        let file = `var DataTypes = require("sequelize").DataTypes;`+"\n"
        file = file + `${data.map(d=>d.table).filter((value, index, self) => {
            return self.indexOf(value) === index;
          }).map(table=>`var _${table} = require("./${table}");`).join("\n")}`+"\n\n"



        file = file + `function initModels(sequelize) {`+"\n"

        file = file + `${data.map(d=>d.table).filter((value, index, self) => {
            return self.indexOf(value) === index;
          }).map(table=>`\tvar ${table} = _${table}(sequelize, DataTypes);`).join("\n")}\n`


        references.forEach(d=>{
          if(d.type === "hasOne"){
            file = file + `\t${d.referenced_table}.hasOne(${d.table}, { as: "${d.as}", foreignKey: "${d.field}"});\n`
            if(Boolean(d?.belongsToAs)){
              file = file +`\t${d.table}.belongsTo(${d.referenced_table}, { as: "${d.belongsToAs}", foreignKey: "${d.field}"});\n`
            }
          
          }
          if(d.type === "hasMany"){
            file = file + `\t${d.referenced_table}.hasMany(${d.table}, { as: "${d.as}", foreignKey: "${d.field}"});\n`
            if(Boolean(d?.belongsToAs)){
              file = file +`\t${d.table}.belongsTo(${d.referenced_table}, { as: "${d.belongsToAs}", foreignKey: "${d.field}"});\n`
            }
          
          }
          if(d.type === "manyToMany"){
            file = file + `\t${d.referenced_table}.belongsToMany(${d.otherTable}, { as: '${d.as}', through: ${d.table}, foreignKey: "${d.otherKey}", otherKey: "${d.field}" });\n`
          }
        });        

        file = file + `\n\treturn {`+"\n"
        file = file + `${data.map(d=>d.table).filter((value, index, self) => {
            return self.indexOf(value) === index;
          }).map(table=>`\t\t${table}`).join(",\n")}`+"\n"
        
        file = file + `\n\t}\n`
        file = file + "\n}\n"


        file = file + `module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;`
         fs.writeFile(modelsDir+'/init-models.js', file, err => {
        if (err) {console.error(err) 
        return } 
      })

  })