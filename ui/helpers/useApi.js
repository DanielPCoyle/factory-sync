import React from "react";
import axios from "axios";

export default (Context) => {
    const {auth,env} = React.useContext(Context) 
    const config =  {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "authorization":`bearer ${auth}`
        }
    }

    const apiUrl = env?.api_url;
    const get = (resource,query) => {
        const url = apiUrl+"/"+resource
        return axios.get(url,config)
    }

    const post =  (resource,data,requestType = null) => { 
        const url = apiUrl+"/"+resource;
        if(requestType === "form"){
            config.headers["Content-Type"] = 'multipart/form-data'
            config.headers["X-Requested-With"] = 'XMLHttpRequest'
        }
        return axios.post(url,data,config)
    }

    const put =  (resource,data,requestType = null) => { 
        const url = apiUrl+"/"+resource;
        
        if(requestType === "form"){
            config.headers["Content-Type"] = 'multipart/form-data'
            config.headers["X-Requested-With"] = 'XMLHttpRequest'
        }
        return axios.put(url,data,config)
    }

    const destroy =  (resource,query) => { 
        const url = apiUrl+"/"+resource;
        return axios.delete(url,config)
    }

    return {get,post,put,destroy}
}