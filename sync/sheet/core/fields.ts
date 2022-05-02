import fs from 'fs';
import {DoubleHeaderListValues} from "./util"
import moment from "moment";
import {ListValues} from "./util"

export const fields =   async (auth,sheet, args)=>ListValues(auth, sheet || "fields",(data)=>{
    const migrationDir = process.env.MIGRATION_DIR || 'api/server/migrations';
    const timeStamp = moment(new Date()).format('YYYYMMDDhhmmss');
    if(args.table){
      data = data.filter(f=>f.table === args.table)
    }
    fs.writeFile(migrationDir+`/${timeStamp}-fields.json`, JSON.stringify(data), err => {
        if (err) {console.error(err) 
        return } 
      })
  
    let hasMigrationFiles = false;
    fs.readdir(migrationDir, (err, files) => {
      hasMigrationFiles = Boolean(files.filter(f=>f.includes("sync.js")).length)


    const initFile = `'use strict';
    const {initUp,initDown,initMigration} = require('factory-sync/migrations')
    module.exports = {
      up:initUp(initMigration('${timeStamp}')),
      down:initDown(initMigration('${timeStamp}'))
    };`;

    const updateFile = `'use strict';
    const {up,down} = require('factory-sync/migrations')
    module.exports = {
      up:up('${timeStamp}'),
      down:down('${timeStamp}')
    };`

    fs.writeFile(migrationDir+`/${timeStamp}-sync.js`,hasMigrationFiles ? updateFile : initFile, err => {
        if (err) {console.error(err) 
        return } 
      })
    });

  })