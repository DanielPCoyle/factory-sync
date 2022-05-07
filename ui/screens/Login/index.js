import React from 'react';
import Web from "./webLogin";
import Mobile from "./mobileLogin";
import useApi from "../../helpers/useApi";
import jwt_decode from "jwt-decode";
import { Platform } from "react-native";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import { SiteContext } from "@core/context";
import { Alert } from "react-native";

export const Login = ({route,navigation,url,Logo})=>{
    const [signUpView,setSignUpView] = React.useState(false);
    const [email,setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const history = useHistory();
  	const [hasSchedule,setHasSchedule] = React.useState(true);
    const {setShowFooter, setAuth,auth, setUser} = React.useContext(SiteContext);
    const [error,setError] = React.useState(null)
    const {post} = useApi(SiteContext);
    const handleSubmit = () => {
      post(url ?? "login",{email,password}).then(({data})=>{
        if(data.message){
          if(Platform.OS === "web"){
            toast.warning(data.message)
          } else{
            Alert.alert(JSON.stringify(data))
          }
          return;
        }
        const user = jwt_decode(data.token).user;
        setUser(user)
        setAuth(data.token)
        if(Platform.OS === "web"){
          localStorage.setItem("user", JSON.stringify(user))
          localStorage.setItem("auth",data.token)
          history.push("/")
        } else {
          navigation.navigate("Dashboard")
        }
      }).catch((e)=>{
        console.log(e)
        if(e.message){
          if(Platform.OS === "web"){
            toast.warning(e.response.data.message)
          } else{
            setError(e.response.data.message)
          }
          return;
        }
      })
    }

    const props = {
      signUpView,
      setSignUpView,
      email,
      setEmail,
      password,
      setPassword,
      auth,
      setUser,
      setAuth,
      handleSubmit,
      navigation,
      hasSchedule,
      setHasSchedule,
      route,
      error,
      Logo
    }

    const webProps = {
      ...props,
      ...{
        setShowFooter
      }
    }

    return Platform.OS === "web" ? <Web {...webProps} /> : <Mobile {...props} />
  }

  export default Login