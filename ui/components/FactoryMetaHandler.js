import React from "react";
import Helmet from "react-helmet";
export const FactoryMetaHandler = ({routes}) => {
    const location = window.location;
    const [route,setRoute] = React.useState();
    React.useEffect(()=>{
      setRoute(()=>routes?.find(r=>r.path === location.pathname.toLowerCase()))
    },[location]) // eslint-disable-line
    return <><Helmet><title>{route?.title_tag}</title></Helmet></>
}

export default FactoryMetaHandler;