import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {google} from 'googleapis';
import {config} from 'dotenv'
import moment from "moment";
import {Sequelize} from "sequelize";

import syncUp from "./syncUp";
import init from "./init"
import {ListValues,DoubleHeaderListValues, authorize, getNewToken,makeid} from "./util"
import {settings as settingsFunc} from "./settings"
import {seeds} from "./seeds"
import {help} from "./help"
import {initModels} from "./initModels"
import {fields} from "./fields"
import {models} from "./models"
import {basic} from "./basic"
import {addRows} from "./addRows"
import {removeRows} from "./removeRows"
import {updateRows} from "./updateRows"
import amendModels from "./amendModels"


if (fs.existsSync('.env.'+process.env.NODE_ENV)) {
  config({ path: '.env.'+process.env.NODE_ENV })
}else{
    config()
}

const migrationDir = process.env.MIGRATION_DIR || 'api/server/migrations';
const modelsDir = process.env.MODELS_DIR || 'api/server/models';
const appScriptsDir = process.env.APPSCRIPT_DIR || 'appScript';
const uiDataDir = process.env.UI_DATA_DIR || 'src/ui_data';
const envDir = uiDataDir+"/env" || 'src/ui_data/env';
const seederDir = process.env.SEEDERS_DIR || 'api/server/seeders';
const directories = {migrationDir, seederDir, modelsDir, appScriptsDir, uiDataDir, envDir}

const funcs = (auth) => ({
  init: async (auth)=>{init(auth) }, 
  settings:settingsFunc,
  ['init-models']:initModels,
  basic,
  models,
  fields,
  up:async (auth,sheet,args)=>await syncUp({directories}),
  seeds,
  addRows,
  removeRows,
  updateRows,
  amendModels
})

export default {authorize, getNewToken, help, funcs }