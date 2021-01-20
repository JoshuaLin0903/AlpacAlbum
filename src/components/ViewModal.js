import React, {useState, useEffect} from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {Avatar, Button, Divider, Tag, Input, message, Tooltip, Popconfirm} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined,
  LeftOutlined,
  RightOutlined,
  LoadingOutlined, 
  CloseCircleOutlined
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_SINGEL_QUERY
} from '../graphql/images'
import {
	COMMENT_CREATE
} from '../graphql/comments'

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

const userAvatar = (avatar) => {
	switch(avatar){
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
		case 'duck':
			return (duck)
			break
		case 'guineaPig':
			return (guineaPig)
			break
		case 'smileCat':
			return (smileCat)
			break
		default:
	return (unset)
	break
	}
}

const COMMENT = ({comment, getUserByID}) => {
	const author = getUserByID(comment.author)
	const deleteComment = () => {

	}

	return(
		<div className="comment-div">
			<Avatar src={userAvatar(author.avatar)} size="large"/>
			<div className="comment-show"> 
				<div style={{width: "90%"}}>
					<div style={{fontWeight: "bold"}}> {author.name} </div> 
					<div> {comment.text} </div> 
				</div>
				<Popconfirm placement="bottom" onConfirm={deleteComment}
					title="Are you sure you want to delete this comment?" 
					okText="Yes" cancelText="No" 
				>
					<Button icon={<CloseCircleOutlined />} type="text"/>
				</Popconfirm>
			</div>
		</div>
	)
}
  
const VIEW_MODAL = ({user, image, getUserByID}) => {
	const [img, setImg] = useState(image)
	const [loading, setLoading] = useState(true)
	const [ImgLoading, setImgLoading] = useState(false)
	const [onInput, setOnInput] = useState('')
	const {loading: imgDataLoading, data} = useQuery(IMAGE_SINGEL_QUERY, {variables: {id: img._id}})
	const [addComment] = useMutation(COMMENT_CREATE)

	const Today = new Date()
	const today = { year: Today.getFullYear().toString(), month : (Today.getMonth()+1).toString(), date : Today.getDate().toString()}

	useEffect(()=>{
		if(data && !imgDataLoading){
			Object.assign(img, data.imgData)
			if(typeof img.author === 'string'){
				img.author = getUserByID(img.author)
			}
			else{
				img.author = getUserByID(img.author._id)
			}
			console.log(img)
			setLoading(false)
		}
	}, [data, imgDataLoading, img])

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
			addComment({variables: {picID: img._id, author: user._id, comment: onInput}})
			img.comments.push({author: user._id, text: onInput})
			setOnInput('')
			e.target.value = ''
		}
	}

	const setFocus = () => {
		const input = document.getElementById("input")
		input.focus()
	}

	const nextPic = () => {
		setLoading(true)
		setImgLoading(false)
		setImg(img.next)
	}

	const prevPic = () => {
		setLoading(true)
		setImgLoading(false)
		setImg(img.prev)
	}

 
	return(
		<>
			<div className="viewBut"> 
				<Tooltip placement="bottom" title="Previous">
					<Button icon={<LeftOutlined />} disabled={img.prev === null} onClick={prevPic}/>
				</Tooltip>
			</div>
			<div className="img_big_box">
				<img className="img_big" src={img.url} onLoad={() => {setImgLoading(true)}} style={{ opacity: ImgLoading ? 1 : 0 }}/>
				{ImgLoading?<></>:
					<div style={{position: "absolute", top: "50%", left: "50%"}}> <LoadingOutlined style={{color: "white"}}/> </div>
				}
			</div>
			<div className="social">
				<div className="social-publish-data">
					<div style={{paddingTop: 7}}> <Avatar src={userAvatar(img.author.avatar)} size={50}/> </div>
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
					<Button icon={<HeartOutlined />} style={{width: "50%"}}/>
					<Button icon={<CommentOutlined />} style={{width: "50%"}} onClick={setFocus}/>
				</div>
				<br/>
				{loading ? <></> :
					<div className="comments">
						{img.comments.map((c, idx) => {
							return(
								<COMMENT comment={c} getUserByID={getUserByID} key={idx}/>
							)
						})}
					</div>
				}
				<div className="comment-div">
					<Avatar src={userAvatar(user.avatar)} size={"large"}/>
					<input className="comment-input" id="commentInput" type="text" placeholder="Write a comment"
						onChange={(e) => setOnInput(e.target.value)} onKeyPress={(e) => submitComment(e)} id="input"/>
				</div>
			</div>
			<div className="viewBut"> 
				<Tooltip placement="bottom" title="Next">
					<Button icon={<RightOutlined />} disabled={img.next === null} onClick={nextPic}/> 
				</Tooltip>
			</div>
     </>
	)
}

export {VIEW_MODAL}