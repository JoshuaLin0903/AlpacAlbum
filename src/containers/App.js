import '../style.css';
import {HOMEPAGE, SEARCH, UPLOAD, ALL, SEARCH_SIDER} from '../components'
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import { Layout, Menu} from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  PictureOutlined,
  HeartTwoTone,
  HomeOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider} = Layout;

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
	const [searchCollapsed, setSearchCollapsed] = useState(true);
	const [currentEvent, setCurrentEvent] = useState('home')
  const [mainDisplay, setMainDisplay] = useState(<HOMEPAGE/>)

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
      case 'upload':
        setMainDisplay(<UPLOAD/>)
        break
      case 'all':
        setMainDisplay(<ALL/>)
        break
      default:
        setMainDisplay(<HOMEPAGE/>)
        break
    }
  }, [currentEvent])

  return (
   	<Layout style={{ minHeight: '100vh'}}>
     	<Sider  
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
             	<SEARCH_SIDER/>
            }
          <Menu.Item key="3" icon={<UploadOutlined />} 
          	onClick={()=>{setCurrentEvent("upload");setSearchCollapsed(true);}}>
          	Add New Photos
          </Menu.Item>
          <Menu.Item key="4" icon={<PictureOutlined />}
          	onClick={()=>{setCurrentEvent("all");setSearchCollapsed(true);}}>
          	View All Albums
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
      	<Header className="header" style={{ padding: 0, textAlign: 'center' }}>
      	</Header>
        <Content style={{ margin: '0 16px' }}>
       		<div className="main-display">
       	    {mainDisplay}
        	</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}

export default App;
