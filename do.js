const path = require("path");
const child_process = require('child_process');
const args = process.argv.splice(2);

const settings = require(path.resolve("./config/config.json"))
const command = args[0];
const env = process.env.NODE_ENV ?? "local"
const remainingArgs = args.splice(1).map((arg,i)=>{
    console.log(arg)
   return Boolean(arg.indexOf("[") === 0 || arg.indexOf("{") === 0) ? `'${arg}'` : arg.replace("--",'')  
}).join(" ")

const {username,password,host,database,port} = settings[env]

const migrationPath = env === "test" ? "./api/__tests__/migrations" : "./api/server/migrations"
const seederPath = env === "test" ? "./api/__tests__/seeders" : "./api/server/seeders"
const modelsDir = env === "test" ? "./api/__tests__/models" : "./api/server/models"



let commands = {
    "build-models":{
        cli:`sequelize-auto -o '${modelsDir}' -d ${database} -h ${host} -u ${username} ${password ? `-x ${password}` : ""} ${port ? `-p ${port}` : ""} -e mysql`,
        description:"Builds model files from database schema via sequelize-auto using configurations set in config/config.json",
        arguments:[],
    },
    "clear-models": {
        cli:"node ./node_modules/factory-sync/sync/clear-models.js",
        description:"Removes generated model files from the models directory.",
        arguments:[],
    },
    "clear-seeds": {
        cli:"node ./node_modules/factory-sync/sync/clear-seeds.js",
        description:"Removes generated seeder files from the seeders directory.",
        arguments:[],
    },
    "sync": {
        cli:"TS_NODE_FILES=true TS_NODE_TRANSPILE_ONLY=true ts-node ./node_modules/factory-sync/sync/sheet/index.ts",
        description:"Command wrapper for scripts found in './node_modules/factory-sync/sync'. Used for syncing project data with proejct's google sheets.",
        arguments:[],
    },
    "full-sync":{
        cli: "yarn do sync fields && yarn do sync models && yarn do sync seeds && yarn do sync settings",
        description:"Syncs all core sheets from project's google sheet with project.",
        arguments:[],
    },
    "seed": {
        cli:`npx sequelize-cli --seeders-path ${seederPath} db:seed:all --debug && cd ../..`,
        description:"Adds data to the database based on files found in the seeders directory. Uses sequelize-cli db:seed:all",
        arguments:[],
    },
    "migrate": {
        cli:`npx sequelize-cli db:migrate --migrations-path ${migrationPath} --debug  && yarn do sync models && yarn do clear-models && yarn do build-models && yarn do sync init-models && yarn do sync amendModels`,
        description:"Creates,Modifies or destroys database schemea determined by files in the migrations directory. Uses sequelize-cli db:migrate",
        arguments:[],
    },
    "migrate-undo":{
        cli: `npx sequelize-cli db:migrate:undo --migrations-path ${migrationPath} --debug`,
        description:"Undoes previous migration",
        arguments:[],
    },
    "test": {
        cli:"node_modules/.bin/jest  -c ./config/jest/jest.config.tools.js --verbose=true",
        description:"Runs test suite for projects interal development scripts in the /tools directory.",
        arguments:[],
    },
    "organize":{
        cli: "npx babel-node --experimental-json-modules ./node_modules/factory-sync/organize.js",
        description:"Builds index files based on specified directories. ",
        arguments:[],
    },
    "ngnix-generateSiteAvailable":{ // 
        cli: "ts-node ./node_modules/factory-sync/ngnix/generateSiteAvailable.js",
        description:"Creates site available file for ngnix. MUST BE RAN WITH SUDO AND HAVE NGNIX INSTALLED ON SERVER.",
        arguments:[],
    },
}

const nonProductionCommands = {
    "drop-db": {
        description:"Removes specified env's database.",
        arguments:[],
        cli:`npx sequelize-cli db:drop`},
    "create-db": {
        description:"creates a database based on parameters set in config/config.json",
        arguments:[],
        cli:`npx sequelize-cli db:create`},
    "reset-db":{
        description:"Will run commands that peform a full restore of the DB based on migration and seeder files. ",
        arguments:[],
        cli:`NODE_ENV=${env} yarn do drop-db && `+
            `NODE_ENV=${env} yarn do create-db && `+
            `NODE_ENV=${env} yarn do migrate && `+
            `NODE_ENV=${env} yarn do clear-seeds && `+
            `NODE_ENV=${env} yarn do sync seeds && `+
            `NODE_ENV=${env} yarn do seed && NODE_ENV=${env} yarn do seed`
        }
}

if(env !== "production"){
    commands = {...commands,...nonProductionCommands}
}

if(command === "help"){
    console.log("\n\n\n\nCOMMAND LIST")
    console.log("\n________________________\n")
    Object.keys(commands).forEach((command)=>{
        console.log('\x1b[36m%s\x1b[0m',"yarn do "+command)
        console.log(commands[command].description)
        console.log("\ncli:")
        console.log(commands[command].cli.trim())
        console.log("\n________________________\n")
    })
    console.log("\n\n\n")
}

const fire = commands[command].cli+" "+remainingArgs
child_process.execSync(fire,{stdio:[0,1,2]});