import fs from 'fs';
import path from 'path';
import {ListValues} from "./util"

export const settings =  async (auth,sheet,args)=>ListValues(auth, sheet || "settings",(data)=>{
      const envDir = 'src/ui_data/env';
      const envs = {};
      data.forEach((row)=>{
        const key = row.key
        Object.keys(row).forEach((rKey)=>{
          if(typeof(envs[rKey]) === "undefined"){
            envs[rKey] = {};
          }
          if(rKey !== "key"){
            envs[rKey][key] = row[rKey] 
          }
        })
      })

      Object.keys(envs).filter(e=>e !== "key").forEach((env)=>{
        const fileContents = JSON.stringify(envs[env]);
        fs.writeFile(path.resolve(envDir+"/"+env+".json"),fileContents , err => {
            if (err) {console.error(err) 
            return } 
        })
      })
  })