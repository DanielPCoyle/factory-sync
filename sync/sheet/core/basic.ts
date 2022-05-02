import fs from 'fs';
import {DoubleHeaderListValues} from "./util"
import moment from "moment";
import {ListValues} from "./util"
const uiDataDir = process.env.UI_DATA_DIR || 'src/ui_data';

export const basic = async (auth,sheet,args)=>ListValues(auth,sheet,(data)=>{
    fs.writeFile(uiDataDir+"/"+sheet+'.json', JSON.stringify(data), err => {
        if (err) {console.error(err) 
        return } 
      })
  })