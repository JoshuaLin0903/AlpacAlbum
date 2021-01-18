import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import 'antd/dist/antd.css';
import { Layout, message, Input, Button} from 'antd';
import {
  UserOutlined,
  KeyOutlined,
  MailOutlined
} from '@ant-design/icons';

import '../style.css';
import {
  USER_REGISTER
} from '../graphql/users'

import gif from '../images/picGIF.gif';


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
         <Content style={{ margin: '0 16px'}}>
         <div className="main-display-register">
            <img src={gif} style={{width: 150, height: 150, margin: 10}}/>
            <br/>
            <h1 style={{fontSize: 30}}> Create your account </h1>
            <Input 
                placeholder="Enter your username" 
                addonBefore={<><UserOutlined/> Username </>} 
                style={{width: 350, margin:10}}
                onChange={(e) => setUserName(e.target.value)}
            />
            <Input.Password placeholder="Enter your password"
                addonBefore={<><KeyOutlined /> Password </>}
                style={{width:350, margin:10}}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password placeholder="Enter your password again"
                addonBefore={<><KeyOutlined /> Password </>}
                style={{width:350, margin:10}}
                onChange={(e) => setPassword2(e.target.value)}
            />
            <Input 
                placeholder="Enter your email" 
                addonBefore={<><MailOutlined /> Email </>} 
                style={{width: 350, margin:10}}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="primary" 
                style={{margin:10}} 
                onClick={handleRegister} > 
                Register
            </Button>
            <a href="/#/">Back to Homepage</a>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}> 
            @2021 WebProgramming, Group 66
        </Footer>
        </Layout>
    </Layout>
    );
}

export default RegisterPage;