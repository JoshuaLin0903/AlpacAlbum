import React, {useState, useEffect} from 'react'
import {Drawer, Avatar, Button, Popconfirm, Divider, Popover, Collapse, Input, message, Tooltip} from 'antd'
import {UserOutlined, SettingOutlined, LogoutOutlined, KeyOutlined} from '@ant-design/icons';
import {useQuery, useMutation } from '@apollo/react-hooks'
import '../style.css';
import {USER_GET,PWD_CHECK,USER_LOGOUT,AVATAR_CHANGE,NAME_CHANGE} from '../graphql/users'
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
import logo from '../images/logo.png';

const {Panel} = Collapse

const avatar_src = [pig, unset, shark, giwua, strongSiba, siba, tableCat, duck, guineaPig, smileCat]
const avatar = ["pig", "unset", "shark", "giwua", "strongSiba", "siba", "tableCat", "duck", "guineaPig", "smileCat"]
const tt = ["CutPig", "Alpaca", "Shark", "Giwuawua", "StrongSiba", "Siba", "TableCat", "Duck", "GuineaPigCar", "PoliteCat"]

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
				break;
			case 'pig':
				return (<Avatar src={pig} style={style} size={size}/>)
				break
			case 'shark':
				return (<Avatar src={shark} style={style} size={size}/>)
				break
			case 'giwua':
				return (<Avatar src={giwua} style={style} size={size}/>)
				break
			case 'strongSiba':
				return (<Avatar src={strongSiba} style={style} size={size}/>)
				break
			case 'siba':
				return (<Avatar src={siba} style={style} size={size}/>)
				break
			case 'tableCat':
				return (<Avatar src={tableCat} style={style} size={size}/>)
				break
			case 'duck':
				return (<Avatar src={duck} style={style} size={size}/>)
				break
			case 'guineaPig':
				return (<Avatar src={guineaPig} style={style} size={size}/>)
				break
			case 'smileCat':
				return (<Avatar src={smileCat} style={style} size={size}/>)
				break
			default:
        return (<Avatar src={unset} style={style} size={size}/>)
        break
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
  			{avatar.map((m,i) => {
  				if(m !== profilePic){
  					count = count + 1
  					if((count)%3 === 0){
						return(<>
							<Tooltip title={tt[i]} placement="bottom">
								<img key={i} src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)}/>
							</Tooltip>
							<br/></>)
					}
           			else return(
           			<Tooltip title={tt[i]} placement="bottom">
           				<img key={i} src={avatar_src[i]} className="avatar_choose" onClick={()=>setProfilePic(m)}/>
           			</Tooltip>
           			)
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
		const {data} = await usernameChange({variables:{
			name: _name,
			name_new: NewUsername
		}})
	}catch(e){
		console.log(e.message)
		switch(e.message){
			case 'User not found!':
				message.error('User not found!')
				return;
				break;
			case 'Username taken!':
				message.error('Username taken!')
				return;
				break;
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
		const {data} = await pwdCheck({variables: { 
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
			break;
			case 'GraphQL error: Password cannot be empty':
				message.error('Password cannot be empty!')
				return;
				break;
			case 'GraphQL error: Please confirm your new password':
				message.error('Please confirm your new password!')
				return;
				break;
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
			<Tooltip title="User Settings" placement="bottom">
      	{currentAvatar({marginRight: 8}, "default")}
      </Tooltip>
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
						<Tooltip title="Click to change!" placement="bottom">
						 {currentAvatar('', 80)}
						</Tooltip>
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
			<div style={{position: "absolute", bottom: 35, right: 0}}>
			<img src={logo} style={{width: 40, height: 40}}/>
			<Popconfirm placement="top" 
				onConfirm={handleLogOut} 
				title="Are you sure you want to logout?"
				okText="Yes"
				cancelText="No"
			>
				<Button icon={<LogoutOutlined />} type="text" shape="round"> 
					Logout 
				</Button>
			</Popconfirm>
			</div>
		</Drawer>
    </>
		
	)
}