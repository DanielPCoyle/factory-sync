const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const {config} = require('dotenv');

if (fs.existsSync('.env.'+process.env.NODE_ENV)) {
  config({ path: '.env.'+process.env.NODE_ENV })
}else{
    config()
}

const path1 = path.resolve(process.env.MODELS_DIR ?? "./api/server/models");

const fire = async () =>{
const files = await readdir(path1)
files.forEach((file)=>{
	if(!["index.js","model-meta.json","getters","setters"].includes(file)){
		fs.unlinkSync(path1+"/"+file)
	}
})
}

fire();