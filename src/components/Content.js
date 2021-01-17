import React, {useEffect, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Button, Popconfirm, Affix} from 'antd'
import {
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';

import '../style.css'
import { SINGLE_PIC } from './Single_Pic'
import {
	IMAGE_QUERY,
	IMAGE_DELETE
} from '../graphql/images'
import { TAG_MODAL_MULTI } from './Modal'


export const CONTENT = ({choose, multi, updPics, setUpdPics, delPics, setDelPics, getUserByID}) => {
	const [visible, setVisible] = useState(false)
	const [tagRecord, setTagRecord] = useState({})//muti pic's tag change 存成{ADD:[...],DEL:[...]}
	const [choosePic, setChoosePic] = useState([])//Chosen pic list

	const taglist = (choose === 'All') ? null : [choose]
	const {loading, error, data: imgData, updateQuery} = useQuery(IMAGE_QUERY, { variables: {tags: taglist} })

	useEffect(() => {
		setChoosePic([])
	},[multi])

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
		// delete picture (single, call by <SINGLE_PIC>)
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
					style={{position: "absolute", left: "50%", top: 79}}>
					<Popconfirm placement="bottom" onConfirm={deletePics}
						title="Are you sure you want to delete these pictures?" 
						okText="Yes" cancelText="No" 
					>
						<Button icon={<DeleteOutlined />} size="large" type="primary" danger/>
					</Popconfirm>
					<Button icon={<FolderAddOutlined />} size="large" type="primary" onClick={() => setVisible(true)}/>
				</Affix>
				:<></>
			}

			{loading ? (
				<p></p>
			) : error ? (
				<p>error</p>
			) : (
				imgData.images.map((img, index) => {
					return (<SINGLE_PIC img={img} key={index} multi={multi} delPic={deletePic} 
									choosePic={choosePic} setChoosePic={setChoosePic} getUserByID={getUserByID}/>)
				})
			)}

			<Modal
				bodyStyle={(choose === "All") ?{height: "50vh", display: "flex", flexDirection: "row"}:{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
				visible={visible}
				onCancel={() => {setVisible(false)}}
				width={(choose === "All")? "30vw":"40vw"}
      		>
      			<TAG_MODAL_MULTI album={choose} setTagRecord={setTagRecord}/>
			</Modal>
		</>
	)
}