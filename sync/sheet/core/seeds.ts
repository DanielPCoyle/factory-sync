import fs from 'fs';
import {DoubleHeaderListValues} from "./util"
import moment from "moment";
import {ListValues} from "./util"

export const seeds =  async (auth,sheet,args)=>DoubleHeaderListValues(auth,sheet || "seeds",async (data)=>{
  const seederDir = process.env.SEEDERS_DIR || 'api/server/seeders';
  const modelsDir = process.env.MODELS_DIR || 'api/server/models';

  const timeStamp = moment(new Date()).format('YYYYMMDDhhmmss');

  fs.writeFile(seederDir+`/${timeStamp}-seeds.json`, JSON.stringify(data,null,2), err => {
    if (err) {console.error(err) 
      return } 
    })

  fs.readdir(seederDir, (err, files) => {

    const updateFile = `'use strict';
    const {up,down} = require('../../services/seeders')
    module.exports = {
      up:up('${timeStamp}'),
      down:down('${timeStamp}')
    };`

    fs.writeFile(seederDir+`/${timeStamp}-seeder.js`,updateFile , err => {
      if (err) {console.error(err) 
        return } 
      })

    ListValues(auth,'models' ,(modelData)=>{
      const nData = [...modelData]
      const seedModels = Object.keys(data);
      seedModels.forEach((key)=>{
        if( !modelData.map(m=>m.model).includes(key) ){
          nData.push({
            model:key,
            seed_order:9999,
            label:key
          })
        }
      })
      fs.writeFile(modelsDir+'/model-meta.json', JSON.stringify(nData), err => {
        if (err) {console.error(err) 
          return } 
        })
    })

  });
})