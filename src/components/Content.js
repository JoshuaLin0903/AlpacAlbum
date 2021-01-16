import React, {useEffect, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Button, Popconfirm, Affix} from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';

import '../style.css'
import { TAG_MODAL, VIEW_MODAL } from './Modal'
import {
	IMAGE_QUERY,
	IMAGE_DELETE
} from '../graphql/images'

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