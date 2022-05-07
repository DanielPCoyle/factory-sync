import { Required } from "@core/components/Required";
import StyleContext from "factory-sync/ui/helpers/useStyles";
import React from "react";
import { View } from "react-native";
import { Input } from "react-native-elements";
import ider from "factory-sync/ui/util/ider"

export const GeneralForm = ({ name, setName, email, setEmail, password,setPassword }) => {
	const {styles} = React.useContext(StyleContext);
	return <View>
		<View style={{ paddingLeft: 20, paddingRight: 20, marginTop: 20 }}>
			<Input
				{...ider("name")}
				inputContainerStyle={{ borderBottomWidth: 0 }}
				value={name}
				onChangeText={(e) => setName(e)}
				style={{ ...styles.formContainer, ...{ fontFamily: styles.fonts.headerFont, fontSize:styles.fonts.sizes.large, marginTop: 10, padding: 10 } }}
				placeholder="What is your full name?" />
			<Required />
			<Input
				{...ider("email")}
				inputContainerStyle={{ borderBottomWidth: 0 }}
				value={email}
				onChangeText={(e) => setEmail(e)}
				style={{ ...styles.formContainer, ...{ fontFamily: styles.fonts.headerFont, fontSize:styles.fonts.sizes.large, marginTop: 10, padding: 10 } }}
				placeholder="email" />
			<Required />
			<Input
				{...ider("password")}
				inputContainerStyle={{ borderBottomWidth: 0 }}
				value={password}
				secureTextEntry={true}
				onChangeText={(e) => setPassword(e)}
				style={{ ...styles.formContainer, ...{ fontFamily: styles.fonts.headerFont, fontSize:styles.fonts.sizes.large, marginTop: 10, padding: 10 } }}
				placeholder="password" />
			<Required {...ider("lastRequired")} />
		</View>
	</View>;
};
