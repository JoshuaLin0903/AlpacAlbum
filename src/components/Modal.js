import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import {Avatar, Button, Divider, Collapse, Tag, Input} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined,
  TagsOutlined
} from '@ant-design/icons';

import '../style.css'
import {
	TAG_ALL
} from '../graphql/tags'
  
const {Panel} = Collapse

const TAG_MODAL = ({img, visible}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])
	const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	const leftTags = tagData.tags.concat(img.tags).filter((v,i,arr) => (arr.indexOf(v) === arr.lastIndexOf(v)))
	console.log(leftTags)

	const removeDel = (e,tag) => {
		e.preventDefault()
		var buf = del.filter((t) => (t !==tag ))
		setDelete(buf)
	}

	const removeAdd = (e,tag) => {
		e.preventDefault()
		var buf = add.filter((t) => (t !==tag ))
		setAdd(buf)
	}

	const removeNew = (tag) => {
		var buf1 = add.filter((t) => (t !==tag ))
		var buf2 = newTagList.filter((t) => (t !==tag ))
		setAdd(buf1)
		setNewTagList(buf2)
		setNewTag('')
	}

	const handleNewTagList = (newTag) =>{
		if (tagData.tags.indexOf(newTag) === -1) {
			setNewTagList([...newTagList, newTag])
		}
		setNewTag('')
	}


	return(
		<div style={{width: "100%"}}>
		 <h2> Change Tags </h2>
		 <Divider style={{marginTop: 0}}/>
		 <Collapse expandIcon={({isActive}) => <TagsOutlined rotate={isActive ? 90 : 0}/>}
		 	defaultActiveKey={["1"]}>
		 	<Panel header="Current Tags" key="1">
		 		<div className="change_tag_cur">
		 			<h4 style={{color: "#3b5999"}}> Click the tag you want to remove </h4>
		 			{(img.tags.length)?
		 				(img.tags.map((tag) => {
		 					return(
		 						((del.indexOf(tag) === -1)?
		 						(<Tag.CheckableTag key={tag} 
		 							onChange={() => setDelete([...del, tag])}>
             			#{tag}
            		</Tag.CheckableTag>)
            		:
            		(<Tag key={tag} closable={true} color="#f50" onClose={(e) => removeDel(e,tag)}>
             			{tag}
            		</Tag>)
            	))}))
		 				: 
		 					(<p> This picture doesn't have any tags. </p>)}
		 		</div>
		 	</Panel>
		 	<Panel header="Add new Tags" key="2">
		 		<div className="change_tag_cur">
		 			<h4 style={{color: "#3b5999"}}> Click the tag you want to add </h4>
		 			{leftTags.map((tag) =>{
						return (
							((add.indexOf(tag) === -1)?
		 						(<Tag.CheckableTag key={tag} 
		 							onChange={() => setAdd([...add, tag])}>
             			#{tag}
            			</Tag.CheckableTag>)
            			:
            		(<Tag key={tag} closable={true} color="#108ee9" onClose={(e) => removeAdd(e,tag)}>
             			{tag}
            		</Tag>)
           ))})
          }
		 		</div>
		 		<Input.Search
		 			style={{margin: 10, width: "97%"}}
       		enterButton="Add"
       		placeholder="Enter the new tag you want to add"
       		value={newTag}
       		onChange={(e) => setNewTag(e.target.value)}
       		onSearch={() => {setAdd([...add, newTag]);handleNewTagList(newTag);}}
       	/>
       	<div style={{marginLeft: 10}}>
       	{
       		newTagList.map((tag) => {
       			return(
       				<Tag closable={true} key={tag} color="#87d068" onClose={() => removeNew(tag)}>
       					{tag}
       				</Tag>
       			)
       		})
       	}
       	</div>
		 	</Panel>
		 </Collapse>
		 <div style={{position:"absolute", bottom: 60, display: "flex", flexDirection: "row"}}>
		 	{(add.length || del.length)? <div> Result: </div> : <></>}
		 		{del.length?
		 			<Tag color="red" style={{marginLeft: 5}}>
		 		 	Remove
		 			{del.map((tag) => {
		 				return(<> #{tag}</>)
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 		{add.length?
		 			<Tag color="blue" style={{marginLeft: 5}}>
		 		 	Add
		 			{add.map((tag) => {
		 				return(<> #{tag}</>)
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 </div>
		</div>
	)
}


const VIEW_MODAL = ({img}) => {
	const Today = new Date()
	const today = { year: Today.getFullYear().toString(), month : (Today.getMonth()+1).toString(), date : Today.getDate().toString()}

	const determinState = (date) => {
		if(!date){
			console.log("no date")
			date = "yyyy/mm/dd"
		}
		const d_sep = date.split('/')
		if(d_sep[0] === today.year && d_sep[1] === today.month && d_sep[2] === today.date)
		{
			return ('today')
		}
		return(date)
	}

	return(
		<>
			<div className="img_big_box">
      	<img className="img_big" src={img.url}/>
    	</div>
      <div className="social">
      	<div className="social-publish-data">
      		<div style={{paddingTop: 7}}> <Avatar icon={<UserOutlined/>} size="large"/> </div>
      			<div className="publish-data-word">
      				<p style={{margin: 0, fontWeight: "bold", fontSize: 20}}> {(img.author) ? img.author : "author"} </p>
      				<p style={{margin: 0, fontStyle: "italic", fontSize: 12}}> {determinState(img.date)} </p>
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
     </>
	)
}

export {TAG_MODAL, VIEW_MODAL}