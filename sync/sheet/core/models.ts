import fs from 'fs';
import {DoubleHeaderListValues} from "./util"
import moment from "moment";
import {ListValues} from "./util"

export const models = async (auth,sheet, args)=>ListValues(auth,sheet || 'models',(data)=>{
    const modelsDir = process.env.MODELS_DIR || 'api/server/models';
    fs.writeFile(modelsDir+'/model-meta.json', JSON.stringify(data), err => {
        if (err) {console.error(err) 
        return } 
      })
  })