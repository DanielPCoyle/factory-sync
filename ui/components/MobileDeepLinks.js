import React from "react";
import { Linking} from "react-native";
import SiteContext from "@core/context";

const linkPrefix = "phillydogwalk://";

export default ({navigation}) => {
    const {user} = React.useContext(SiteContext);
    React.useEffect(()=>{
    const handler = ({url})=>{
      if(Boolean(url)){
       const matchedRoute = mobileRoutes
       .sort((a,b)=>a.path.length < b.path.length ? 1 : -1)
       .map((route)=>{
          let needed = 0;
          let match = 0;
          const options = {}
          const check = url.replace(linkPrefix,"").split("/")
          const all = check.length
          const check2 = route.path.split("/");
          check2.shift()

            check2.forEach((partB,i)=>{
              if(partB.indexOf(":") !== 0){
                needed = needed+1;
                if(Boolean(check[i] === partB)){
                  match = match + 1
                }
              } else{
                  if(!partB.includes("?")){
                      needed = needed +1
                      if(Boolean(check[i])){
                          match = match + 1;
                          options[partB.replace(":","")] = check[i];
                      } 
                  } else{
                      if(Boolean(check[i])){
                          options[partB.replace(":","").replace("?","")] = check[i];
                      } 
                  }
              }
            })
          if(needed>0 && match === needed && all === check2.length){
            return {route,options}
          } else{
            return false
          }
        }).filter(r=>Boolean(r))
  
        if(Boolean(matchedRoute.length)){
            navigation.navigate( matchedRoute[0].route.name, matchedRoute[0].options )
        } else{
            navigation.navigate( Boolean(user) ? "Dashboard" : "Login" )
        }
      }
    }
    const listener = Linking.addEventListener('url',(data)=> {
      handler({url:data.url})
    }) 

    Linking.getInitialURL().then((data)=>{
      console.log("INIT URL",data)
      handler({url:data})
    })
  
    return () => {
        listener.remove();
    };
  },[navigation])

  return null;
}
