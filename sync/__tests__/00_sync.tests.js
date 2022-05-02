import { exec } from "child_process";
import fs from 'fs';
import path from 'path';
import util from 'util';

const {config} = require('dotenv');

if (fs.existsSync('.env.'+process.env.NODE_ENV)) {
  config({ path: '.env.'+process.env.NODE_ENV })
}else{
    config()
}

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const ex = util.promisify(exec);
const uiDataDir = process.env.UI_DATA_DIR || 'src/__core/env';
const envDir = uiDataDir+"/" || 'src/__core/env';


const doCall = async (call) => await ex(call);

describe('SS-22 | yarn do sync init', ()=>{

	beforeAll(async () => {
		this.call = await doCall('yarn do sync init');
    });

	it('SS-22a | Generates spreadsheet sheets and heads via yarn do sync init',async ()=>{
		return await expect(this.call.stdout.includes("FINISHED :)")).toBe(true)
	})
	
	it('SS-22b | settings sheet is created', async ()=>{
		const sheet = 'settings';
		return await expect(
			this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
			this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
			).toBe(true)

	});
	
	it('SS-22c | fields sheet is created', async ()=>{
		const sheet = 'fields';
		return await expect(
		this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
		this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
		).toBe(true)

	});
	
	it('SS-22d | seeds sheet is created', async ()=>{
		
		const sheet = 'seeds';
		return await expect(
		this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
		this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
		).toBe(true)

	});

	
	it('SS-22e | models sheet is created', async ()=>{
		const sheet = 'models';
		return await expect(
		this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
		this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
		).toBe(true)
	});
	


	it('SS-22f | routes sheet is created', async ()=>{
		const sheet = 'routes';
		return await expect(
		this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
		this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
		).toBe(true)
	});
	

	it('SS-22g | navigation sheet is created', async ()=>{
		const sheet = 'navigation';
		return await expect(
		this.call.stdout.includes(`\x1B[32m'${sheet}'\x1B[0m sheet already exisits\n`) ||
		this.call.stdout.includes(`Created new sheet: ${`\x1B[32m'${sheet}'\x1B[0m`}`) 
		).toBe(true)
	});
})


describe('SS-16 | yarn do sync fields', ()=>{
	it('SS-16a | generates a json and js file in the migration folder', async ()=>{
		const files = await readdir(path.resolve(process.env.MIGRATION_DIR))
		await doCall('yarn do sync fields');
		const nFiles = await readdir(path.resolve(process.env.MIGRATION_DIR))
		return await expect(files.length+2).toBe(nFiles.length)
	})
	it('SS-16b | generates valid json with at least the required fields', async ()=>{
		let nFiles = await readdir(path.resolve(process.env.MIGRATION_DIR))
		nFiles = nFiles.filter(f=> f.includes(".json"))
		const lastFileCreated = nFiles[nFiles.length-1]
		const file = await readFile(path.resolve(process.env.MIGRATION_DIR,lastFileCreated), "binary");
		let check = true;
		JSON.parse(file).forEach((row)=>{
			['field','table','uid','type'].forEach((requiredField)=>{
				if(!Object.keys(row).includes(requiredField) && row[requiredField].trim() !== ""){
					check = false;
				}
			})
		})
		return await expect(check).toBe(true)
	})
})

describe('SS-17 | yarn do sync models',()=>{
	it('SS-17a | generates a model-meta file', async ()=>{
		const modelMetaFile = path.resolve(process.env.MODELS_DIR+"/model-meta.json");
		if(fs.existsSync(modelMetaFile)){
			fs.unlinkSync(modelMetaFile);
		}
		await doCall('yarn do sync models');
		return await expect(fs.existsSync(modelMetaFile)).toBe(true)
	});
})

describe('SS-23 | yarn do sync init-models',()=>{
	it('SS-23a | generates a init-models file: this file contains model associations', async ()=>{
		const initModel = path.resolve(process.env.MODELS_DIR+"/init-models.js");
		if(fs.existsSync(initModel)){
			fs.unlinkSync(initModel);
		}
		await doCall('yarn do sync init-models');
		return await expect(fs.existsSync(initModel)).toBe(true)
	});
})

describe('SS-18 | yarn do sync settings',()=>{
	it('SS-18a | generates settings files in the env directory',async()=>{
		const settingsDir = path.resolve(envDir);
		const files = await readdir(settingsDir)
		if(files.length){
			files.forEach((file)=>{
				fs.unlinkSync(settingsDir+"/"+file)
			})
		}
		await doCall('yarn do sync settings');
		const nFiles = await readdir(settingsDir)
		return await expect(nFiles.length > 0).toBe(true)
	})
})


describe('SS19 | yarn do sync seeds',()=>{
	it('SS19a | generates a json and js file in the seeders folder', async ()=>{
		const files = await readdir(path.resolve(process.env.SEEDERS_DIR))
		await doCall('yarn do sync seeds');
		const nFiles = await readdir(path.resolve(process.env.SEEDERS_DIR))
		return await expect(files.length+2).toBe(nFiles.length)
	})
})

describe('SS-47 | yarn do sync addRow',()=>{
	it('SS-47a  | add rows to sheet via command line', async ()=>{
		const timestamp = new Date().toString();
			const call = `yarn do sync addRows --sheetName fields --data '[{"table":"adding_rows_test","type":"string","field":"field_1","comment":"${timestamp}"}]'`
		await doCall(call)
		await doCall("yarn do sync fields")

		let nFiles = await readdir(path.resolve(process.env.MIGRATION_DIR))
		nFiles = nFiles.filter(f=> f.includes(".json"))
		const lastFileCreated = nFiles[nFiles.length-1]
		const file = await readFile(path.resolve(process.env.MIGRATION_DIR,lastFileCreated), "binary");
		const rows = JSON.parse(file);
		const lastRow = rows[rows.length-1];
		expect(lastRow.comment).toEqual(timestamp)
	})
},60000)

describe('SS-49 | yarn do sync updateRows',()=>{
	it('SS-49a  | Update rows from sheet via command line', async ()=>{
		await doCall(`yarn do sync updateRows --where '{"table":"adding_rows_test","field":"field_1"}' --data '{"type":"text", "field": "updated_field_test"}' --sheetName fields`)
		await doCall("yarn do sync fields")
		let nFiles = await readdir(path.resolve(process.env.MIGRATION_DIR))
		nFiles = nFiles.filter(f=> f.includes(".json"))
		const lastFileCreated = nFiles[nFiles.length-1]
		const file = await readFile(path.resolve(process.env.MIGRATION_DIR,lastFileCreated), "binary");
		const rows = JSON.parse(file);
		expect(rows.length).toBeGreaterThan(0)
		expect(rows.filter(row=>row.table === "adding_rows_test" && row.field === "updated_field_test").length).toBe(1)
	})
},60000)

describe('SS-48 | yarn do sync removeRows',()=>{
	it('SS-47a  | Remove rows from sheet via command line', async ()=>{
		await doCall("yarn do sync removeRows --sheetName fields --where '"+JSON.stringify({
			table:"adding_rows_test"
		})+"'")
		await doCall("yarn do sync fields")
		let nFiles = await readdir(path.resolve(process.env.MIGRATION_DIR))
		nFiles = nFiles.filter(f=> f.includes(".json"))
		const lastFileCreated = nFiles[nFiles.length-1]
		const file = await readFile(path.resolve(process.env.MIGRATION_DIR,lastFileCreated), "binary");
		const rows = JSON.parse(file);
		expect(rows.length).toBeGreaterThan(0)
		expect(rows.filter(row=>row.table === "adding_rows_test").length).toBe(0)
	})
},60000)



