import React from "react";
import {Linking} from "react-native";

export const useWebDeepLinks = ()=>{
    const firstRender = React.useRef(true);
    React.useEffect(() => {
      const doDeepLinking = async() => {
        const mobileUrl = "phillydogwalk:/"+window.location.pathname;
        const supported = await Linking.canOpenURL(mobileUrl);      
        supported && await Linking.openURL(mobileUrl);
      }
  
      if (firstRender.current) {
        doDeepLinking();
        firstRender.current = false;
        return;
      }
    });
  }

  export default useWebDeepLinks;