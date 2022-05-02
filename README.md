# Factory-Sync

- A tool for building projects faster.

## Getting Started

### Requirements
- Sequelize installed in your project.
- `/config/config.json` file with sequelize database parameters for each enviornment.
```
{
  "local": {
    "username": "root",
    "password": null,
    "database": "dogwalk",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging":false,
    "timezone":"-05:00"
  },
  "development": {},
  "test": {},
  "production": {},
}
```
- the following directories need to  specified in your .env file as well as exists in your project.  

```
MIGRATION_DIR='api/server/migrations' 
MODELS_DIR='api/server/models'
SEEDERS_DIR='api/server/seeders'
ENV_SETTINGS_DIR='src/server/env'
```
\* Or define where each folder is yourself.

### Install
`
yarn add factory-sync
`
or 
`
npm install factory-sync
`

### Registering "do" script in package.json
- In your project's package.json file under "scripts" add 
`
"do": "ts-node ./node_modules/factory-sync/do.js",
`
- * Or whatever name you want to run the script as. 

### Google Credential File (Required)
- Go to https://console.cloud.google.com/apis/credentials
- Click "+ Create Credentials" at the top of the page.
- Select "Oauth client ID" in the drop down.
- If you have not already configure your consent screen.
- On the "Create OAuth client ID" select "desktop application" as your application type.
- Give it whatever name you want.
- Add whatever redirect url you want. 
- click create credentials.
- Click "Download JSON" on the pop up.
- Rename the file to credentials.json and add it to the root directory of your project.



### Registering a Sheet
- Create a new google spread sheet
- Copy your spreadsheet ID from the url:
`
    https://docs.google.com/spreadsheets/d/[THIS PART IS THE ID]/edit#gid=0
`
- create a .env file in the root of your directory if one does not already exisits.
- add the following:
`
    SHEET_ID=[YOUR SHEET ID HERE]
`

### Init
From the terminal run
`
yarn do sync init
`

This will add sheets (tabs) to your google spreadsheet as well as fill in any exisiting schema data found in your database. 

## Sync 

### Sync settings
`yarn do sync settings`
 The settings sync parses the data found in the settings table and creates json files for each enviornment specified in the settings sheet's header. 

The first column of the settings sheet holds the attributes key. The following columns contain the attribute value listed under the envornments name. 

Example:
| key  | local  | development  | test  |
|---|---|---|---|
| firebase_api_key  | asdlkfjaldskfj3  | sdflasdfjladskjf3  | sadfhadflkghjsdf  |
| primary_color  | blue  | red  | yellow |

### Sync fields (migrations)
`yarn do sync fields`
This command will generate a pair of files in your project's `migrations` directory. A json file that contains the a json copy of the data on the `fields` sheet. 

|Column Header   | Definition  | Required  | Acceptable Values  |
|---|---|---|---|
|**uid**   | a unique id that will be included in the mysql comments for this field. It is    |  REQUIRED |
| **table** | the name of the database table a field belongs to |REQUIRED  |
| **field** | the name of the field, no spaces | REQUIRED |
| **comment** | A comment that will be added to mysql  |
| **type** | the data type for this field | REQUIRED |
| **allowNull** | Is this field nullable? |  | TRUE, FALSE |
| **defaultValue** | the default value in mysql for a field  |
| **primary** | is this field the primary key |  | TRUE, FALSE |
| **enum** | comma seperated options if data type is enum |
| **autoIncrement** | Does this field auto increment |  | TRUE, FALSE |
| **unique** | should the values for this field be unique?    |
| **references** |  make associations to other tables. See references for more.   |
| **searchable** |  is this field used to find a record in a search?  | |  | TRUE, FALSE |
| **input_type** | the form input type  |
| **write_transformer** | |


### Sync seeds 
`yarn do sync seeds`

Use the `seeds` table to add data records to your database.

The first two columns of the seeds sheet are used to define table and fields. 

Example:
| users | users  | users  | users  || pets |  pets |  pets | 
|---|---|---|---|---|---|---|---|
| **id**| **name**|**type**|**date_created**||**id**|**name**|**owner_id**
| 1  | Marty McFly  |client|2022-04-01 4:33:12||1|Atreyu|1
| 2  | Doc Brown  |client|2022-04-01 4:33:12||2|Nibbler|3
| 3  | Philip J Fry  |client|2022-04-01 4:33:12||3|Wolfy|1

Running `yarn do sync seeds` will generate a pair of files in your `seeders` directory. A json file containing your seed data and a typescript file that will generate the data in your database once ran. 

#### Faker
you can use faker-js on the seeds sheet.
https://fakerjs.dev/guide/

use `$$` instead of `faker` like this:

*Examples*
```
$$address.city
$$animal.type
$$commerce.product
$$image.fashion
```

### Sync models 
`yarn do sync models`

| Column  | Definition |
|---|---|
|**model**| the table name for this model (must match what is on `fields` table.)
|**seed_order**| The order position of the seeder for this model.
|**before_post**| name of the function to be ran before a post call
|**after_post**| name of a function to be ran after a post call
|**before_put**|name of the function to be ran before a put call
|**after_put**|name of the function to be ran after a put call
|**before_delete**|name of the function to be ran before a delete call
|**after_delete**| name of the function to be ran after a delete call
|**before_get**|name of the function to be ran before a get call
|**singular_label**|The singular name for a model. Ex: *Product*.
|**plural_label**|The plural name for a model. Ex: *Products*.
|**api_limit**| The ammount of records allowed to show in the api.
|**list_label**| The label that will appear in listings. Use `$` as a prefix to declare variables. Ex: *$name*
|**hideInMenu**| Will set a flag in your data that will hide a model in the admin navigation.
|**list_component**| The react / react-native component used to display a record in a list
|**customForm**| The react / react-native component used to handle creating and editing records for this model.
|**api_expand**| The default expanded associations for this model. 
|**on_delete**| The function to be ran when a record is deleted.
|**on_update**|The function to be ran when a record is deleted.
|**post_access**| The user types allowed to perform POST calls on the api for a model. 
|**put_access**| The user types allowed to perform PUT calls on the api for a model. 
|**delete_access**| The user types allowed to perform DELETE calls on the api for a model. 
|**get_access**| The user types allowed to perform GET calls on the api for a model. 


### Sync routes 
`yarn do sync routes`

Syncing with the routes sheet will generate a file in the `UI_DATA_DIRECTORY` specified in the `.env` folder. You can use this file along with the [INSERT ROUTE COMPONENT LIST HERE].

| Column  | Definition  |
|---|---|
|**platform**|Specify which platforms this route is accessable on.
|**inNav**| Specify which platforms have this route included in the applications navigation.
|**access**|Which user types have access to this route? seperate by commas. 
|**name**| The name for this route that will be used in react native `navigation.navigate` function
|**path**| the url or deep link path.
|**component**| The screen component that will be used to render this route. 
