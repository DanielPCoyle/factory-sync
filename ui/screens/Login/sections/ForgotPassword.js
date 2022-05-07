import SiteContext from "@core/context";
import useApi from "factory-sync/ui/helpers/useApi";
import StyleContext from "factory-sync/ui/helpers/useStyles";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform } from "react-native";
import {  Input } from "react-native-elements";
import {Button} from "react-native-elements";
import { toast } from 'react-toastify';

export const ForgotPassword = ({ email, setEmail, onBackToLogin }) => {
  const {styles} = React.useContext(StyleContext);
  const { post } = useApi(SiteContext);
  const submitResetPassword = () => {
    post("forgot-password", { email }).then(({ data }) => {
      onBackToLogin();
      Platform.OS === "web" && toast.success("An email has been sent to reset your password.")
    }).catch((error)=>{
      // TODO: ERROR HANDLING
    })
  };

  return <ScrollView>
    <View style={{ marginTop: styles.screenHeight * .3 }}>
      <Text style={{
        fontFamily: styles.fonts.headerFont, marginBottom: 30,
        fontSize:styles.fonts.sizes.large, textAlign: "center", color: styles.colors.primary
      }}>Forgot Password</Text>
      <View>
        <Input value={email} placeholder={"Enter email"}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          onChangeText={(e) => setEmail(e)}
          style={{ ...styles.formContainer, ...{ textAlign: "center" } }} />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            onPress={() => submitResetPassword()}
            buttonStyle={{ borderRadius: 30, width: styles.screenWidth * .5, backgroundColor: styles.colors.primary }}
            titleStyle={{  fontSize:styles.fonts.sizes.medium, textAlign: "center" }}
            title={"Submit"} />
        </View>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={{ marginTop: 30, textAlign: "center" }}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </View>

  </ScrollView>;
};

export default ForgotPassword;