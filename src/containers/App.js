import '../style.css';
import {HOMEPAGE, SEARCH, ALL, SEARCH_SIDER, UPLOAD} from '../components'
import React, { useEffect, useState } from 'react'
import {login} from '../axios'
import 'antd/dist/antd.css';
import alpaca from '../images/alpaca.png';
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

const { Header, Content, Footer, Sider} = Layout;

const tagsData = [
  {
    name:"Alpaca",
    url: ["https://i.imgur.com/bV5jJrH.jpg",
          "https://i.imgur.com/ludVJvI.jpg"]
  },
  {
    name:"Kpop",
    url: ["https://i.imgur.com/c6if1kt.jpg",
          "https://i.imgur.com/K8k0wLj.jpg", 
          "https://i.imgur.com/ELXQPjH.jpg",
          "https://i.imgur.com/wR6BQDg.jpg",
          "https://i.imgur.com/VsoXPpZ.jpg"]
  },
  {
    name:"Dogs",
    url: ["https://i.imgur.com/jHn4PtZ.jpg",
          "https://i.imgur.com/Mbvj7uh.jpg",
          "https://i.imgur.com/wVfCR83.jpg",
          "https://i.imgur.com/LVY7GMC.jpg"]
  }
]
const tagName = tagsData.map((t) => {return t.name})

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
	const [searchCollapsed, setSearchCollapsed] = useState(true);
	const [currentEvent, setCurrentEvent] = useState('home')
  const [mainDisplay, setMainDisplay] = useState(<HOMEPAGE/>)
  const [logIN, setLogIN] = useState(false)
  const [username, setUserName] = useState('')
  const [password, setPassword]= useState('')

  const handleLogIn = async () => {
    const msg = await login(password)
    if (username === '' || password === ''){
      message.error('Both username and password must be entered!')
    }
    else if(msg === 'Wrong password')
    {
      message.error('Wrong password!')
    }
    else if(msg === 'Correct password')
    {
      message.success('Successfully login!')
      setLogIN(true)
    }
  }

  const handleLogOut = () =>{
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
        setMainDisplay(<ALL tagsData={tagsData}/>)
        break
      case 'upload':
        setMainDisplay(<UPLOAD tagsData={tagsData} taglist={tagName}/>)
        break
      default:
        setMainDisplay(<HOMEPAGE/>)
        break
    }
  }, [currentEvent])

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
                {username}
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
