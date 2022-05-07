import React from "react";
import { Platform } from "react-native";
import socketIOClient from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Notifications} from 'react-native-notifications';
import useEnv from "factory-sync/ui/helpers/useEnv";

const getStoredData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

const PushNotificationRegister = () => {
  // Notifications.registerRemoteNotifications();
  //           Notifications.events().registerRemoteNotificationsRegistered((event) => {
  //               // TODO: Send the token to my server so it could send back push notifications...
  //               // console.log("Device Token Received", event.deviceToken);
  //           });
  //           Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
  //               console.error(event);
  //           });

  //           Notifications.registerRemoteNotifications();
    
  //           Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
  //             // console.log(`\n\nNotification received in foreground: ${notification.title} : ${notification.body}`);
  //             completion({alert: false, sound: false, badge: false});
  //           });
        
  //           Notifications.events().registerNotificationOpened((notification, completion) => {
  //             // console.log(`Notification opened: ${notification.payload}`);
  //             completion();
  //           });

  //           // Notifications.events().registerNotificationReceivedBackground((notification: Notification, completion: (response: NotificationCompletion) => void) => {
  //           //   // console.log("Notification Received - Background", notification.payload);
  //           //   // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
  //           //   completion({alert: true, sound: true, badge: false});
  //           // });

  //           Notifications.getInitialNotification()
  //           .then((notification) => {
  //             // console.log("Initial notification was:", (notification ? notification.payload : 'N/A'));
  //             })
  //             .catch((error)=>{
  //               // TODO: ERROR HANDLING
  //             })      

  //           Notifications.ios.checkPermissions().then((currentPermissions) => {
  //             // console.log('Badges enabled: ' + !!currentPermissions.badge);
  //             // console.log('Alerts enabled: ' + !!currentPermissions.alert);
  //             // console.log('Sounds enabled: ' + !!currentPermissions.sound);
  //             // console.log('Car Play enabled: ' + !!currentPermissions.carPlay);
  //             // console.log('Critical Alerts enabled: ' + !!currentPermissions.criticalAlert);
  //             // console.log('Provisional enabled: ' + !!currentPermissions.provisional);
  //             // console.log('Provides App Notification Settings enabled: ' + !!currentPermissions.providesAppNotificationSettings);
  //             // console.log('Announcement enabled: ' + !!currentPermissions.announcement);
  //         });

  //         Notifications.removeAllDeliveredNotifications();
}




export const useCoreContext = (callBack) => {
        const [user,setUser] = React.useState(null)
        const [auth,setAuth] = React.useState(null)
        const [isAdminArea, setIsAdminArea] = React.useState(false);
        const [onBoarding,setOnBoarding] = React.useState( Platform.OS === "web" ?  (JSON.parse(localStorage.getItem("onBoarding"))) : {})
        const [socket,setSocket] = React.useState(null);
        const {env,envName} = useEnv();
        const [pressedOnUser,setPressedOnUser] = React.useState(null);
        const [chatIsOpen,setChatIsOpen] = React.useState(false);
        const [theme,setTheme] = React.useState(null);
        const [cbResults,setCbResults] = React.useState(null);
    
        React.useEffect(()=>{
            if(!auth){
              if(Platform.OS === "web"){
                setAuth(localStorage.getItem("auth"));
                setUser(JSON.parse(localStorage.getItem("user")))
              }
            }

            if(Boolean(callBack)){
              (async ()=>{
                setCbResults( await callBack() )
              })()
            }

        },[user,auth])
     
        React.useEffect(()=>{
            if(Boolean(user) && Boolean(auth)){
              if(Platform.OS !== "web"  ){
                AsyncStorage.setItem('@user', JSON.stringify(user))
                AsyncStorage.setItem('@auth', JSON.stringify(auth))
              } else{
                localStorage.setItem('@user', JSON.stringify(user))
                localStorage.setItem('@auth', JSON.stringify(auth))
              }
            }
        },[user,auth])

        React.useEffect(() => {

            getStoredData("@user").then((result)=>{
                setUser(result)
            })

            getStoredData("@auth").then((result)=>{
                setAuth(result)
            })

            if(Boolean(env)){
              const socketIO = socketIOClient(env.socket_url);
              setSocket(socketIO)
              socketIO.on("connection", data => {
                  // console.log(data)
              });
            }

            if(Platform.OS === "web" && Boolean(env)){
              localStorage.setItem("env", JSON.stringify(env))
            }

            if(Platform.OS !== "web" && Boolean(env?.push_notifications_on?.toLowerCase() === "true")){
              PushNotificationRegister();
            }
          }, [env]);

        React.useEffect(()=>{
            if(Platform.OS === "web"){
                localStorage.setItem('onBoarding',JSON.stringify(onBoarding));
            }
        },[onBoarding])

       
        
        const checkAdmin = () => {
            if(Platform.OS === "web"){
                setIsAdminArea(Boolean(window.location.pathname.includes("/admin")) && Boolean(user.type === "admin") )
            }
          }

          // Get the walks in progress
          // Track locations for any walks in progress
          const logout = ()=>{
            setAuth(null)
            setUser(null)
            AsyncStorage.removeItem('@user')
            AsyncStorage.removeItem('@auth')
          }
    const completed = {...{
      user,
      setUser,
      auth,
      setAuth,
      isAdminArea,
      setIsAdminArea,
      onBoarding,
      setOnBoarding,
      socket,
      setSocket,
      pressedOnUser,
      setPressedOnUser,
      checkAdmin,
      chatIsOpen,
      setChatIsOpen,
      logout,
      theme,
      setTheme,
      envName,
      env
  },
  ...cbResults
}
    return completed
}

export const SiteContext = React.createContext( {} );
export default SiteContext