import React from 'react';
import {StyleSheet} from "react-native";
import StyleContext from "factory-sync/ui/helpers/useStyles";

export default ()=>{
    const {styles,screenWidth,ratio} = React.useContext(StyleContext);
    return StyleSheet.create({
    container: {
        ...styles.scrollContainer,
        ...styles.alignCenter
    },
    image: {
        marginBottom: styles.space.xLarge,
        width: screenWidth*.5,
        height: 250 * ratio,
    },
    inputView: {
        backgroundColor: "#99b7d4",
        borderRadius: 30,
        width: "70%",
        height: styles.space.xLarge,
        marginBottom: styles.space.medium,
        alignItems: "center",
    },
    TextInput: {
        flex: 1,
        padding: 5,
        marginLeft: 20,
    },
    forgot_button: {
        marginBottom: 0,
    },
    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        color:"white",
        backgroundColor: "#13548d",
    },
    });
}