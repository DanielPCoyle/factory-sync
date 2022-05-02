import fs from 'fs';
import pkg from './core';

const {authorize,help,funcs} = pkg;
const args:any = process.argv.slice(2);

// Load client secrets from a local file.
fs.readFile('credentials.json', async (err, content:any) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  return authorize(JSON.parse(content), await doIt);
});

async function doIt(auth){

	const funcsCollection = funcs(auth);
	if(args.includes("-h") || args.includes("--help") ){
		return help(funcsCollection);
	}
	
	const sheet = args[0];
	args.shift();
	let keys:any = [];
	let values:any = [];
	const obj:any = {};
	const passArgs = args.forEach((arg,i)=>{
		if(i % 2 === 0){
			keys.push(arg);
		} else{
			values.push(arg);
		}
	})

	args.forEach((arg,i)=>{
		if(keys[i]){
			obj[ keys[i].replace("--","") ] = values[i]
		}
	})

	if( funcsCollection[ sheet ] ){
		await funcsCollection[ sheet ](auth,sheet,obj);
	} else {
		if( funcsCollection[ obj.as ] ) {
			await funcsCollection[ obj.as ](auth,sheet,obj);
		} else {
			await funcsCollection.basic(auth,sheet,obj)
		}
	}

	console.log(`syncing sheet \x1b[36m'${sheet}'\x1b[0m complete`)
	return `syncing sheet \x1b[36m'${sheet}'\x1b[0m complete`;
}