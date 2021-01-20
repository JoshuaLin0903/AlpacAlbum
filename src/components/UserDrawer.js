import React, {useState} from 'react'
import {Drawer, Avatar, Button, Popconfirm, Popover, Collapse, Input, message} from 'antd'
import { SettingOutlined, LogoutOutlined, KeyOutlined} from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks'
import '../style.css';
import {PWD_CHECK,USER_LOGOUT,AVATAR_CHANGE,NAME_CHANGE} from '../graphql/users'
import pig from '../images/pig.png';
import unset from '../images/alpaca_i.png';
import shark from '../images/shark.png';
import giwua from '../images/giwua.png';
import strongSiba from '../images/strongSiba.png';
import siba from '../images/siba.png';
import tableCat from '../images/tableCat.png';
import duck from '../images/duck.png';
import guineaPig from '../images/guineaPig.png';
import smileCat from '../images/smileCat.png';

const {Panel} = Collapse

const avatar_src = [pig, unset, shark, giwua, strongSiba, siba, tableCat, duck, guineaPig, smileCat]
const avatar = ["pig", "unset", "shark", "giwua", "strongSiba", "siba", "tableCat", "duck", "guineaPig", "smileCat"]

export const USER_DRAWER = ({user, updUserData}) => {
	//user settings
	const [NewUsername, setNewUserName] = useState('')
	const [CheckPassword, setCheckPassword] = useState('')
 	const [NewPassword, setNewPassword]= useState('')
	const [NewPassword2, setNewPassword2]= useState('')
	const [AvatarSaved, setAvatarSaved] = useState(false)
	//
	const [open, setOpen] = useState(false) 
	const [profilePic, setProfilePic] = useState(user.avatar)

	const [usernameChange] = useMutation(NAME_CHANGE)
	const [avatarChange] = useMutation(AVATAR_CHANGE)
	const [pwdCheck] = useMutation(PWD_CHECK)
	const [logout] = useMutation(USER_LOGOUT)

	const currentAvatar = (style, size) => {
		switch(profilePic){
			case 'unset':
				return (<Avatar src={unset} style={style} size={size}/>)
			case 'pig':
				return (<Avatar src={pig} style={style} size={size}/>)
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
			case 'duck':
				return (<Avatar src={duck} style={style} size={size}/>)
			case 'guineaPig':
				return (<Avatar src={guineaPig} style={style} size={size}/>)
			case 'smileCat':
				return (<Avatar src={smileCat} style={style} size={size}/>)
			default:
        		return (<Avatar src={unset} style={style} size={size}/>)
		}
	}

const handleLogOut = async() =>{
    await logout()
    window.location.reload()
}

  const avatarOption = () => {
	  var count = 0
  	return(
  		<div>
  			{avatar.map((m, i) => {
  				if(m !== profilePic){
  					count = count + 1
  					if((count)%3 === 0){
						return(<><img key={i} src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)} alt=""/><br/></>)
					}
           			else return(<img key={i} src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)} alt=""/>)
				 }
  			})}
  			<div style={{textAlign: 'center', width: "100%", margin: '10px 0px'}}>
  			{!AvatarSaved?(
	  				<Button onClick={handleAvatarChange} type='primary'>save avatar</Button>
	  			):(
	  				<Button	onClick={handleAvatarChange} disabled={true}>saved</Button>)}
	  		</div>
  		</div>
  	)
  }

  const handleUsernameChange = async()=>{
	const _name = user.name;
	try{
		await usernameChange({variables:{
			name: _name,
			name_new: NewUsername
		}})
	}catch(e){
		console.log(e.message)
		switch(e.message){
			case 'User not found!':
				message.error('User not found!')
				return;
			case 'Username taken!':
				message.error('Username taken!')
				return;
			default:
				break;
		}
	}
	alert('Username changed! Please log in again!')
	logout()
	window.location.reload()
  }
  const handleAvatarChange = async()=>{
	  const _name = user.name;
	  const _avatar = user.avatar;
	  const new_avatar = profilePic;
	  try{
		  await avatarChange({variables:{
			  name: _name,
			  avatar: _avatar,
			  avatar_new: new_avatar
		  }})
	  }catch(e){
		  //console.log(e.message)
	  }
	  setAvatarSaved(true)
	  updUserData()

  }
  const handlePwdChange = async()=>{
	try{
		await pwdCheck({variables: { 
									name: user.name, 
									password: CheckPassword,
									password_new: NewPassword,
									password_new2: NewPassword2
								}})
		message.success('Success! Please log in again!')
	} catch(e){
		console.log(e.message)
		switch (e.message) {
		  case 'GraphQL error: Invaild password!' :
			message.error('Wrong current password!')
			return;
			case 'GraphQL error: Password cannot be empty':
				message.error('Password cannot be empty!')
				return;
			case 'GraphQL error: Please confirm your new password':
				message.error('Please confirm your new password!')
				return;
		  default:
			break;
		}
	}
	message.success('Success! Please log in again!')
	alert('Success! Please Log in again!')
	logout()
	window.location.reload()

  }

	return(
		<>
		<div className="userAvatar" onClick={() => setOpen(!open)}>
      		{currentAvatar({marginRight: 8}, "default")}
    		{user.name}
    	</div>

		<Drawer
			title={<><SettingOutlined /> User Settings </>}
			placement="right"
			closable={false}
			visible={open}
			onClose={() => setOpen(false)}
			width={300}
		>
			<br/>
				<Popover title="Choose a new avatar" placement="bottom" trigger="click" content={avatarOption} 
				onVisibleChange={(vis) => {if(vis) {setAvatarSaved(false)};setProfilePic(user.avatar);}}>
					<div className="userSettingAva">
						{currentAvatar('', 80)}
					</div>
				</Popover>
				<h1 style={{textAlign: 'center', color: "#483D8B"}}> {user.name} </h1>
			<br/>
			<Collapse style={{textAlign: 'center'}}>
				<Panel showArrow={false} header={<><KeyOutlined /> Change your username</>} key="1">
				<Input placeholder="Your new username"
					style={{width:200, margin:5}}
					onChange={(e) => setNewUserName(e.target.value)}
					/>
				<Button style={{margin:5}} type="primary"
					onClick={handleUsernameChange}
				> 
					Confirm 
				</Button>
				</Panel>
			</Collapse>
			<Collapse style={{textAlign: 'center'}}>
				<Panel showArrow={false} header={<><KeyOutlined /> Change your password </>} key="1">
				<Input.Password placeholder="Your current password"
					style={{width:200, margin:5}}
					onChange={(e) => setCheckPassword(e.target.value)}
					/>
				<Input.Password placeholder="New password"
					style={{width:200, margin:5}}
					onChange={(e) => setNewPassword(e.target.value)}
					/>
				<Input.Password placeholder="Confirm new password"
					style={{width:200, margin:5}}
					onChange={(e) => setNewPassword2(e.target.value)}
					/>
				<Button style={{margin:5}} type="primary"
					onClick={handlePwdChange}
				> 
					Confirm 
				</Button>
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