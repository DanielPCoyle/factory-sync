import useApi from "factory-sync/ui/helpers/useApi";
import SiteContext from "@core/context";
import React from "react";
import { ScrollView,Image, Text, TouchableOpacity, View } from "react-native";
import {Button} from "react-native-elements";
import StyleContext from "factory-sync/ui/helpers/useStyles";
import decode from "jwt-decode";
import { MobileHeader } from "@core/components/MobileHeader";
import { GeneralForm } from "./sections/GeneralForm";
import ider from "factory-sync/ui/util/ider"
import SubNav from "@components/SubNav"
					
export const SignUp = ({navigation})=>{
    const {user,setUser,setAuth} = React.useContext(SiteContext)
    const {styles} = React.useContext(StyleContext);
    const [email,setEmail] = React.useState("");
    const [name,setName] = React.useState("");
    const [password,setPassword] = React.useState("");
    const {post} = useApi(SiteContext);

    const handleSignUp = () => {
        console.log("FIRED SIGN UP")
        post("sign-up",{email,name,password}).then((response)=>{
            console.log(response.data)
            const user = decode(response.data).user;
            setUser(user)
            setAuth(response.data)
            navigation.navigate("Dashboard")
        }).catch((error)=>{
            console.log("SIGN UP ERROR", error)
          })
    }

	const isValid = () =>{
		return (  
            Boolean(Boolean(name) 
            && Boolean(email?.includes("@")) 
            && Boolean(password.length) ) 
        ) 
	}

	return <View style={{
        backgroundColor:styles.colors.background, 
        height:styles.screenHeight
    }}>
    <MobileHeader 
        hideSubNav={true}
        showMenu={false} 
        title={"Sign Up"}
        navigation={navigation} 
        fontSize={styles.fonts.sizes.large} 
    />
	<View style={{justifyContent:"center",alignItems:"center"}}>
		<Image 
            {...ider("logo")}
            style={{width:100,height:100}} 
            source={require("@assets/logo1.png")} 
        />
	</View>
	<ScrollView>
		<GeneralForm {...{name,setName,email,setEmail,setPassword,password}} />
        <View style={{justifyContent:"center",alignItems: "center"}}>
        <TouchableOpacity 
        {...ider("submitSignUp")}
        onPress={isValid() ? handleSignUp : null} 
        style={{
            backgroundColor:isValid() ? 'green' : "lightgray",
            paddingBottom:styles.space.large,
            width:"90%",
            
        }}
        
	>
        <Text style={{
            color:isValid() ? 'white' : 'darkgray',
            fontFamily:styles.fonts.headerFont,
            fontSize:styles.fonts.sizes.large,
            textAlign:"center",
        }}>
        Sign Up
        </Text>
    </TouchableOpacity>
    </View>
	</ScrollView>
	<View style={{marginBottom:50}}>
        <TouchableOpacity
            onPress={()=>navigation.navigate("Login")}
            style={{paddingLeft:15}}>
                <Text>{"Back to Login"}</Text>
        </TouchableOpacity>
	</View>
 	{Boolean(user) && <SubNav navigation={navigation} /> }
	</View>
}

export default SignUp