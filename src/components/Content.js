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


export const CONTENT = ({tagData, updTagDataQuery, choose, multi, getUserByID}) => {
	const [visible, setVisible] = useState(false)
	const [tagRecord, setTagRecord] = useState({})//muti pic's tag change 存成{ADD:[...],DEL:[...]}
	const [choosePic, setChoosePic] = useState([])//Chosen pic list

	const taglist = (choose === 'All') ? null : [choose]
	const {loading, error, data: imgData, updateQuery} = useQuery(IMAGE_QUERY, { variables: {tags: taglist}, fetchPolicy: 'cache-and-network' })
	const [delImage] = useMutation(IMAGE_DELETE)

	useEffect(() => {
		setChoosePic([])
	},[multi])

	const updQueryOnDelete = (imgID) => {
		// console.log(`delete pic ${image._id}`)
		updateQuery(prev => {
			const newImgs = prev.images.filter((img)=> img._id !== imgID)
			if(newImgs.length === 0){
				updTagDataQuery(prev => ({
					tags: prev.tags.filter((tag) => tag !== choose)
				}))
			}
			return {images: newImgs}
		})
	}

	const deletePics = () => {
		// delete pictures (multiple)
		// console.log(choosePic)
		setChoosePic([])
		updateQuery((prev) => {
			const newImgs = prev.images.filter((img) => !choosePic.map(pic => pic._id).includes(img._id))
			if(newImgs.length === 0){
				updTagDataQuery(prev => ({
					tags: prev.tags.filter((tag) => tag !== choose)
				}))
			}
			return {images: newImgs}
		})
		choosePic.map(async image => {
			await delImage({ variables: {id: image._id} })
		})
	}

	const onChangeTag = (imgID, delArr) => {
		if(delArr.includes(choose)){
			updQueryOnDelete(imgID)
		}
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
					return (<SINGLE_PIC tagData={tagData} updTagDataQuery={updTagDataQuery}
									img={img} key={index} multi={multi} onDelete={updQueryOnDelete} 
									choosePic={choosePic} setChoosePic={setChoosePic} onChangeTag={onChangeTag}
									getUserByID={getUserByID}/>)
				})
			)}

			<Modal
				bodyStyle={(choose === "All") ?{height: "50vh", display: "flex", flexDirection: "row"}:{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
				visible={visible}
				onCancel={() => {setVisible(false)}}
				width={(choose === "All")? "30vw":"40vw"}
      		>
      			<TAG_MODAL_MULTI tagData={tagData} album={choose} setTagRecord={setTagRecord}/>
			</Modal>
		</>
	)
}