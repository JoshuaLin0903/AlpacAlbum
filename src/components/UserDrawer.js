import React, {useState} from 'react'
import {Drawer, Avatar, Button, Popconfirm, Divider, Popover, Collapse, Input} from 'antd'
import {UserOutlined, SettingOutlined, LogoutOutlined, KeyOutlined} from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks'
import '../style.css';
import {USER_LOGOUT} from '../graphql/users'
import pig from '../images/pig.png';
import alpaca from '../images/alpaca_i.png';
import shark from '../images/shark.png';
import giwua from '../images/giwua.png';
import strongSiba from '../images/strongSiba.png';
import siba from '../images/siba.png';
import tableCat from '../images/tableCat.png';

const {Panel} = Collapse

const avatar_src = [pig, alpaca, shark, giwua, strongSiba, siba, tableCat]
const avatar = ["pig", "alpaca", "shark", "giwua", "strongSiba", "siba", "tableCat"]

export const USER_DRAWER = ({UserLoading, currentUser}) => {
	const [open, setOpen] = useState(false) 
	const [profilePic, setProfilePic] = useState('unset')

	const [logout] = useMutation(USER_LOGOUT)

	const currentAvatar = (style, size) => {
		switch(profilePic){
			case 'unset':
				return (<Avatar icon={<UserOutlined/>} style={style} size={size}/>)
				break;
			case 'pig':
				return (<Avatar src={pig} style={style} size={size}/>)
				break
			case 'alpaca':
				return (<Avatar src={alpaca} style={style} size={size}/>)
			case 'shark':
				return (<Avatar src={shark} style={style} size={size}/>)
			case 'giwua':
				return (<Avatar src={giwua} style={style} size={size}/>)
			case 'strongSiba':
				return (<Avatar src={strongSiba} style={style} size={size}/>)
			case 'siba':
				return (<Avatar src={siba} style={style} size={size}/>)
			case 'tableCat':
				return (<Avatar src={tableCat} style={style} size={size}/>)
			default:
        return (<Avatar icon={<UserOutlined/>} style={style} size={size}/>)
        break
		}
	}

	const handleLogOut = async() =>{
    await logout()
    window.location.reload()
  }

  const avatarOption = () => {
  	return(
  		<div>
  			{avatar.map((m,i) => {
          if((i+1)%3 === 0){
            return(<><img src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)}/><br/></>)
          }
  				else return(<img src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)}/>)
  			})}
  		</div>
  	)
  }

	return(
		<>
		<div className="userAvatar" onClick={() => setOpen(!open)}>
      {currentAvatar({marginRight: 8}, "default")}
    	{UserLoading ? '' : currentUser.getUser.name}
    </div>

    <Drawer
   	title={<><SettingOutlined /> User Settings </>}
  	placement="right"
  	closable={false}
   	visible={open}
   	onClose={() => setOpen(false)}
   	width={300}
   	>
   		<Popover title="Choose a new avatar" placement="bottom" trigger="click" content={avatarOption}>
   			<div className="userSettingAva">
   				{currentAvatar('', 80)}
   			</div>
   		</Popover>
   		<h1 style={{textAlign: 'center', color: "#483D8B"}}> {currentUser.getUser.name} </h1>
      <br/>
      <Collapse style={{textAlign: 'center'}}>
        <Panel showArrow={false} header={<><KeyOutlined /> Change your password </>} key="1">
          <Input.Password placeholder="Your current password"
            style={{width:200, margin:5}}/>
          <Input.Password placeholder="New password"
            style={{width:200, margin:5}}/>
          <Button style={{margin:5}} type="primary"> Confirm </Button>
        </Panel>
      </Collapse>
  		<Popconfirm placement="top" 
        onConfirm={handleLogOut} 
        title="Are you sure you want to logout?"
        okText="Yes"
        cancelText="No"
      >
    		<Button style={{position: "absolute", bottom: 35, right: 0}}
     			icon={<LogoutOutlined />} type="text" shape="round"> 
     			Logout 
     		</Button>
     	</Popconfirm>
   	</Drawer>
    </>
		
	)
}