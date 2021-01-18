import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import 'antd/dist/antd.css';
import { Layout, message, Input, Button} from 'antd';
import {
  UserOutlined,
  KeyOutlined
} from '@ant-design/icons';

import '../style.css';
import {
  USER_REGISTER
} from '../graphql/users'


const { Header, Content, Footer } = Layout;

const RegisterPage=()=>{
    const [username, setUserName] = useState('')
    const [password, setPassword]= useState('')
    const [password2, setPassword2]= useState('')
    const [email, setEmail]= useState('')
    const [register] = useMutation(USER_REGISTER)
    const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    const handleRegister = async() => {
        if (username === ''){
            message.error('Username must be entered!')
            return
        }
        else if(password === ''){
            message.error('Password must be entered!')
            return
        }
        else if(email === ''){
            message.error('Email must be entered!')
            return
        }
        else if(email.search(emailRule)===-1){
            message.error('Email format is not correct.')
            return
        }
        if (password !== password2){
            message.error("Please confirm your password")
            return
        }
        try{
            const {data} = await register({variables: { name: username, password: password, email: email }})
            console.log(data.registerUser)
            message.success('Successfully registered!')
            window.location.assign("http://localhost:3000/#/")
        } catch(e){
            console.log(e.message)
            if(e.message.includes("GraphQL error: E11000 duplicate key error")){
                message.error("Duplicate username or email")
            }
        }
    }

    return(
    <Layout style={{ minHeight: '100vh'}}>
     	<Layout className="site-layout">
         <Content style={{ margin: '0 16px' }}>
         <Header className="header">
        </Header>
         <div className="main-display-home">
            <Input 
                placeholder="Enter your username" 
                prefix={<UserOutlined/>} 
                style={{width: 250, margin:5}}
                onChange={(e) => setUserName(e.target.value)}
            />
            <Input.Password placeholder="Enter your password"
                prefix={<KeyOutlined />}
                style={{width:250, margin:5}}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password placeholder="Enter your password again"
                prefix={<KeyOutlined />}
                style={{width:250, margin:5}}
                onChange={(e) => setPassword2(e.target.value)}
            />
            <Input 
                placeholder="Enter your email" 
                prefix={<UserOutlined/>} 
                style={{width: 250, margin:5}}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="primary" 
                style={{margin:5}} 
                onClick={handleRegister} > 
                Register
            </Button>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> 
            <a href="/#/">Back to Homepage</a>
        </Footer>
        </Layout>
    </Layout>
    );
}

export default RegisterPage;