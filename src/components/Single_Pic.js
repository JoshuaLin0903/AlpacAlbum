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

	const id = (typeof img.author === 'string')? img.author:img.author._id

	return(
		<>	
			<div className="img-show-div">
				{(multi)?
					<>
					{(id !== user._id)? <img className="img-show-disable"  src={newURL}/>
						:((choose) ? <img className="img-show-blur"  src={newURL}/>:<img className="img-show"  src={newURL}/>)
					}

					{(id !== user._id)?<></>:
						<div className="img-show-choose" onClick={onMultiChoose}>
						{(choose) ?
							<CheckCircleTwoTone twoToneColor="#32CD32" style={{fontSize: 30}}/>:<></>
						}
						</div>}
					</>
					:
					<>
					<img className="img-show"  src={newURL}/>
					<div className="img-show-hover">
						{(id === user._id)?
							<div className="img-show-button">
								<Popconfirm placement="bottom" onConfirm={deletePic} 
								  title="Are you sure you want to delete this picture?" 
								  okText="Yes" cancelText="No" >
									<Button icon={<DeleteOutlined />} type="text"/>
								</Popconfirm>
								<Button icon={<EyeOutlined />} type="text" onClick={() => {setVisible(true);setState('view')}}/>
								<Button icon={<FolderAddOutlined />} type="text" onClick={() => {setVisible(true);setState('tag')}}/>
							</div>:
							<div className="img-show-notUser" onClick={() => {setVisible(true);setState('view')}}/>
						}
						<div className="img-show-tag">
							{img.tags.map((t) => {return(` #${t} `)})}
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
					width={"85vw"}
				>
					<VIEW_MODAL user={user} img={img} getUserByID={getUserByID}/>
				</Modal>
				:<></>
      )}
		</>
	)
}