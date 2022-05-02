export const help = (funcs) => {
  console.log("\n\n",":::::::::::::::::::::::::::::::::::: Sync Help ::::::::::::::::::::::::::::::::::::","\n\n");
    console.log("\n",":::::::::::::::::::::::::::::::::::: Usage ::::::::::::::::::::::::::::::::::::::::","\n");
    console.log("\t\t","yarn do sync [sheet_names]")
    console.log("\t\t","   examples: yarn do sync","settings")
    console.log("\t\t","             yarn do sync","settings","models","fields")
    console.log("\n");
    console.log(" :::::::::::::::::::::::::::::::::::::: Registered Sheets :::::::::::::::::::::::::::::::","\n\n")
    Object.keys(funcs).filter(f=>f !== "basic").map(func=>{

      console.log("\t- ",func,":")

      if(func === "settings"){
        console.log("\t\t","Parses the \x1b[36msettings\x1b[0m sheet and generates the files in the env src/env directory.")
        console.log("\t\t","The first column in the sheet is the key, the following columns are the values ")
        console.log("\t\t","for the corespoding key for each env (column header).");
      }

      if(func === "fields"){
        console.log("\t\t","Parses the \x1b[36mfields\x1b[0m sheet and generates sequelize migration files in the api's migration directory.","\n")
        console.log("\t\t","Sheet Description::")
        console.log("\t\t","Registered",'\x1b[36mData Base\x1b[0m', "'fields' from the fields table::")
        console.log("\t\t\t","uid - ", "* Required", "A unique identifier for the field's defenition. Needed to track changes between migrations.")
        console.log("\t\t\t","table - ", "* Required", "The mysql table that the field belongs to")
        console.log("\t\t\t","field - ", "* Required", "the field name.")
        console.log("\t\t\t","Position - ", "The position of the field on the table")
        console.log("\t\t\t","comment - ", "a note or comment for the field that will be stored on the DB schema")
        console.log("\t\t\t","type - ", "* Required", "The type of data of the field")
        console.log("\t\t\t","allowNull - ", "Is this field nullable or not")
        console.log("\t\t\t","defaultValue - ", "The default value on inserts if not provided in insert statement")
        console.log("\t\t\t","primary - ", "Is this the primary key or not")
        console.log("\t\t\t","enum - ", "The options allowed if the data type is enum")
        console.log("\t\t\t","autoIncrement - ", "Does this field auto increment or not?")
        console.log("\t\t\t","unique - ", "Is this field unique or not?")
        console.log("\t\t\t","references - ", "Does this field reference another table. value example: referencedTable/fieldOnReferencedTable")
        console.log("\t\t\t","assocation - ", "What kind of association does the reference apply")
        console.log("\n")
        console.log("\t\t","Registered",'\x1b[36mAPI\x1b[0m', "'fields' from the fields table::")
        console.log("\t\t\t","searchable - ", "Is this field searchable")
        console.log("\n")
        console.log("\t\t","Registered",'\x1b[36mUI/UX\x1b[0m', "'fields' from the fields table::")
      }

      if(func === "init"){
        console.log("\t\t","This will add the default sheets necessary for a full E2E sync.")
      }

      if(func === "models"){
        console.log("\t\t","This will parse the \x1b[36mmodels\x1b[0m sheet for api/db models' configurations")
      }

      if(func === "seeds"){
        console.log("\t\t","Parses the '\x1b[36mseeds\x1b[0m' table and generates sequelize database seeder files in the seeders directory")
        console.log("\t\t","Sheet Description::")
        console.log("\t\t","The first row is the table's name that you want to seed")
        console.log("\t\t","The second row is the columns for that table that you are seeding")
        console.log("\t\t","You can have multiple tables in the same sheet. ")
        console.log("\t\t","(It is reccomended to have a column in between tables to allow for easier sorting)")
        console.log("\t\t","TODO: Or you can use 'yarn do sync seeds [sheet_name]' to use a different sheet other than 'seeds'")
      }
      console.log("\n")
      
    })
    return;
}