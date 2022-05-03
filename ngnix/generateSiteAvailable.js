const { createSiteAvailable } = require("./createSiteAvailable");
const args = process.argv;

const keys = []
const values = []
args.splice(2).forEach((item,i)=>{
    i % 2 === 0 ? keys.push(item) : values.push(item)
})
const obj = {}
keys.forEach((key,i)=>obj[key.replace("--","")] = values[i] )

var uid = parseInt(process.env.SUDO_UID);
if(!Boolean(uid) && obj.write.toLowerCase() === "true"){
    console.log("MUST RUN AS SUDO (DONT RUN AS ROOT DUMMY)")
    return;
}

if(obj.write.toLowerCase() !== "true"){
    createSiteAvailable(obj)
    return;
}

if(!fs.existsSync('/etc/nginx/sites-available')) {
    console.log("NO nginx")
    return;
}

console.log(`Writing /etc/nginx/sites-available/${obj.domain} ...`)
createSiteAvailable(obj)

