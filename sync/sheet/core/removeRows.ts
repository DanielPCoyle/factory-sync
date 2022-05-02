import {google} from 'googleapis';
import {ListValues, makeid} from "./util"

export const removeRows = async(auth,sheet,args)=>{
  const sheetId = process.env.SHEET_ID;
  const sheets:any = google.sheets({version: 'v4', auth});
  const {sheetName,where} = args;
  if(!Boolean(where)){
  	console.log("Needs --where object")
  	return false;
  }
  const nWhere = JSON.parse(where);
  await ListValues(auth,sheetName, async (data)=>{
	const header = Object.keys(data[0]);
	const removeIndexes:any = [];
	data.forEach((row,i)=>{
		let check = 0;
		Object.keys(nWhere).forEach((attr)=>{
			if(nWhere[attr] === row[attr]){
				check = check + 1;
			}
		})
		if(check === Object.keys(nWhere).length){
			removeIndexes.push(i+1)
		}
	})
	
		const sheetCall:any = await sheets.spreadsheets.get({spreadsheetId: sheetId, })
		if(!Boolean(sheetCall)){
			console.log("Sheet call failed");
			return false;
		}
		const sheet:any = sheetCall.data.sheets.find(s=>s.properties.title === sheetName).properties.sheetId
		try{

			const removes = [
				{
			      "deleteDimension": {
			        "range": {
			          "sheetId": sheet,
			          "dimension": "ROWS",
			          "startIndex": Math.min(...removeIndexes),
			          "endIndex": Math.max(...removeIndexes)+1
			        }
			      }
			    }
			]

		    console.log(removeIndexes,removes);
		  	const res = await sheets.spreadsheets.batchUpdate({
	  	 	spreadsheetId: sheetId,
		  	resource: {
	    	"requests": removes
		  	}
		  	})
		  } catch(e){
		  	console.log(e)
		  }
}) 
}