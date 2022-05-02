import fs from "fs";
import glob from "glob";
import util from 'util';
import packageJSON from '../package.json';

const g = util.promisify(glob);

const organizeIndexes = async (dir) => {
	return await ( g(dir+ '/**/*') ) 
}

packageJSON.organize.forEach(async (dir)=>{
	console.log(dir)
	const indexFile = await organizeIndexes(dir)
	console.log(indexFile)
 	fs.writeFile(dir+"/index.js", indexFile.filter(file=>file.includes(".js"))
 		.map((file)=>"export * from '"+file.replace('/src/screens','')+"'").join("\n"), err => {
      if (err) {console.error(err) 
      return } 
    })
}) 

