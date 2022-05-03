import React from "react";
import navLinks from "../../../../src/ui_data/routes";
import {Platform} from "react-native";
const useFactoryRoutes =  (user)=>{
    const [links,setLinks] = React.useState([]);
    React.useEffect(()=>{
        const doSetLinks = () => setLinks(navLinks
            .filter((l)=>l.platform.includes(Platform.OS !== "web" ? "mobile" : "web"))
            .filter((l)=> l.access.trim().length === 0 || l.access.includes(
              Boolean(user?.type) ? user?.type : "public" 
            ))
          )
        doSetLinks()
    },[user])
    return {links}
}
export default useFactoryRoutes