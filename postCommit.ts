import fs from "fs";
import { exec } from "child_process";
import util from 'util';
const ex = util.promisify(exec);

(async()=>{

    const commitMessageCall = await ex("git log -1 --pretty=%B")
    const commitMessage =commitMessageCall.stdout
    
    let autoCommitMessage = "auto branchEnv";
    console.log("Branch Env...")
    await ex("yarn do branchEnv")
    
    if(commitMessage.includes("::build::") || commitMessage.includes("::all::")){
        console.log("building...")
        console.log( await ex("yarn build") )
        console.log("compressing...")
        console.log( await ex("zip -r build.zip build") )
        console.log("auto commiting build zip...")
        autoCommitMessage = autoCommitMessage +" "+commitMessage.replace("::build::"," ::auto-build-commit::")
        await ex(`git commit -a -m "${autoCommitMessage}"`)
        console.log("Done")
    }
    

})()