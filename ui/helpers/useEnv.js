import React from "react";
import {Platform} from "react-native";
const useEnv = () => {
    const [env,setEnv] = React.useState( Platform.OS === "web" ?  (JSON.parse(localStorage.getItem("env"))) : {})
    const [envName,setEnvName] = React.useState(null)
  
    React.useEffect(()=>{
      (async()=>{
        const {currentEnv} = await import("../../../../src/ui_data/env/currentEnv");
        if(!currentEnv){
          const local = await import(`../../../../src/ui_data/env/local.json`);
          setEnv(local.default) 
          setEnvName("local") 
          return;
        }
        setEnvName(currentEnv) 
        if(currentEnv === "local") {
          const local = await import(`../../../../src/ui_data/env/local.json`);
          setEnv(local.default) 
        } 
        else if(currentEnv === "development") {
          const dev = await import(`../../../../src/ui_data/env/development.json`);
          setEnv(dev.default) 
        } 
        else if(currentEnv === "test") {
          const prod = await import(`../../../../src/ui_data/env/test.json`);
          setEnv(prod.default) 
        }
        
        else if(currentEnv === "production") {
          const prod = await import(`../../../../src/ui_data/env/production.json`);
          setEnv(prod.default) 
        } 
        else {
          const local = await import(`../../../../src/ui_data/env/local.json`)
          setEnv(local.default)
        }
  })()
  },[])
  return {env,envName}
  }

  export default useEnv