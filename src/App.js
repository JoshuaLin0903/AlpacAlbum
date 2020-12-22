import './App.css';
import React, { useEffect, useRef, useState } from 'react'
import alpaca from './alpaca.png';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb, Collapse, Tag, Button, Input} from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  PictureOutlined,
  HeartTwoTone,
  StarFilled,
  CheckCircleTwoTone,
  LoadingOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider} = Layout;
const { Panel } = Collapse;
const { SubMenu } = Menu;
const {Search, AutoComplete} = Input;
const { CheckableTag } = Tag;

const tagsData = ['Favorite', 'Alpaca', 'Kpop', 'Daily', 'GreenIsland'];

function App() {
	const [menuCollapsed, setMenuCollapsed] = useState(true);
	const [searchCollapsed, setSearchCollapsed] = useState(true);
	const [selectedTags, setSelectedTags] = useState([]);
	const [currentEvent, setCurrentEvent] = useState('home')

	const chooseTags = (tag, checked) => {
    	const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    	console.log(nextSelectedTags)
    	setSelectedTags(nextSelectedTags);
  	}

  	const closeTags = (tag) => {
  		const updateSelectedTags = selectedTags.filter(t => t != tag);
  		setSelectedTags(updateSelectedTags)
  	}

  	const handleMenuCollapse =() =>{
  		if (menuCollapsed === false && searchCollapsed === false){
  			setSearchCollapsed(true);
  		}
  		setMenuCollapsed(!menuCollapsed);
  	}

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
             		   	</Menu.Item>:
             		   	<Collapse defaultActiveKey={['1']}>
             		   		<Panel 
             		   		showArrow={false} 
             		   		header={<><SearchOutlined/> Search by Tags</>}
             		   		key="1">
             		   			<div style={{margin: '5px'}}>
  									<Search 
  									allowClear 
  									style={{ width: 400, margin: '10px' }}/>
  								</div>
             		   			<div className="chosen_tag_block">
             		   				<Tag icon={<StarFilled />} color="success" style={{marginTop: "5px"}}>
             		   					Selected
             		   				</Tag>
             		   				: 
             		   				{selectedTags.map(tag => (
             		   					<Tag 
             		   					key={tag} 
             		   					closable={true} 
             		   					style={(selectedTags.indexOf(tag)==0)?{
             		   						marginLeft: "5px",marginTop: "5px"}:{marginLeft: "0px",marginTop: "5px"}} 
             		   					onClose={() => closeTags(tag)}>
             		   						{tag}
             		   					</Tag>
             		   				))}
             		   				{selectedTags.length?
             		   					<Button size="small" 
             		   					style={{float:"right", margin: "5px 28px 0px 5px"}} 
             		   					icon={<CheckCircleTwoTone twoToneColor="#52c41a"/>}/>:
             		   					<></>
             		   				}
             		   			</div>
             		   			<div className="tags_group">
             		   				{tagsData.map(tag => (
          								<CheckableTag
            							key={tag}
           	 							checked={selectedTags.indexOf(tag) > -1}
            							onChange={checked => chooseTags(tag, checked)}
          								>
            							#{tag}
          								</CheckableTag>
        							))}
             		   			</div>
             		   		</Panel>
             		   	</Collapse>
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
       				{(currentEvent === "home")?
              			<div className="image-display">
              				<img src={alpaca}/>
              			</div>:
              		(currentEvent === "search")?
          			<LoadingOutlined style={{fontSize: "300%", color: "blue"}}/>:
          			(currentEvent === "upload")?
          			<div>Add new albums</div>:
          			<div>View all photos</div>
          			}
            		</div>
          		</Content>
          		<Footer style={{ textAlign: 'center' }}></Footer>
        	</Layout>
      	</Layout>
  	);
}

export default App;
