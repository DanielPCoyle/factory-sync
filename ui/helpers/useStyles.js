import React, { useLayoutEffect } from "react";
import { FaCalendar, FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp, FaComment, FaDollarSign, FaImages, FaPaw, FaPencilAlt, FaPlusCircle, FaRegCheckSquare, FaTimes } from "react-icons/fa";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { setCustomText } from 'react-native-global-props';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
const WebIcon = (props)=>{
    const Icons = {
        paw:FaPaw,
        comment:FaComment,
        dollar:FaDollarSign,
        "caret-right":FaChevronRight,
        "caret-left":FaChevronLeft,
        "calendar":FaCalendar,
        "close":FaTimes,
        "check":FaRegCheckSquare,
        "image":FaImages,
        "arrow-down":FaChevronDown,
        "arrow-up":FaChevronUp,
        "arrow-left":FaChevronLeft,
        "pencil":FaPencilAlt,
        "plus":FaPlusCircle,
    };
    const Comp = Icons[props.name]
    if(!Comp){
        return <div>{props.name}</div>
    }
    return <Comp {...props} />
}

function useWindowSize() {
    const [size, setSize] = React.useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize({screenWidth:window.innerWidth, screenHeight:window.innerHeight});
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

export const useStyles =  (coreData) =>{
    const {env} = coreData;
    console.log(">>>>CORE:::",JSON.stringify(env,null,2),"<<<<")
    const envColors = {};
    Object.keys(env).filter((k)=>k.includes("color_")).forEach((k)=>{
        envColors[k.replace("color_","")] = env[k]
    })

    
    const [styleData,setStyleData] = React.useState({});
    const {width,height} = Dimensions.get("window");
    const {screenWidth,screenHeight} = Platform.OS === "web" ?
     useWindowSize() :  // eslint-disable-line
    {
        screenWidth:width,
        screenHeight:height
    };
    const [ratio] = React.useState(screenWidth/541); //541 is actual image width
    const sizeWidth = (percent)=>(screenWidth*percent)
    const sizeHeight = (percent)=>(screenHeight*percent)

    React.useEffect(()=>{
        setColors({...defaultColors,...envColors})
    },[env]) // eslint-disable-line

    setCustomText({ 
        style: { 
          fontSize:18,
          fontFamily:"Futura"
        }
      })

    // setCustomView(customViewProps);
    // setCustomTextInput(customTextInputProps);
    // setCustomText(customTextProps);
    // setCustomImage(customImageProps);
    // setCustomTouchableOpacity(customTouchableOpacityProps);

    const defaultColors = {
        ...{
        danger:"#ff0000",
        dark:"#343a40",
        info:"#17a2b8",
        light:"#f8f9fa",
        muted:"#6c757d",
        primary:"#007bff",
        primaryLight:"#99b7d4",
        secondary:"#6c757d",
        success:"#28a745",
        warning:"#ffc107",
        white:"#fff",
        background:"white",
        blackFade:(opacity = .4)=>`rgba(1, 1, 1, ${opacity})`,
    },
    }

    const [colors,setColors] = React.useState({...defaultColors,...envColors})

        
    const [fonts,setfonts] = React.useState({ // eslint-disable-line
        headerFont:"Ranchers",
        sizes:{
            xSmall:0,
            small:15,
            medium:18,
            large:25,
            xlarge:30,
            xxlarge:40,

       },
       weights:{
        bold:"bold"
       }
    })


    const [icons,setIcons] = React.useState({ // eslint-disable-line
        sizes:{
            xSmall:0,
            small:15,
            normal:18,
            large:25,
            xlarge:30,
            xxlarge:40,

       }
    })
    
    const [space,setSpace] = React.useState({ // eslint-disable-line
            small:5,
            medium:15,
            large:20,
            xLarge:40,
            quarterHeight:sizeHeight(.25),
            quarterWidth:sizeWidth(.25),
            thirdWidth:sizeWidth(.33),
            thirdHeight:sizeHeight(.33),
            halfHeight:sizeHeight(.5),
            halfWidth:sizeWidth(.5),
    })

    const [formFields,setFormFields] = React.useState({ // eslint-disable-line
        color:{
            textInput:{},
            colorInput:{},
        },
        checkBox:{
            container:{}
        },
        choiceSlider:{
            displayText:{
                fontSize:fonts.sizes.large
            }
        },
        date:{
            button:{},
            buttonText:{},
        },
        textArea:{
            height:Platform.OS === "web" ? space.quarterHeight : 150
        },
        text:{},
    })

    const formWidthHandler = (width) =>{
        return width || "100%"
    }

    const inlineHandler  = (type)=>{
        return type === "inline-checkboxes" ? 
        {display:"flex",flexDirection:"row"} :
        {display:"unset"}
    }
    

    const obj2Return = ()=> ({...{
        // backgroundColor:"white",
        container: {
          flex: 1,
          padding: 100,
          backgroundColor: colors.white
        },
        scrollContainerWithButton: {
            height:sizeHeight(Platform.OS === "web" ? .90 : .73) ?? "auto"
        },
        scrollContainer: {
            height:sizeHeight(1) ?? "auto"
        },
        alignRight:{
            textAlign:"flex-end", alignItems:"flex-end"
        },
        alignCenter:{
            textAlign:"center", alignItems:"center"
        },
        alignLeft:{
            textAlign:"left", alignItems:"left"
        },
        // xMarginAuto:{
        //     marginRight:"auto",
        //     marginLeft:"auto",
        // },
        flexRowWrap:{
            display: 'flex', flexDirection: 'row', flexWrap:"wrap"
        },
        flexRow:{
            display: 'flex', flexDirection: 'row',
        },
        formContainer: {
            borderWidth:1,
            borderColor:"lightgray",
            backgroundColor:colors.white,
            height:space.small*10,
            paddingLeft:space.small,
            borderRadius:30
        },
        // mobileHeader:  {
            // backgroundColor:colors.white,
            // color:colors.primary
        // },
        formFields,
        colors,
        fonts,
        icons,
        space,
        inlineHandler,
        sizeWidth,
        sizeHeight,
        formWidthHandler,
        screenWidth,
        screenHeight,
      }})




    const styles = Platform.OS === "web" ? obj2Return() : StyleSheet.create(
        styleData
        );

        React.useEffect(()=>{
            setStyleData(obj2Return())
        },[colors,env]) // eslint-disable-line
    

    return {
        styles,
        screenWidth,
        screenHeight,
        ratio,
        Icon:Platform.OS === "web" ? WebIcon : Icon,
        Icon5:Platform.OS === "web" ? WebIcon : Icon5

    }
}

export const StyleContext = React.createContext( {} );
export default StyleContext