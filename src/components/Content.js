import React, {useState} from 'react'
import '../style.css'
import {Modal, Avatar, Button} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined
} from '@ant-design/icons';

const Single_pic = ({url, author, date}) => {
	console.log(date)
	const [visible, setVisible] = useState(false)

	const Today = new Date()
	const today = { year: Today.getFullYear().toString(), month : (Today.getMonth()+1).toString(), date : Today.getDate().toString()}

	const len = url.length
	const new_u = url.substr(0,len-4)+'b.jpg'

	const determinState = () => {
		const d_sep = date.split('/')
		if(d_sep[0] === today.year && d_sep[1] === today.month && d_sep[2] === today.date)
		{
			return ('today')
		}
		return(date)
	}

	return(
		<>
			<img className="img-show" onClick={() => setVisible(true)} src={new_u}/>
			<Modal
				bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1250}
      >
      		<div className="img_big_box">
      			<img className="img_big" src={url}/>
      		</div>
      		<div className="social">
      			<div className="social-publish-data">
      				<div style={{paddingTop: 7}}> <Avatar icon={<UserOutlined/>} size="large"/> </div>
      				<div className="publish-data-word">
      					<p style={{margin: 0, fontWeight: "bold", fontSize: 20}}> {author} </p>
      					<p style={{margin: 0, fontStyle: "italic", fontSize: 12}}> {determinState(date)} </p>
      				</div>
      			</div>
      			<br/>
      			<div className= "social-button">
      				<Button icon={<HeartOutlined />} style={{width: "50%"}}> like </Button>
      				<Button icon={<CommentOutlined />} style={{width: "50%"}}> comment </Button>
      			</div>
      			<div className="comment">
      				
      			</div>
      		</div>
      	
			</Modal>
		</>
	)
}

export const CONTENT = ({imgData, choose}) => {
	//album content
	const cor_img = imgData.filter((im) => (im.tags.indexOf(choose) !== -1))
	const URL = cor_img.map((im) => {return(im.url)})
	const AUTHOR = cor_img.map((im) => {return(im.author)})
	const DATE = cor_img.map((im) => {return(im.date)})

	return(
		<div>
			{
				URL.map((u,i) => {
					const len = u.length
					const new_u = u.substr(0,len-4)+'b.jpg'
					return (<Single_pic url={u} author={AUTHOR[i]} date={DATE[i]}/>)})
			}
		</div>
	)
}