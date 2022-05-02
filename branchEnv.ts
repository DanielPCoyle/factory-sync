import fs from "fs";
import { exec } from "child_process";
import util from 'util';
const ex = util.promisify(exec);
const fileExists = fs.existsSync;
(async()=>{
    const {stdout } = await ex("git status")
    const branch = stdout
    .split("\n")[0].replace("On branch ","").trim()

    const switchTo = (branch.indexOf("mobile-") === 0) ? "mobile" : 
                     (branch.indexOf("web-") === 0) ? "web" :
                    null
    if(Boolean(switchTo)){
        const switchOutput = await ex("yarn do switch "+switchTo)
        console.log(switchOutput.stdout)
    }

    let currentEnv:string = "local";
    currentEnv = branch.includes("development") ? "development" :
                 (branch.includes("production") ? "production" :
                 branch.includes("tester") ? "test" :
                 "local")

    const envDir = "./src/__core/env";
    if(!fileExists(envDir)){
        fs.mkdirSync(envDir);
        const syncOutput = await ex("yarn do sync settings")
        console.log(syncOutput.stdout)
    }

    fs.writeFile("./src/__core/env/currentEnv.js",`export const currentEnv =  "${currentEnv}"` , err => {
        if (err) {console.error(err) 
        return } 
    })
    console.log("set env to "+currentEnv)
    
})()