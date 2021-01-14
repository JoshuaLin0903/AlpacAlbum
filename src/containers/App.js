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
  USER_LOGOUT
} from '../graphql/users'
import {
  TAG_ALL
} from '../graphql/tags'

const { Header, Content, Footer, Sider} = Layout;

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [searchCollapsed, setSearchCollapsed] = useState(true);
  const [lastEvent, setLastEvent] = useState('')
	const [currentEvent, setCurrentEvent] = useState('home')
  const [mainDisplay, setMainDisplay] = useState(<HOMEPAGE/>)
  const [logIN, setLogIN] = useState(false)
  const [username, setUserName] = useState('')
  const [password, setPassword]= useState('')
  const [updPreview, setUpdPreview] = useState(false)

  const [login] = useMutation(USER_LOGIN)
  const [logout] = useMutation(USER_LOGOUT)
  const {loading: UserLoading, data: currentUser, refetch: userRefetch} = useQuery(USER_GET)
  const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

  const handleLogIn = async () => {
    if (username === '' || password === ''){
      message.error('Both username and password must be entered!')
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

  // trigger when upload
  const whenUpload = async() => {
    setUpdPreview(true);
    await tagRefetch();
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
        setMainDisplay(
        <ALL 
          taglist={tagLoading ? [] : tagData.tags}
          updPreview={updPreview}
        />)
        break
      case 'upload':
        setMainDisplay(
        <UPLOAD 
          taglist={tagLoading ? [] : tagData.tags} 
          user={UserLoading?'':currentUser.getUser.name}
          AppWhenUpload={whenUpload}
        />)
        break
      default:
        setMainDisplay(<HOMEPAGE/>)
        break
    }
  }, [currentEvent])

  // handle actions on event change
  useEffect(()=>{
    console.log(`Event Change: ${lastEvent} to ${currentEvent}`)
    if(lastEvent === 'all'){
      if(updPreview){
        setUpdPreview(false)
      }
    }

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
     			<HeartTwoTone twoToneColor="#eb2f96"/>
       			LOGO
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
             	<SEARCH_SIDER taglist={tagLoading ? [] : tagData.tags}/>
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
          {logIN?
          <>
            <div className="user">
              <div>
                <Avatar icon={<UserOutlined/>} style={{marginRight: 8}}/>
                {UserLoading ? '' : currentUser.getUser.name}
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
          {UserLoading ? '' :
            logIN ? 
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
        <Footer style={{ textAlign: 'center' }}>
           No a user yet?
           <a href="/#/register">Click to register!</a>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
