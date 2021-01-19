import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import {Avatar, Button, Divider, Tag, Input, message} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_SINGEL_QUERY
} from '../graphql/images'
import {
  USER_GET
} from '../graphql/users'

import pig from '../images/pig.png';
import unset from '../images/alpaca_i.png';
import shark from '../images/shark.png';
import giwua from '../images/giwua.png';
import strongSiba from '../images/strongSiba.png';
import siba from '../images/siba.png';
import tableCat from '../images/tableCat.png';

const COMMENT = ({currentUser, comment, src}) => {
	return(
		<div className="comment-div">
			<Avatar src={src} size="large"/>
			<div className="comment-input"> 
				<div style={{fontWeight: "bold"}}> {currentUser.getUser.name} </div> 
					<div> {comment} </div> 
			</div>
		</div>
	)
}
  
const VIEW_MODAL = ({img, getUserByID}) => {
	const [loading, setLoading] = useState(true)
	const [comments, setComments] = useState([])
	const [onInput, setOnInput] = useState('')
	const {loading: imgDataLoading, data} = useQuery(IMAGE_SINGEL_QUERY, {variables: {id: img._id}})

	const {loading: UserLoading, data: currentUser, refetch: userRefetch} = useQuery(USER_GET)

	const Today = new Date()
	const today = { year: Today.getFullYear().toString(), month : (Today.getMonth()+1).toString(), date : Today.getDate().toString()}

	useEffect(()=>{
		if(data && !imgDataLoading){
			Object.assign(img, data.imgData)
			if(typeof img.author === 'string'){
				img.author = getUserByID(img.author)
			}
			setLoading(false)
		}
	}, [data, imgDataLoading])

	const determinState = (date) => {
		if(!date){
			date = "yyyy/mm/dd";
		}
		const d_sep = date.split('/')
		if(d_sep[0] === today.year && d_sep[1] === today.month && d_sep[2] === today.date)
		{
			return ('today')
		}
		return(date)
	}

	const submitComment = (e) => {
		if (e.key === 'Enter' && onInput !== ''){
			setComments([...comments, onInput])
			setOnInput('')
		}
	}

	const userAvatar = () => {
		switch(currentUser.getUser.avatar){
			case 'unset':
				return (unset)
				break;
			case 'pig':
				return (pig)
				break
			case 'shark':
				return (shark)
				break
			case 'giwua':
				return (giwua)
				break
			case 'strongSiba':
				return (strongSiba)
				break
			case 'siba':
				return (siba)
				break
			case 'tableCat':
				return (tableCat)
				break
			default:
        return (unset)
        break
		}
	}

	const UA = userAvatar()


	return(
		<>
			<div className="img_big_box">
				<img className="img_big" src={img.url}/>
			</div>
			<div className="social">
				<div className="social-publish-data">
					<div style={{paddingTop: 7}}> <Avatar icon={<UserOutlined/>} size="large"/> </div>
					{loading ? <></> :
						<div className="publish-data-word">
							<p style={{margin: 0, fontWeight: "bold", fontSize: 20}}> {(img.author.name) ? img.author.name : "author"} </p>
							<p style={{margin: 0, fontStyle: "italic", fontSize: 12}}> {determinState(img.date)} </p>
						</div>
					}
				</div>
				<div style={{marginTop: 10}}>
					{img.tags.map((t, idx) => {
						return(
							<Tag color="#108ee9" key={idx}> #{t} </Tag>
						)
					})}
				</div>
				<br/>
				<div className= "social-button">
					<Button icon={<HeartOutlined />} style={{width: "50%"}}> like </Button>
					<Button icon={<CommentOutlined />} style={{width: "50%"}}> comment </Button>
				</div>
				<br/>
				<div className="comments">
					{comments.map((c) => {
						return(
							<COMMENT comment={c} currentUser={currentUser} src={UA}/>
						)
					})}
				</div>
				<div className="comment-div">
					<Avatar src={UA} size="large"/>
					<input className="comment-input" id="commentInput" type="text" placeholder="Write a comment"
						onChange={(e) => setOnInput(e.target.value)} onKeyPress={(e) => submitComment(e)}/>
				</div>
			</div>
     </>
	)
}

export {VIEW_MODAL}