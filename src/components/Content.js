import React, {useEffect, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Avatar, Button, Popconfirm, Affix, Divider, Collapse, Tag, Input} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined,
  EyeOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone,
  TagsOutlined
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_QUERY,
	IMAGE_DELETE
} from '../graphql/images'
import {
	TAG_ALL
  } from '../graphql/tags'

const {Panel} = Collapse

const Single_pic = ({img, multi, delPic}) => {
	const [visible, setVisible] = useState(false)
	const [delImage] = useMutation(IMAGE_DELETE)
	const [choose, setChoose] = useState(false)
	const [state, setState] = useState('none')

	const newURL = img.url.slice(0, -4)+'b.jpg'

	useEffect(() =>{
		setChoose(false)
	},[multi])

	const deletePic = async()=>{
		//delete the picture
		console.log(img)
		await delImage({ variables: {id: img._id} })
		await delPic(img)
	}

	const changeTag = () =>{
		//changeTag, addTag
	}

	return(
		<>	
			<div className="img-show-div">
				{(multi)?
					<>
					{choose? <img className="img-show-blur"  src={newURL}/>:<img className="img-show"  src={newURL}/>}
					<div className="img-show-choose" onClick={() => {setChoose(!choose);}}>
						{choose?
							<CheckCircleTwoTone twoToneColor="#32CD32" style={{fontSize: 30}}/>:<></>
						}
					</div>
					</>
					:
					<>
					<img className="img-show"  src={newURL}/>
					<div className="img-show-button">
						<Button icon={<EyeOutlined />} type="text" onClick={() => {setVisible(true);setState('view')}}/>
						<Popconfirm placement="bottom" onConfirm={deletePic} 
							title="Are you sure you want to delete this picture?" 
							okText="Yes" cancelText="No" 
						>
							<Button icon={<DeleteOutlined />} type="text"/>
						</Popconfirm>
						<Button icon={<FolderAddOutlined />} type="text" onClick={() => {setVisible(true);setState('tag')}}/>
					</div>
					</>}
			</div>
			<Modal
				bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
				visible={visible}
				onCancel={() => {setVisible(false);setState('none');}}
				width={(state==="view")? "80vw" : "30vw"}
      >
      	{(state==="view")? <VIEW_MODAL img={img}/>: <TAG_MODAL img={img} visible={visible}/>}
			</Modal>
		</>
	)
}

const TAG_MODAL = ({img}) => {
	const [del, setDelete] = useState([])
	const [add, setAdd] = useState([])
	const [newTag, setNewTag] = useState('')
	const [newTagList, setNewTagList] = useState([])
	const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	console.log(add)
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
		 			{tagData.tags.map((tag) =>{
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
       		onSearch={() => {setAdd([...add, newTag]);setNewTagList([...newTagList, newTag]);}}
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
		 	<div> Result: </div>
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

export const CONTENT = ({choose, multi, updPics, setUpdPics, delPics, setDelPics}) => {

	const taglist = (choose === 'All') ? null : [choose]
	const {loading, error, data: imgData, updateQuery} = useQuery(IMAGE_QUERY, { variables: {tags: taglist} })

	useEffect(()=>{
		if(updPics[choose]){
			if(updPics[choose].length > 0){
				// console.log(`update Upload : ${updPics[choose].map(pic => pic._id)}`)
				updateQuery(prev => ({
					images: prev ? updPics[choose].concat(prev.images) : updPics[choose]
				}))
				const newUpdPics = updPics
				newUpdPics[choose] = []
				setUpdPics(newUpdPics)
			}
		}
		if(delPics[choose]){
			if(delPics[choose].length > 0){
				// console.log(`update Delete : ${delPics[choose]}`)
				updateQuery(prev => ({
					images: prev ? prev.images.filter((img) => !(delPics[choose].includes(img._id))) : []
				}))
				const newDelPics = delPics
				newDelPics[choose] = []
				setDelPics(newDelPics)
			}
		}
	}, [updPics, delPics, choose])

	const deletePic = async(image) => {
		// delete picture (single, call by <Single_pic>)
		console.log(`delete pic ${image._id}`)
		updateQuery(prev => ({
			images: prev.images.filter((img)=> img._id !== image._id)
		}))
		// START: update DelPics object
		const newDelPics = delPics
		image.tags.map((tag)=>{
			if(tag !== choose){
				if(!newDelPics[tag]){
					newDelPics[tag] = []
				}
				newDelPics[tag].push(image._id)
			}
		})
		if(choose !== "All"){
			if(!newDelPics["All"]){
				newDelPics["All"] = []
			}
			newDelPics["All"].push(image._id)
		}
		// console.log(newDelPics)
		setDelPics(newDelPics)
		// END: update DelPics object
	}

	const deletePics = () => {
		//delete pictures (multiple)
	}

	return(
		<>
			{multi?
				<Affix offsetTop={10} 
					style={{position: "absolute", left: "50%", top: "11%"}}>
					<Popconfirm placement="bottom" onConfirm={deletePics}
						title="Are you sure you want to delete these pictures?" 
						okText="Yes" cancelText="No" 
					>
						<Button icon={<DeleteOutlined />} size="large" type="primary" danger/>
					</Popconfirm>
					<Button icon={<FolderAddOutlined />} size="large" type="primary"/>
				</Affix>
				:<></>
			}
			{loading ? (
				<p></p>
			) : error ? (
				<p>error</p>
			) : (
				imgData.images.map((img, index) => {
					return (<Single_pic img={img} key={index} multi={multi} delPic={deletePic}/>)
				})
			)}
		</>
	)
}