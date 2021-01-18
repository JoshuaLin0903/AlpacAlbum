import React, { useEffect, useState, useRef } from 'react'
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
import {HOMEPAGE, SEARCH, ALL, SEARCH_SIDER, UPLOAD, USER_DRAWER, LOGIN_DRAWER} from '../components'
import alpaca from '../images/alpaca.png';
import logo from '../images/logo.png';
import {
  USER_GET,
  USER_GET_ALL,
  USER_LOGIN,
  USER_LOGOUT
} from '../graphql/users'

const { Header, Content, Footer, Sider} = Layout;

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [searchCollapsed, setSearchCollapsed] = useState(true);
  const [lastEvent, setLastEvent] = useState('')
	const [currentEvent, setCurrentEvent] = useState('home')
  const [mainDisplay, setMainDisplay] = useState(<HOMEPAGE/>)
  const [logIN, setLogIN] = useState(false)
  const [selectTags, setSelectTags] = useState([])

  const [logout] = useMutation(USER_LOGOUT)
  const {loading: UserLoading, data: currentUser, refetch: userRefetch} = useQuery(USER_GET)
  const {data: userData, refetch: userAllRefetch} = useQuery(USER_GET_ALL)

  const allRef = useRef()  

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

  // trigger when upload
  const whenUpload = async() => {
    // console.log("whenUpload")
    if(allRef.current){
      allRef.current.uploadUpdate()
    }
  }

  const onLogin = async() => {
    await userRefetch()
    await userAllRefetch()
  }

  const getUserByID = (id) => {
    if(!userData){ return null }
    return userData.getUsers.find(user => user._id === id) || {name: 'unknown user', avatar: "unset"}
  }

  useEffect(()=>{
    switch(currentEvent){
      case 'home':
        setMainDisplay(<HOMEPAGE/>)
        break
      case 'search':
        setMainDisplay(<SEARCH selectTags={selectTags} getUserByID={getUserByID}/>)
        break
      case 'all':
        setMainDisplay(
        <ALL 
          ref = {allRef}
          getUserByID={getUserByID}
        />)
        break
      case 'upload':
        setMainDisplay(
        <UPLOAD 
          user={currentUser.getUser}
          AppWhenUpload={whenUpload}
        />)
        break
      default:
        setMainDisplay(<HOMEPAGE/>)
        break
    }
  }, [currentEvent, selectTags])

  // handle actions on event change
  useEffect(()=>{
    console.log(`Event Change: ${lastEvent} to ${currentEvent}`)

  }, [currentEvent])

  // auto login
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
          <img className="logo" src={logo}/>
          {(menuCollapsed)?<></>:<h1 style={{color: "white", margin: 5}}> AlpacAlbum </h1>}
        </div>
        <Menu theme="dark" mode="inline" style={{ textAlign: 'center' }} defaultSelectedKeys={['1']}>
          <Menu.Item key="1" 
           	icon={<HomeOutlined />} 
           	onClick={()=>{setLastEvent(currentEvent);setCurrentEvent("home");setSearchCollapsed(true);}}>
           	Home Page
          </Menu.Item>
          	{searchCollapsed?
            	<Menu.Item 
           	   	key="2" 
           	   	icon={<SearchOutlined/>} 
           	   	onClick={() => {setSearchCollapsed(false);setLastEvent(currentEvent);setCurrentEvent("search");setMenuCollapsed(false);}}>
            		Search by Tags
            	</Menu.Item>
              :
             	<SEARCH_SIDER onChange={setSelectTags}/>
            }
          <Menu.Item key="3" icon={<PictureOutlined />}
          	onClick={()=>{setLastEvent(currentEvent);setCurrentEvent("all");setSearchCollapsed(true);}}>
          	View All Albums
          </Menu.Item>
          <Menu.Item key="4" icon={<UploadOutlined />}
            onClick={()=>{setLastEvent(currentEvent);setCurrentEvent("upload");setSearchCollapsed(true);}}>
            Upload photos
          </Menu.Item>
        </Menu>
      </Sider>)
      :
      (<></>)}
      <Layout className="site-layout">
      	<Header className="header">
          <div className="user">
            {logIN?
              <>
                <USER_DRAWER UserLoading={UserLoading} currentUser={currentUser}/>
                <div>
                  <Popconfirm placement="bottom" onConfirm={handleLogOut} 
                    title="Are you sure you want to logout?"
                    okText="Yes" cancelText="No"
                  >
                    <Button ghost="true" size="small" style={{color:"white", borderColor: "gray", marginLeft: 10}}> 
                      Logout 
                    </Button>
                  </Popconfirm>
                </div>
              </>:
              <div>
                <LOGIN_DRAWER setLogIN={setLogIN} userRefetch={onLogin}/>
                <Button type="link" href="/#/register" size="small" style={{color:"white", borderColor: "gray", marginLeft: 10}}> 
                  Sign up
                </Button>
              </div>
            }
          </div>
      	</Header>
        <Content style={{ margin: '0 16px' }}>
          {UserLoading ? '' :
            logIN ? 
              mainDisplay
              :(
              <div className="main-display-home">
                <div className="image-display">
                  <img src={alpaca}/>
                </div>
              </div>
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           @2021 WebProgramming, Group 66
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
