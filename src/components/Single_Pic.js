import React, {useEffect, useState} from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Modal, Button, Popconfirm, message } from 'antd'
import { TAG_MODAL } from './TagModal'
import { VIEW_MODAL } from './ViewModal'
import {
  EyeOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';
import {
	IMAGE_DELETE
} from '../graphql/images'
import { TAG_SET } from '../graphql/tags'

export const SINGLE_PIC = ({user, tagData, updTagDataQuery, img, multi, onDelete, choosePic, setChoosePic, onChangeTag, getUserByID}) => {
	const [visible, setVisible] = useState(false)
	const [delImage] = useMutation(IMAGE_DELETE)
	const [choose, setChoose] = useState(false)
	const [state, setState] = useState('none')
	const [tagRecord, setTagRecord] = useState({}) //pic's tag change 存成{ADD:[...],DEL:[...]}

	const [setImgTags] = useMutation(TAG_SET)

	const newURL = img.url.slice(0, -4)+'b.jpg'

	useEffect(() =>{
		setChoose(false)
	},[multi])

	useEffect(()=>{
		if(choosePic.length === 0){
			setChoose(false)
		}
	},[choosePic])

	const onMultiChoose = () => {
		setChoose(!choose);
		if(!choose){
			setChoosePic([...choosePic, img])
		}
		else{
			const newPic = choosePic.filter((p) => (p !== img))
			setChoosePic(newPic)
		}
	}

	const deletePic = async()=>{
		//delete the picture
		console.log(img)
		await delImage({ variables: {id: img._id} })
		onDelete(img._id)
	}

	const changeTag = async() =>{
		//changeTag, addTag
		//tagRecord有存tag的變化
		// console.log(tagRecord)
		onChangeTag(img._id, tagRecord.DEL)
		const newTags = (img.tags).filter(tag => !tagRecord.DEL.includes(tag)).concat(tagRecord.ADD)
		await setImgTags({ variables: {id: img._id, tags: newTags}})
		img.tags = newTags
		var str = "Add"
		newTags.map((t) => {
			str = str + " #"+t
		})
		message.info(str)
	}

	return(
		<>	
			<div className="img-show-div">
				{(multi)?
					<>
					{(choose) ? <img className="img-show-blur"  src={newURL}/>:<img className="img-show"  src={newURL}/>}
					<div className="img-show-choose" onClick={onMultiChoose}>
						{(choose) ?
							<CheckCircleTwoTone twoToneColor="#32CD32" style={{fontSize: 30}}/>:<></>
						}
					</div>
					</>
					:
					<>
					<img className="img-show"  src={newURL}/>
					<div className="img-show-hover">
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
						<div className="img-show-tag">
							{img.tags.map((t) => {
								return(
									` #${t} `
								)
							})}
						</div>
					</div>
					</>}
			</div>
			{(state === "tag")?
				<Modal
					bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
					centered
					visible={visible}
					onCancel={() => {setVisible(false);setState('none');}}
					onOk={() => {changeTag(); setVisible(false); setState('none');}}
					width={"40vw"}
      			>
      				<TAG_MODAL updTagDataQuery={updTagDataQuery} tagData={tagData} img={img} setTagRecord={setTagRecord}/>
				</Modal>
				:
				((state === "view")?
				<Modal
					bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
					centered
					visible={visible}
					onCancel={() => {setVisible(false);setState('none');}}
					footer={null}
					width={"80vw"}
				>
					<VIEW_MODAL img={img} getUserByID={getUserByID}/>
				</Modal>
				:<></>
      )}
		</>
	)
}