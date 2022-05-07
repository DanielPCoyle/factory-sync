import SiteContext from "@core/context";
import React from "react";
import { ForgotPassword } from "./sections/ForgotPassword";
import { LoginView } from "./sections/LoginView";

const MobileLogin =  (props) => {
  const {navigation,email,setEmail,route} = props;
  const [view,setView] = React.useState(route?.params?.view ?? "Login")
  const {user,auth} = React.useContext(SiteContext);
  React.useEffect(()=>{
    if(Boolean(user) && Boolean(auth)){
      navigation.navigate("Dashboard")
    }
  },[auth, navigation, user])
  


  return (
   view === "Login" ?  
    <LoginView {...props}  setView={setView} /> 
    :
    <ForgotPassword 
      {...{email,setEmail}} 
      onBackToLogin={()=>setView("Login")} 
    />
  );
}
 


export default MobileLogin