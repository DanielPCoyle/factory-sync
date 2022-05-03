import fs from "fs";
import express from 'express';
import http from 'http';
import util from 'util';
import { exec } from "child_process";
var bodyParser = require('body-parser')
const child_process = require('child_process'
);
const settings = require('../../src/__core/env/'+(process.env.NODE_ENV || 'development')+".json") 
const app = express();
const env = process.env.NODE_ENV ?? "development"

const ex = util.promisify(exec);

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json());

const server = http.createServer(app);
const port = settings?.deployment_port ?? 5002;

server.listen(port);
server.on('error', (e)=>console.log("ERROR:::::",e));
server.on('listening',()=>console.log(`DEPLOYMENT SERVER RUNNING ON PORT:${port} in "${process.env.NODE_ENV || "development"}" environment`));

const build = () => {
  child_process.execSync(`rm -fr /home/deployment/.cache/yarn/*`);
  
  console.log("removing old build...")
  child_process.execSync(`rm -fr build`)

  if(fs.existsSync("../webOld")){
    child_process.execSync(`rm -fr webOld`)
  }
  if(fs.existsSync("../ios")){
  child_process.execSync(`rm -fr ios`)
  }
  if(fs.existsSync("../android")){
  child_process.execSync(`rm -fr android`)
  }

  child_process.execSync(`mkdir src1`)
  child_process.execSync(`mkdir src1/__core`)
  child_process.execSync(`mkdir src1/__core/env`)
  child_process.execSync(`mv src/__core/env src1/__core/env`)
  child_process.execSync(`rm -fr src`)
  child_process.execSync(`mv src1 src`)
  console.log("unzipping new build...")
  child_process.execSync(`unzip build.zip`)
  console.log("renaming directory web to webOld...")
  child_process.execSync(`rm -fr webOld`)
  child_process.execSync(`mv web webOld`)
  console.log("replacing web folder with new build folder...")
  child_process.execSync(`mv build web`)
  child_process.execSync(`rm build.zip`)

}

app.post("/deployment",async(req,res)=>{
    child_process.execSync(`git reset --hard HEAD`);
    child_process.execSync(`git pull`);
    child_process.execSync(`yarn do sync settings`);

    const commitMessageCall = await ex("git log -1 --pretty=%B")
    const commitMessage =commitMessageCall.stdout
    console.log("\n\n\nCOMMIT MESSAGE::",commitMessage)

    if(commitMessage.includes("::deploy::") || commitMessage.includes("::all::")){
      console.log("Dropping DB, Creating DB, migrating from scratch and seeding data...")
      child_process.execSync(`yarn && yarn do reset-db`,{stdio:[0,1,2]});
    }

    if(commitMessage.includes("::migrate::")){
      console.log("migrating database...")
      child_process.execSync(`NODE_ENV=${env} yarn do migrate`,{stdio:[0,1,2]})
    }

    if(commitMessage.includes("::seed::")){
      console.log("seeding database...")
      child_process.execSync(`NODE_ENV=${env} yarn do seed`)
    }

    if(commitMessage.includes("::build::")){
      build();
    }

    console.log("Deployment Complete")
    res.json("Deployment Captured")
})


export default app;