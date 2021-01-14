import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import 'antd/dist/antd.css';
import { Layout, Menu, message, Input, Button, Popconfirm, Avatar} from 'antd';
import {
  SearchOutlined,
  PictureOutlined,
  HeartTwoTone,
  HomeOutlined,
  UserOutlined,
  UploadOutlined,
  KeyOutlined
} from '@ant-design/icons';

import '../style.css';
import {HOMEPAGE, SEARCH, ALL, SEARCH_SIDER, UPLOAD} from '../components'
import alpaca from '../images/alpaca.png';
import {
  USER_GET,
  USER_LOGIN,
  USER_LOGOUT,
  USER_SUBSCRIPTION
} from '../graphql/users'


const { Header, Content, Footer, Sider} = Layout;

const RegisterPage=()=>{
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
            />
            <Input.Password placeholder="Enter your password"
                prefix={<KeyOutlined />}
                style={{width:250, margin:5}}
            />
            <Input.Password placeholder="Enter your password again"
                prefix={<KeyOutlined />}
                style={{width:250, margin:5}}
            />
            <Input 
                placeholder="Enter your email" 
                prefix={<UserOutlined/>} 
                style={{width: 250, margin:5}}
            />
            <Button type="primary" 
                style={{margin:5}} 
                onClick={console.log("hello")} > 
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