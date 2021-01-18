import React, {useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Drawer, Button, Input, message} from 'antd'
import { LoginOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import logo from '../images/logo.png';
import '../style.css';
import {
  USER_GET,
  USER_GET_ALL,
  USER_LOGIN,
  USER_LOGOUT
} from '../graphql/users'

export const LOGIN_DRAWER = ({setLogIN}) =>{
	const [open, setOpen] = useState(false) 
	const [password, setPassword]= useState('')
	const [username, setUserName] = useState('')

	const [login] = useMutation(USER_LOGIN)
	const {loading: UserLoading, data: currentUser, refetch: userRefetch} = useQuery(USER_GET)

	const handleLogIn = async () => {
    if (username === '' || password === ''){
      message.error('Both username and password must be entered!')
      return
    }
    try{
      const {data} = await login({variables: { name: username, password: password }})
      console.log(data.loginUser)
      message.success('Successfully login!')
      await userRefetch();
      setLogIN(true)
    } catch(e){
      console.log(e.message)
      switch (e.message) {
        case 'GraphQL error: User not found' :
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
   			<Input placeholder="Enter your username" prefix={<UserOutlined/>} style={{width: 250, margin:5}}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {handleLogIn()}
          }}/>
        <Input.Password placeholder="Enter your password" prefix={<KeyOutlined />} style={{width:250, margin:5}}
          onChange={(e) => setPassword(e.target.value)}
					onKeyDown={(e) => {
            if(e.key === 'Enter') {handleLogIn()}
          }}/>
        <div className="login-button">
          <Button type="primary" style={{margin:10}} onClick={handleLogIn} size="large"> 
            Login
          </Button>
          <div style={{position: "absolute", top: "34%", left: "25%"}}> 
            Not a user yet?
          	<a href="/#/register"> Sign up</a>
          </div>
        </div>
   		</Drawer>
		</>
	)
	
}