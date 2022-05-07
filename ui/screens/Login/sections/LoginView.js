import SiteContext from "@core/context";
import ider from "factory-sync/ui/util/ider";
import StyleContext from "factory-sync/ui/helpers/useStyles";
import React from "react";
import {
  Dimensions, Image, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { default as ls } from "../styles";

export const LoginView = ({Logo,setView, email, setEmail, password, setPassword, handleSubmit, navigation, error }) => {
  const loginStyles = ls();
  const {styles} = React.useContext(StyleContext);
  const {setTheme} = React.useContext(SiteContext);
  React.useEffect(()=>{
    setTheme("signUp")
  },[setTheme])

  return <ScrollView>
    <View style={loginStyles.container}>
      <Logo/>

      <View style={loginStyles.inputView}>
        <TextInput
          {...ider("email")}
          style={loginStyles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          onChangeText={(e) => setEmail(e)} />
      </View>

      <View style={loginStyles.inputView}>
        <TextInput
          {...ider("password")}
          style={loginStyles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)} />
      </View>

      <TouchableOpacity
        onPress={() => {
          setView("Reset Password");
        }}
        {...ider("forgot-password-link")}>
        <Text style={{fontSize:styles.fonts.sizes.small}}>Forgot Password?</Text>
      </TouchableOpacity>


     

      <TouchableOpacity
        {...ider("submit")}
        style={loginStyles.loginBtn}
        onPress={() => {
          handleSubmit();
        }}
      >
        <Text style={{ color: "white", fontFamily: 'Ranchers' }}>LOGIN</Text>
      </TouchableOpacity>


          {Boolean(error) && <Text 
          {...ider("error_display")}  
          style={{color:"red"}}>{error}</Text> }

      <View style={{ marginBottom: 30, marginTop: 30 }}>
        <TouchableOpacity
          {...ider("signup")}
          onPress={() => {
            navigation.navigate("Sign Up");
          }}>
          <Text style={{ textAlign: "center", fontSize:styles.fonts.sizes.small }}>Not a customer yet?</Text>
          <Text style={{ textAlign: "center", fontSize:styles.fonts.sizes.small }}>sign up now</Text>
        </TouchableOpacity>
      </View>
      <View>
      </View>
    </View>
  </ScrollView>;
};
