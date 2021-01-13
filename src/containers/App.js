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
} from '../graphql'

// temp imports
// import {login} from '../axios'
import {imgData} from '../data'

const { Header, Content, Footer, Sider} = Layout;

const tagName = ["Alpaca", "Dogs", "Kpop"]

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
	const [searchCollapsed, setSearchCollapsed] = useState(true);
	const [currentEvent, setCurrentEvent] = useState('home')
  const [mainDisplay, setMainDisplay] = useState(<HOMEPAGE/>)
  const [logIN, setLogIN] = useState(false)
  const [username, setUserName] = useState('')
  const [password, setPassword]= useState('')

  const [login] = useMutation(USER_LOGIN)
  const [logout] = useMutation(USER_LOGOUT)
  const {_, error, data: currentUser, subscribeToMore} = useQuery(USER_GET)

  const handleLogIn = async () => {
    if (username === '' || password === ''){
      message.error('Both username and password must be entered!')
    }
    try{
      const {data} = await login({variables: { name: username, password: password }})
      console.log(data.loginUser)
      message.success('Successfully login!')
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
    console.log(currentUser)
  }

  const handleLogOut = async() =>{
    await logout()
    window.location.reload()
  }

  const handleMenuCollapse =() =>{
  	if (menuCollapsed === false && searchCollapsed === false){
  		setSearchCollapsed(true);
  	}
  	setMenuCollapsed(!menuCollapsed);
  }

  useEffect(()=>{
    switch(currentEvent){
      case 'home':
        setMainDisplay(<HOMEPAGE/>)
        break
      case 'search':
        setMainDisplay(<SEARCH/>)
        break
      case 'all':
        setMainDisplay(<ALL imgData={imgData} taglist={tagName}/>)
        break
      case 'upload':
        setMainDisplay(<UPLOAD imgData={imgData} taglist={tagName} user={username}/>)
        break
      default:
        setMainDisplay(<HOMEPAGE/>)
        break
    }
  }, [currentEvent])

  useEffect(() => {
    subscribeToMore({
      document: USER_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        return {
          prev,
          getUser: subscriptionData.data.user.data
        }
      }
    })
  }, [subscribeToMore])

  useEffect(()=>{
    if(currentUser){
      if(currentUser.getUser){
        setLogIN(true)
      }
    }
  }, [currentUser])

  return (
   	<Layout style={{ minHeight: '100vh'}}>
      {logIN?
     	(<Sider 
       	collapsible 
       	collapsed={menuCollapsed} 
       	width={500} 
       	onCollapse={() => handleMenuCollapse()}>
     		<div className="logo-div">
     			<HeartTwoTone twoToneColor="#eb2f96"/>
       			LOGO
      	</div>
        <Menu theme="dark" mode="inline" style={{ textAlign: 'center' }} defaultSelectedKeys={['1']}>
          <Menu.Item key="1" 
           	icon={<HomeOutlined />} 
           	onClick={()=>{setCurrentEvent("home");setSearchCollapsed(true);}}>
           	Home Page
          </Menu.Item>
          	{searchCollapsed?
            	<Menu.Item 
           	   	key="2" 
           	   	icon={<SearchOutlined/>} 
           	   	onClick={() => {setSearchCollapsed(false);setCurrentEvent("search");setMenuCollapsed(false);}}>
            		Search by Tags
            	</Menu.Item>
              :
             	<SEARCH_SIDER taglist={tagName}/>
            }
          <Menu.Item key="3" icon={<PictureOutlined />}
          	onClick={()=>{setCurrentEvent("all");setSearchCollapsed(true);}}>
          	View All Albums
          </Menu.Item>
          <Menu.Item key="4" icon={<UploadOutlined />}
            onClick={()=>{setCurrentEvent("upload");setSearchCollapsed(true);}}>
            Upload photos
          </Menu.Item>
        </Menu>
      </Sider>)
      :
      (<></>)}
      <Layout className="site-layout">
      	<Header className="header">
          {logIN?
          <>
            <div className="user">
              <div>
                <Avatar icon={<UserOutlined/>} style={{marginRight: 8}}/>
                {currentUser.getUser ? currentUser.getUser.name : ''}
              </div>
              <div>
                <Popconfirm placement="bottom" 
                  onConfirm={handleLogOut} 
                  title="Are you sure you want to logout?"
                  okText="Yes"
                  cancelText="No"
                >
                  <Button ghost="true" size="small" 
                  style={{color:"white", borderColor: "gray", marginLeft: 10}}> 
                    Logout 
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </>
          :
          <></>}
      	</Header>
        <Content style={{ margin: '0 16px' }}>
       	  {logIN ? 
            mainDisplay
            :(
            <div className="main-display-home">
              <div className="image-display">
                <img src={alpaca}/>
              </div>
              <Input 
                placeholder="Enter your username" 
                prefix={<UserOutlined/>} 
                style={{width: 250, margin:5}}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {handleLogIn()}
                }}/>
              <Input.Password placeholder="Enter your password"
                prefix={<KeyOutlined />}
                style={{width:250, margin:5}}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {handleLogIn()}
                }}/>
              <Button type="primary" 
                style={{margin:5}} 
                onClick={handleLogIn} > 
                Login
            </Button>
            </div>
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}> Footer</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
