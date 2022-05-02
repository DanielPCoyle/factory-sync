import { exec } from "child_process";
import fs from 'fs';
import util from 'util';
import lineByLine from 'n-readlines';
var path = require('path');

const {config} = require('dotenv');
if (fs.existsSync('.env.'+process.env.NODE_ENV)) {
  config({ path: '.env.'+process.env.NODE_ENV })
}else{
    config()
}
const ex = util.promisify(exec);
const readFile = util.promisify(fs.readFile)
const doCall = async (call) => await ex("NODE_ENV=test "+call);



var walk = util.promisify(function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
	  if (err) return done(err);
	  var pending = list.length;
	  if (!pending) return done(null, results);
	  list.forEach(function(file) {
		file = path.resolve(dir, file);
		fs.stat(file, function(err, stat) {
		  if (stat && stat.isDirectory()) {
			walk(file, function(err, res) {
			  results = results.concat(res);
			  if (!--pending) done(null, results);
			});
		  } else {
			results.push(file);
			if (!--pending) done(null, results);
		  }
		});
	  });
	});
  });

  const fireSwitchTest = async(type, checkFunc)=>{
	const results = await walk("./src");
	const checks = await Promise.all(results.map(async (file)=>{
	const check = await (async ()=>{
			let pass = true
			const liner = new lineByLine(file);
			while (line = liner.next()) {
			if(line.includes("@switch "+type)){
				const lineToSwitch = liner.next().toString('ascii');
				pass = checkFunc(lineToSwitch)
				if(!pass){
					console.log("FAILED::",file)
				}
			}
		}
		return pass;
		})()
		return check
	}))
	return checks;
}


describe('yarn switch web',()=>{
	it('switch web is properly uncommenting next line of code after // @switch web',async ()=>{
		await doCall("yarn do switch web")
		const data = await fireSwitchTest("web",
			(lineToSwitch)=>Boolean(lineToSwitch[0] !== "/" && lineToSwitch[1] !== "/")
		);
		 expect(
			data.includes(false)
		).toBe(false)

	})

	it('switch web is properly commenting out next line of code after // @switch mobile',async ()=>{
		await doCall("yarn do sync switch web")
		const data = await fireSwitchTest("mobile",
			(lineToSwitch)=>Boolean(lineToSwitch[0] === "/" && lineToSwitch[1] === "/")
		);
		 expect(
			data.includes(false)
		).toBe(false)

	})
})

describe('yarn switch mobile',()=>{
	it('switch mobile is properly uncommenting next line of code after // @switch mobile',async ()=>{
		await doCall("yarn do switch mobile")
		const data = await fireSwitchTest("mobile",
			(lineToSwitch)=>Boolean(lineToSwitch[0] !== "/" && lineToSwitch[1] !== "/")
		);
		 expect(
			data.includes(false)
		).toBe(false)

	})

	it('switch mobile is properly commenting out next line of code after // @switch web',async ()=>{
		// await doCall("yarn do switch mobile")
		const data = await fireSwitchTest("web",
			(lineToSwitch)=>Boolean(lineToSwitch[0] === "/" && lineToSwitch[1] === "/")
		);
		 expect(
			data.includes(false)
		).toBe(false)
	})
})