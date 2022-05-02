import {google} from 'googleapis';
import {Sequelize} from "sequelize";
import fs from 'fs';
import path from 'path';
import {makeid} from "./util";

const Settings = require(path.resolve("./config/config.json"));




export default async(auth) => {
	const sheetId = process.env.SHEET_ID;
    const sheets:any = google.sheets({version: 'v4', auth});

    const env = process.env.NODE_ENV || 'development';
    let sequelize:any;
    let settings = Settings[env];

    sequelize = new Sequelize(settings.database, settings.username, settings.password, settings);

    let tables  =  await sequelize.query(`SHOW TABLES`, {
      type: sequelize.QueryTypes.SELECT
    });


    tables = tables.map(t=>t[Object.keys(t)[0]])
    const fields = {}
    await Promise.all(tables.map(async (table)=>{
      fields[table] = await sequelize.query(` SHOW FULL COLUMNS FROM ${table};`, {
        type: sequelize.QueryTypes.SELECT
      });
    }))

    let references = await sequelize.query(`SELECT 
      TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, 
      REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
      FROM
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_NAME IS NOT NULL`, {
      type: sequelize.QueryTypes.SELECT
    })

  const fieldsHeader = [
          "uid",
          "table",
          "field",
          // "position",
          "comment",
          "type",
          "allowNull",
          "defaultValue",
          "primary",
          "enum",
          "autoIncrement",
          "unique",
          "references",
          // "assocation",
          "searchable",
          "input_type",
          "write_transformer"
        ];



    const fieldDefs:any = [];
    
    await Promise.all(Object.keys(fields).map(async (table)=>{

      let uniqueFields = await sequelize.query(`SHOW INDEXES
      FROM user
      WHERE key_name != "PRIMARY"`, {
        type: sequelize.QueryTypes.SELECT
      });

      uniqueFields = uniqueFields.map(uf=>uf.Column_name)
      fields[table].map((field)=>{
        const parsedComment = JSON.parse(field?.Comment || "false");           
        
        fieldDefs.push(
          fieldsHeader.map(header=>{
            switch(header) {
              case 'uid':
                 return parsedComment?.uid || makeid(8)
                break;
              case 'table':
                 return table
                break;
              case 'field':
                 return field.Field
                break;
              case 'comment':
                 return parsedComment?.comment
                break;
              case 'type':
                 return field.Type.includes("varchar") ? "string" : 
                 field.Type.includes("tinyint") ? "boolean" : 
                 field.Type.includes("enum") ? "enum" : 
                 field.Type.includes("decimal") ? "decimal" : field.Type
                break;
              case 'allowNull':
                 return !Boolean(field.Null === "YES") ? "FALSE" : ""
                break;
              case 'enum':
                 return field.Type.includes("enum") ? field.Type.match(/\(([^)]+)\)/)[1].replace(/'/g,"") : "" 
                break;
              case 'primary':
                 return Boolean(field.Key === "PRI") ? "TRUE" : ""
                break;
              case 'defaultValue':
                 return Boolean(field.Default) ? field.Default : ""
                break;
              case 'autoIncrement':
                 return field.Extra.includes("auto_increment") ? "TRUE" : ""
                break;
              case 'unique':
                 return uniqueFields.includes(field.Field) ? "TRUE" : ""
                break;
              case 'references':                
                   const refField = references.find(ref=>ref.TABLE_NAME === table && ref.COLUMN_NAME === field.Field)
                   return Boolean(refField) ? (refField.REFERENCED_TABLE_NAME+"/"+refField.REFERENCED_COLUMN_NAME) : ""
                break;
              case 'searchable':     
                   return Boolean(parsedComment?.searchable) ? "TRUE" : ""
                break;
              default:
                return header + "-TODO"
            }
          })
        )
      })
  }))

let extraFields:any = [];

try{
  if(fs.existsSync(path.resolve("./sync/sheet/data/"+process.env.NODE_ENV+"Fields.ts"))){

  let testFields = await import(path.resolve("./sync/sheet/data/"+process.env.NODE_ENV+"Fields.ts"));
  testFields = testFields.default;
     extraFields = process.env.NODE_ENV === "test" ? testFields.map((col)=>{
      return fieldsHeader.map(head=>{
        return col?.[head] || ""
      })
    }) : [];
  } 
} catch (e) {
  console.log("ERROR:::",e)
}

let seedData:any = [];
try{
  if(fs.existsSync(path.resolve("./sync/sheet/data/"+process.env.NODE_ENV+"Seeds.ts"))){
  let seedDataCheck = await import(path.resolve("./sync/sheet/data/"+process.env.NODE_ENV+"Seeds.ts"));
  let seedHeader1:any = [];
  let seedHeader2:any = [];
  let seedValues:any = [];
  seedDataCheck = seedDataCheck.default;
  
  Object.keys(seedDataCheck).map((table)=>{
    seedHeader2 = [...seedHeader2,...Object.keys(seedDataCheck[table][0])]
    seedHeader1 = [...seedHeader1,...Object.keys(seedDataCheck[table][0]).map((head)=>table)]

    seedDataCheck[table].forEach((sd,i)=>{
      const seedRow = seedHeader1.map((t,ti)=>{
          if(t === table){
            return sd[seedHeader2[ti]]
          } else{
            return ""
          }
        })

      if(seedRow.filter(sr=>sr !== "").length){
        seedValues.push(
          seedRow
        )
      }
    })
  })

  seedData.push(seedHeader1)
  seedData.push(seedHeader2)
  seedData = [...seedData,...seedValues]
  }
} catch (e) {
  console.log("ERROR::::",e)

}

  
 return await sheets.spreadsheets.get({spreadsheetId:sheetId}).then(async (result:any)=>{
    const initSheets = {
        settings:[
        [
          'key',
          'development',
          'testing',
          'production',
        ],
          ["project_title",""],
          ["api_url",""],
          ["socket_url",""],
          ["color_danger",'#d9534f'],
          ["color_dark",'#343a40'],
          ["color_info",'#17a2b8'],
          ["color_light",'#f8f9fa'],
          ["color_muted",'#6c757d'],
          ["color_primary",'#0275d8'],
          ["color_secondary",'#6c757d'],
          ["color_success",'#5cb85c'],
          ["color_warning",'#f0ad4e'],
          ["color_white",'#ffffff'],
        ],
        fields:[
          fieldsHeader,
          ...fieldDefs,
          ...extraFields
        ],
        models:[[
          'model',
          'seed_order',
          "before_post",
          "after_post",
          "before_put",
          "after_put",
          "before_delete",
          "after_delete",
          "before_get",
        ],
        ['user',1,"userBefore"],
        ['post',2]
        ],
        navigation:[[
          'platform',
          'area',
          'label',
          'link',
        ]],
        routes:[[
          "platform",
          "privlieges",
          "name",
          "path",
          "component",
          "title_tag",
          "meta_description",
        ]],
        seeds:seedData
    };

    const existingSheets = result.data.sheets.map((sheet:any)=>{
      return sheet.properties.title;
    })


   return await Promise.all(Object.keys(initSheets).map(async (sheet:any)=>{
      if(!existingSheets.includes(sheet)){
         const request = {
            spreadsheetId: sheetId,  
            resource: {
              requests: [{
                  'addSheet': {
                      'properties': {
                          'title': sheet,
                      }
                  }
              }],  
            },
          auth: auth,
        }

        try {
          const response = await sheets.spreadsheets.batchUpdate(request)
            await sheets.spreadsheets.values.append({
              spreadsheetId: sheetId,
              range: `${sheet}!A1:ZZ1`,
              valueInputOption: 'USER_ENTERED',
              resource: {
                values:initSheets[sheet]
              },
            })
            console.log("Created header row for : ",`\x1b[32m${sheet}\x1b[0m`)
        } catch (err) {

          console.error("ERROR",err);
        }
      } else{
        console.log(`\x1b[32m'${sheet}'\x1b[0m sheet already exisits`)
      }
    }))
  }).then(()=>{
    console.log("\n\n\nFINISHED :)\n\n\n")
    console.log(`https://docs.google.com/spreadsheets/d/${sheetId}`)
    process.exit(0);
    return;
  })
}