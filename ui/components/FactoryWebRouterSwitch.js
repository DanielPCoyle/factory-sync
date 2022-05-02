import React from "react";
import {
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";

import { useHistory } from "react-router-dom";
import useFactoryRoutes from "../helpers/useFactoryRoutes";

const FactoryWebRouterSwitch = ({Screens,isAdminArea,user}) =>{
    const history = useHistory();
    const {links} = useFactoryRoutes(user)
    const navigation = {
      navigate:(path,params)=>{
        const found = links.find(r=>r.name === path);
        let url = found.path;
        if(Boolean(params)){
          Object.keys(params).forEach((key)=>{
            url = url.replace(":"+key,params[key])
          })
        }
        history.push(url.replace(/\?/g,""))
    }}
     return  <div className={`w-${isAdminArea ? "75 mr-5" : "100"} float-right`}>
        <Switch>
            {
            links.map((route,i)=>{
                const Comp = Screens[route.component];
                return <Route 
                        key={"route_"+i} 
                        exact={true} 
                        path={route.path.toLowerCase()}
                        render={
                        props=><Comp {...props}
                        navigation={navigation}
                    />
                }
                />
            })
            }
            <Redirect to='/' />
        </Switch>
    </div>
}

export default FactoryWebRouterSwitch;