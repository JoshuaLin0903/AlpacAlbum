import React, {useEffect, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Button, Popconfirm, message, Affix} from 'antd'
import {
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';

import '../style.css'
import { SINGLE_PIC } from './Single_Pic'
import { TAG_MODAL_MULTI } from './TagModal'
import {
	IMAGE_QUERY,
	IMAGE_DELETE
} from '../graphql/images'
import { TAG_SET } from '../graphql/tags'

export const CONTENT = ({tagData, updTagDataQuery, choose, multi, getUserByID}) => {
	const [visible, setVisible] = useState(false)
	const [rstTagRecord, setRstTagRecord] = useState(false)
	const [tagRecord, setTagRecord] = useState({})//muti pic's tag change 存成{ADD:[...],DEL:[...]}
	const [choosePic, setChoosePic] = useState([])//Chosen pic list

	const taglist = (choose === 'All') ? null : [choose]
	const {loading, error, data: imgData, updateQuery} = useQuery(IMAGE_QUERY, { variables: {tags: taglist}, fetchPolicy: 'cache-and-network' })
	const [delImage] = useMutation(IMAGE_DELETE)
	const [setImgTags] = useMutation(TAG_SET)

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

	const changeTags = () => {
		console.log("change Tags")
		console.log(tagRecord)
		console.log(choosePic)
		if(tagRecord.DEL.length === 0 && tagRecord.ADD.length === 0){
			message.info({ content: 'Warning: no tag changes.'})
			return
		}
		setChoosePic([])
		if(tagRecord.DEL.includes(choose)){
			updateQuery((prev) => {
				const newImgs = prev.images.filter((img) => !choosePic.map(pic => pic._id).includes(img._id))
				if(newImgs.length === 0){
					updTagDataQuery(prev => ({
						tags: prev.tags.filter((tag) => tag !== choose)
					}))
				}
				return {images: newImgs}
			})
		}
		choosePic.map(async img => {
			let newTags = (img.tags).filter(tag => !tagRecord.DEL.includes(tag)).concat(tagRecord.ADD)
			newTags = [...new Set(newTags)]
			await setImgTags({ variables: {id: img._id, tags: newTags}})
			img.tags = newTags
		})
		setRstTagRecord(true);
		setVisible(false);
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
						<Button icon={<DeleteOutlined />} type="primary" size="large" disabled={choosePic.length === 0} danger/>
					</Popconfirm>
					<Button icon={<FolderAddOutlined />} type="primary" size="large" disabled={choosePic.length === 0} onClick={() => setVisible(true)}/>
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
				onOk={changeTags}
				width={(choose === "All")? "30vw":"40vw"}
      		>
      			<TAG_MODAL_MULTI tagData={tagData} album={choose} setTagRecord={setTagRecord} rstTagRecord={rstTagRecord} setRstTagRecord={setRstTagRecord} />
			</Modal>
		</>
	)
}