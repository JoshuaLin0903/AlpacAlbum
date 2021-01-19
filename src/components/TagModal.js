import React, {useState, useEffect} from 'react'
import {Button, Divider, Collapse, Tag, Input, message} from 'antd'
import {
  TagsOutlined
} from '@ant-design/icons';

import '../style.css'
  
const {Panel} = Collapse

const TAG_MODAL = ({tagData, updTagDataQuery, img, setTagRecord}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])

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
		if (!tagData.includes(newTag)) {
			setNewTagList([...newTagList, newTag])
		}
	}

	const handleEnter = () =>{
		if(newTag === ''){
			return
		}
		else if(newTag === 'All'){
			message.info(`Can't use tag #All.`)
		}
		else if (!img.tags.includes(newTag) && !add.includes(newTag)){
			setAdd([...add, newTag])
			handleNewTagList(newTag)
		}
		else{
			message.info(`#${newTag} is already on this picture.`)
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
					))})}
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

const TAG_MODAL_MULTI = ({tagData, album, setTagRecord, rstTagRecord, setRstTagRecord}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])
	const [remove, setRemove] = useState(false)

	const leftTags = tagData.filter((t) => (t !== album))

	useEffect(()=>{
		if(rstTagRecord){
			setAdd([])
			setDelete([])
			setRstTagRecord(false)
		}
	}, [rstTagRecord])

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
		if (!tagData.includes(newTag)) {
			setNewTagList([...newTagList, newTag])
		}
		setNewTag('')
	}

	const handleEnter = () =>{
		if(newTag === ''){
			return
		}
		else if(newTag === 'All'){
			message.info(`Can't use tag #All.`)
		}
		else if (newTag !== album && !add.includes(newTag)){
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
		 				return ` #${tag}`
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 		{add.length?
		 			<Tag color="blue" style={{marginLeft: 5}}>
		 		 	Add
		 			{add.map((tag) => {
		 				return ` #${tag}`
		 			})}
		 			</Tag>
		 		:<></>
		 		}
		 </div>
		</div>
	)
}

export {TAG_MODAL, TAG_MODAL_MULTI}