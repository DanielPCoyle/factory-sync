import {google} from 'googleapis';
import {ListValues, makeid} from "./util"

export const updateRows = async(auth,sheet,args)=>{
  const sheetId = process.env.SHEET_ID;
  const sheets:any = google.sheets({version: 'v4', auth});
  const {sheetName,where,data} = args;
  if(!Boolean(where)){
  	console.log("Needs --where object")
  	return false;
  }
  const nWhere = JSON.parse(where);
  const nData = JSON.parse(data);
  await ListValues(auth,sheetName, async (sheetData)=>{
	const header = Object.keys(sheetData[0]);
	const updateRowIndexes:any = [];
	sheetData.forEach((row,i)=>{
		let check = 0;
		Object.keys(nWhere).forEach((attr)=>{
			if(nWhere[attr] === row[attr]){
				check = check + 1;
			}
		})
		if(check === Object.keys(nWhere).length){
			updateRowIndexes.push(i)
		}
	})
	
		const sheetCall:any = await sheets.spreadsheets.get({spreadsheetId: sheetId, })
		if(!Boolean(sheetCall)){
			console.log("Sheet call failed");
			return false;
		}
		const sheet:any = sheetCall.data.sheets.find(s=>s.properties.title === sheetName).properties.sheetId
		try{

		    await updateRowIndexes.forEach(async (index)=>{
		    	const nD = {...sheetData[index],...nData}
	    			const nRow = header.map((col)=>{
						    return nD?.[col] || ""
						})
				  	const res = await sheets.spreadsheets.values.update({
				  	 	spreadsheetId: sheetId,
				  	 	range:`${sheetName}!A${index+2}:ZZ${index+2}`,
				  	 	valueInputOption: "RAW",
					  	resource:{
					  		values:[
					  			nRow
					  		]
					  	}
				  	})
		    })
		  } catch(e){
		  	console.log(e)
		  }
}) 
}