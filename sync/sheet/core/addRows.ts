import {google} from 'googleapis';
import {ListValues, makeid} from "./util"

export const addRows = async(auth,sheet,args)=>{
  const sheetId = process.env.SHEET_ID;
  const sheets:any = google.sheets({version: 'v4', auth});

  console.log("ARG>>>",args)

  const {sheetName,data} = args;
  

  const nData = JSON.parse(data);
  await ListValues(auth,sheetName, async (data)=>{

		const nRows:any = [];
		const errors:any = [];


  	nData.forEach(nD=>{
		const header = Object.keys(data[0]);
		const nRow = header.map((col)=>{
		  if(col === "uid"){
		    return makeid(8)
		  } else{
		    return nD?.[col] || ""
		  }
		})

		Object.keys(nD).forEach(attr=>{
			if(!header.includes(attr)){
				errors.push(`- ${attr}`);
			}
		})

		nRows.push(nRow)
  	})



	if(errors.length){
		console.log("\n!You have columns that are not yet on the sheet or typos. Please add the following columns to sheet or remove from request before continuing:")
		errors.forEach((error)=>{
			console.log(error)
		})
		console.log("\n")
		return false;
	}

	  await sheets.spreadsheets.values.append({
	    spreadsheetId: sheetId,
	    range: `${sheetName}!A1:ZZ1`,
	    valueInputOption: 'USER_ENTERED',
	    resource: {
	      values: nRows
	    },
	  })

  });
} 
