import React, {useState} from 'react'
import { useMutation } from '@apollo/react-hooks'
import {Drawer, Button, Input, message, Divider} from 'antd'
import { LoginOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import gif from '../images/picGIF.gif';
import logo from '../images/logo.png';
import '../style.css';
import {
  USER_LOGIN
} from '../graphql/users'

export const LOGIN_DRAWER = ({setLogIN, userRefetch}) =>{
	const [open, setOpen] = useState(false) 
	const [password, setPassword]= useState('')
	const [username, setUserName] = useState('')

	const [login] = useMutation(USER_LOGIN)

	const handleLogIn = async () => {
    if (username === '' || password === ''){
      message.error('Both username and password must be entered!')
      return
    }
    try{
      const {data} = await login({variables: { name: username, password: password}})
      console.log(data.loginUser)
      message.success('Successfully login!')
      await userRefetch();
      setLogIN(true)
    } catch(e){
      console.log(e.message)
      switch (e.message) {
        case 'GraphQL error: User not found!' :
          message.error('User not found!')
          break;
        case 'GraphQL error: Invaild password!' :
          message.error('Wrong password!')
          break;
        default:
          message.error('ERROR')
          break;
      }
    }
  }

	return(
		<>
			<Button type="text" size="small" style={{color:"white", borderColor: "gray", marginLeft: 10}} 
				onClick={() =>setOpen(true)}> 
        Login
      </Button>
      <Drawer title={<><LoginOutlined /> Login </>} placement="right" closable={false} visible={open}
   			onClose={() => setOpen(false)} width={400}>
   			<br/>
   			<br/>
   			<div style={{display: "flex", flexDirection: "row"}}>
   				<img src={logo} style={{width: 90, height: 90}} alt=""/>
   				<h1 style={{fontSize: 40, margin: "10px 15px", color: "#4B0082"}}> AlpacAlbum </h1>
   			</div>
   			<br/>
   			<br/>
   			<Divider/>
   			<h3 style={{marginLeft:5}}> Username / Email </h3>
   			<Input prefix={<UserOutlined/>} style={{width:"95%", margin:5}}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {handleLogIn()}
          }}/>
        <h3 style={{marginLeft:5}}> Password </h3>
        <Input.Password prefix={<KeyOutlined />} style={{width:"95%", margin:5}}
          onChange={(e) => setPassword(e.target.value)}
					onKeyDown={(e) => {
            if(e.key === 'Enter') {handleLogIn()}
          }}/>
        <Divider/>
        <div className="login-button">
          <Button type="primary" style={{margin:10}} onClick={handleLogIn} size="large"> 
            Login
          </Button>
          <div style={{position: "absolute", top: "34%", left: "27%"}}> 
            Not a user yet?
          	<a href="/#/register"> Sign up</a>
          </div>
          <img src={gif} style={{width: 60, height: 60, position: "absolute", right: "5%"}} alt=""/>
        </div>
   		</Drawer>
		</>
	)
	
}