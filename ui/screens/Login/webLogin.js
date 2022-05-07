import React from 'react';
import {
  Text,
  TouchableHighlight,
  Animated,
} from 'react-native';
import {Row,Col,Input,Button,Container} from "reactstrap";
import {SiteContext} from "@core/context";
import {useHistory} from "react-router-dom";
import { ForgotPassword } from "./sections/ForgotPassword";
import useApi from "factory-sync/ui/helpers/useApi";
import decode from "jwt-decode";

const WebLogin =  ({navigation, signUpView, setSignUpView, email, setEmail, password, setPassword, apiUrl, setAuth, auth, 
  handleSubmit,
   setUser}) => {
  const {setShowFooter} = React.useContext(SiteContext);
  const [view,setView] = React.useState("login");
  const [name,setName] = React.useState();
  const history = useHistory();
  const {post} = useApi(SiteContext);
    React.useEffect(()=>{
      setShowFooter(false)
    },[setShowFooter])

    const handleSignUp = () => {
      post("sign-up",{email,name,password}).then((response)=>{
          const user = decode(response.data).user;
          setUser(user)
          setAuth(response.data)
          navigation.navigate("Dashboard")
      }).catch((error)=>{
        // TODO: ERROR HANDLING
      })
  }



    return  view === "login" ? <React.Fragment>
    <Row>
    {!signUpView && <Col lg={6} className="m-auto">
    <Row>
      <Col className="text-center">
       <Animated.Image
          source={require('@assets/logo.png')}
          style={{width:100,height:100,margin:"auto"}}
        />
        <Row className="mt-3">
        <Col>
        {/* <Button color='white' className="border col-8 m-auto"> */}
        {/* <Row>
          <Col xs={2}>
            <img src='https://blog.hubspot.com/hubfs/image8-2.jpg' className="w-100" style={{borderRadius:10}}/>
          </Col>
          <Col className="pt-1"><strong>Sign in with Google</strong></Col>
        </Row> 
        </Button>
        </Col>
      </Row>
        <Row className="mt-3">
        <Col>
        <Button color='white' className="border col-8 m-auto">
        <Row>
          <Col xs={2}>
            <img src='https://blog.hubspot.com/hubfs/image8-2.jpg' className="w-100" style={{borderRadius:10}}/>
          </Col>
          <Col className="pt-1"><strong>Sign in with Facebook</strong></Col>
        </Row>  */}
        {/* </Button> */}
        </Col>
      </Row>
        {/* <p className="mt-2 mb-2">Or sign in with your email and password</p> */}
      </Col>
    </Row>
      <Row className="m-auto w-75">
        <Col>
          <Input placeHolder={"email"}  onInput={({target})=>setEmail(target.value)}/>
        </Col>
      </Row>
      <Row className="m-auto w-75">
        <Col className="mt-3">
          <Input placeHolder={"password"} type="password"  onInput={({target})=>setPassword(target.value)}/>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button id="loginSubmit" onClick={()=>{
            handleSubmit()
          }} color='success' className="w-75 mt-3">Login</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={{size:11, offset:1}} className="pl-4">
          <Button
          onClick={()=>setView("forgot-password")}
          color='transparent' className="mt-3">Forgot your password?</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={{size:11, offset:1}} className="pl-4">
          <Button color='transparent' className="mt-3" onClick={()=>setSignUpView(!signUpView)}>Don't have an account yet? Sign up Now!</Button>
        </Col>
      </Row>
      </Col> }

       {signUpView && <Col className="text-center m-auto" lg={6}>
        <Animated.Image
          source={require('@assets/logo.png')}
          style={{width:100,height:100,margin:"auto"}}
        />
        <h4>Sign Up Now</h4>

        <Row className="mt-3">
        <Col>
        <Button color='white' className="border col-8 m-auto">
        <Row>
          <Col xs={2}>
            <img alt={"sign up with google"} src='https://blog.hubspot.com/hubfs/image8-2.jpg' className="w-100" style={{borderRadius:10}}/>
          </Col>
          <Col className="pt-1"><strong>Sign up with Google</strong></Col>
        </Row> 
        </Button>
        </Col>
      </Row>
        <Row className="mt-3">
        <Col>
        <Button color='white' className="border col-8 m-auto">
        <Row>
          <Col xs={2}>
            <img alt={"sign up with facebook"} src='https://blog.hubspot.com/hubfs/image8-2.jpg' className="w-100" style={{borderRadius:10}}/>
          </Col>
          <Col className="pt-1"><strong>Sign up with Facebook</strong></Col>
        </Row> 
        </Button>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <p>Or let us know a little about yourself...</p>
        </Col>
      </Row>
        <Row className="mt-2">
          <Col>
            <Input placeHolder="name" onInput={(e)=>setName(e.target.value)} />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Input placeHolder="email" onInput={(e)=>setEmail(e.target.value)} />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Input placeHolder="password" type='password'  onInput={(e)=>setPassword(e.target.value)} />
          </Col>
        </Row>
        <Button onClick={()=>{
          handleSignUp();
        }} className="mt-3" style={{width:"100%"}}>Sign Up</Button>
       <TouchableHighlight
        onPress={()=>{
          setSignUpView(!signUpView)
        }}
        underlayColor={'transparent'}>
        <Text>Already have an account? Log in</Text>
      </TouchableHighlight>
        </Col> }
      </Row>
    </React.Fragment> : <Container>
      <Col lg={6} className="mx-auto">
      <ForgotPassword onBackToLogin={()=>setView("login")} email={email} setEmail={setEmail} />
      </Col>
      </Container>
  }
  
export default WebLogin;