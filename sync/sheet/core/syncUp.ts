import fs from 'fs';
import path from 'path';
import listReactFiles from 'list-react-files'

export default async (options) => {
  const {directories} = options;
  const {appScriptsDir} = directories;
  const transformers = require(path.resolve('./api/services/api/transformers/index.ts'))
  const eventFunctions = require(path.resolve('./api/services/api/eventFunctions/index.ts'))
  const screenDir = path.resolve('./src/screens');
  const screensImport = await listReactFiles(screenDir)
  // await screensImport.forEach(async (file:any)=>{

		  try{
		  	console.dir(Object.keys(await import(screenDir)))
		  } catch(e){
		  	console.log(e)
		  }
 	// })
  // const screens = screensImport.default
  // fs.writeFile(appScriptsDir+`/upData.gs`,
  //   `const transformers = ${
  //     JSON.stringify(Object.keys(transformers).filter(t=>t !== 'default'))
  //   }\n`+
  //   `const eventFunctions = ${
  //     JSON.stringify(Object.keys(eventFunctions).filter(t=>t !== 'default'))
  //   }\n`+
  //   `const screens = ${
  //     JSON.stringify(Object.keys(screens).filter(t=>t !== 'default'))
  //   }`
  //    , err => {
  //   if (err) {console.error(err) 
  //   return } 
  // })
  // console.log("\n\n\t\t\t\x1b[43m⚠⚠⚠⚠\x1b[0m","GIT PUSH/PULL NEEDED FOR CHANGES TO SHOW ON SHEET","\x1b[43m⚠⚠⚠⚠\x1b[0m\n\n")
}