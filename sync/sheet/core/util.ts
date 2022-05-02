import fs from 'fs';
import {google} from 'googleapis';
import readline from 'readline';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';


export const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
export const  ListValues = (auth,sheetName,callBack) => {
  const sheetId = process.env.SHEET_ID;
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:ZZ`,
  }, (err, res:any) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows:any = res.data.values;
    if (Boolean(rows?.length)) {
    	let header:any = [];
    	let full:any = [];
      rows.forEach((row,i)=>{
      	if(i === 0){
      		header = row
      	} else{
      		header.forEach((head,hi)=>{
      			if(typeof(full[i]) === "undefined"){
      				full[i] = {}
      			}
      			full[i][head] = row[hi]
      		})
      	}
      })
      full.shift()
      callBack(full)
    } else {
      console.log('No data found.');
    }
  });
}

export const  DoubleHeaderListValues = (auth,sheetName,callBack) => {
  const sheetId = process.env.SHEET_ID;
  const sheets = google.sheets({version: 'v4', auth});
  let full:any = [];
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:ZZ`,
  }, (err, res:any) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (Boolean(rows?.length)) {
      let header1:any = [];
      let header2:any = [];
      rows.forEach((row,i)=>{
        if(i === 0){
          header1 = row
        } 
        else if(i === 1){
          header2 = row
        } else{
          header2.forEach((head,hi)=>{
            if(Boolean(row[hi])){
              if( typeof(full[header1[hi]]) === "undefined" ){
                full[header1[hi]] = []; 
              }
              if(typeof(full[header1[hi]][i]) === "undefined"){
                full[header1[hi]][i] = {}
              }
              full[header1[hi]][i][head] = row[hi]
            }
          })
        }
      })
      full.shift()
      const keys = Object.keys(full);
      const n = {};
      keys.forEach(key=>{
        n[key] = full[key].filter((a) => a)
      })
      callBack(n)
    } else {
      console.log('No data found.');
    }
  });
}


export const authorize = (credentials, callback) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token:any) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
export const  getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}