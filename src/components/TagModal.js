import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import {Avatar, Button, Divider, Collapse, Tag, Input, message} from 'antd'
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
import {
	IMAGE_SINGEL_QUERY
} from '../graphql/images'
import tableCat from '../images/tableCat.png'
import giwua from '../images/giwua.png'
  
const {Panel} = Collapse

const TAG_MODAL = ({tagData, updTagDataQuery, img, setTagRecord}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])
	// const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	const leftTags = tagData.concat(img.tags).filter((v,i,arr) => (arr.indexOf(v) === arr.lastIndexOf(v)))

	useEffect(() => {
		setTagRecord({ADD:add,DEL:del})
	}
	,[add,del])

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
		if (tagData.indexOf(newTag) === -1) {
			setNewTagList([...newTagList, newTag])
			updTagDataQuery(prev => {
				const newTags = [...prev.tags, newTag]
				newTags.sort()
				return {tags: newTags}
			})
		}
	}

	const handleEnter = () =>{
		if (img.tags.indexOf(newTag) === -1){
			setAdd([...add, newTag])
			handleNewTagList(newTag)
		}
		else{
			const str = `#${newTag} is already on this picture.`
			message.info(str)
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
		 			{(img.tags.length) ? (
		 				img.tags.map((tag) => {
		 					return(
		 						((del.indexOf(tag) === -1) ? (
									<Tag.CheckableTag key={tag} 
										onChange={() => setDelete([...del, tag])}>
										#{tag}
									</Tag.CheckableTag>
								):(
								<Tag key={tag} closable={true} color="#f50" onClose={(e) => removeDel(e,tag)}>
									{tag}
								</Tag>)
								)
							)
						})
					) : (
						<p> This picture doesn't have any tags. </p>
					)}
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
       		onSearch={handleEnter}
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
		 				return(` #${tag}`)
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 		{add.length?
		 			<Tag color="blue" style={{marginLeft: 5}}>
		 		 	Add
		 			{add.map((tag) => {
		 				return(` #${tag}`)
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 </div>
		</div>
	)
}

const TAG_MODAL_MULTI = ({tagData, album, setTagRecord}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])
	const [remove, setRemove] = useState(false)
	// const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	const leftTags = tagData.filter((t) => (t !== album))

	useEffect(() => {
		setTagRecord({ADD:add,DEL:del})
	}
	,[add,del])

	const removeDel = (tag) => {
		var buf = del.filter((t) => (t !==tag ))
		setDelete(buf)
		setRemove(false)
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
		if (tagData.indexOf(newTag) === -1) {
			setNewTagList([...newTagList, newTag])
		}
		setNewTag('')
	}

	const handleEnter = () =>{
		if (newTag !== album){
			setAdd([...add, newTag])
			handleNewTagList(newTag)
		}
		else{
			const str = `#${newTag} is already on these pictures.`
			message.info(str)
		}
		setNewTag('')
	}


	return(
		<div style={{width: "100%"}}>
		 <h2> Change Tags </h2>
		 <Divider style={{marginTop: 0}}/>
		 {(album === "All")?
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
      <Input.Search
		 		style={{margin: 10, width: "97%"}}
       	enterButton="Add"
       	placeholder="Enter the new tag you want to add"
       	value={newTag}
       	onChange={(e) => setNewTag(e.target.value)}
       	onSearch={handleEnter}
       />
		 </div>
		 :
		 <Collapse expandIcon={({isActive}) => <TagsOutlined rotate={isActive ? 90 : 0}/>}
		 	defaultActiveKey={["1"]}>
		 	<Panel header="Current Tags" key="1">
		 		<div className="change_tag_cur">
		 			<h4 style={{color: "#3b5999"}}> Remove these pictures from #{album}?</h4>
		 			<div style={{display: "flex", flexDirection: "row"}}>
		 				{!(remove)?
		 					<Button type="primary" danger size="small" onClick={() => {setDelete([...add,album]);setRemove(true);}}> Yes </Button>:
		 					<>
		 						<div> You want to remove #{album}. </div>
		 						<Button type="primary" size="small" onClick={() => removeDel(album)} style={{marginLeft: 5}}> Cancel </Button>
		 					</>
		 				}
		 			</div>
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
       		onSearch={handleEnter}
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
		 </Collapse>}
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

export {TAG_MODAL, TAG_MODAL_MULTI}