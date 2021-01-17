import React, {useEffect, useState} from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Button, Popconfirm} from 'antd'
import { TAG_MODAL, VIEW_MODAL } from './Modal'
import {
  EyeOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';
import {
	IMAGE_QUERY,
	IMAGE_DELETE
} from '../graphql/images'

export const SINGLE_PIC = ({img, multi, delPic, choosePic, setChoosePic}) => {
	const [visible, setVisible] = useState(false)
	const [delImage] = useMutation(IMAGE_DELETE)
	const [choose, setChoose] = useState(false)
	const [state, setState] = useState('none')
	const [tagRecord, setTagRecord] = useState({})//pic's tag change 存成{ADD:[...],DEL:[...]}

	const newURL = img.url.slice(0, -4)+'b.jpg'

	useEffect(() =>{
		setChoose(false)
	},[multi])

	useEffect(()=>{
		if(choose){
			setChoosePic([...choosePic, img])
		}
		else{
			const newPic = choosePic.filter((p) => (p !== img))
			setChoosePic(newPic)
		}

	},[choose])

	const deletePic = async()=>{
		//delete the picture
		console.log(img)
		await delImage({ variables: {id: img._id} })
		await delPic(img)
	}

	const changeTag = () =>{
		//changeTag, addTag
		//tagRecord有存tag的變化
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
			{(state === "tag")?
				<Modal
					bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
					centered
					visible={visible}
					onCancel={() => {setVisible(false);setState('none');}}
					onOk={changeTag}
					width={"40vw"}
      	>
      		<TAG_MODAL img={img} setTagRecord={setTagRecord}/>
				</Modal>
				:
				<></>
      }
		</>
	)
}