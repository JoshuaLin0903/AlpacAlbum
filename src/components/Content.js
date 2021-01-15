import React, {useEffect, useState} from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import {Modal, Avatar, Button, Popconfirm} from 'antd'
import {
  UserOutlined,
  HeartOutlined,
  CommentOutlined,
  EyeOutlined,
  DeleteOutlined,
  FolderAddOutlined
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_QUERY,
	IMAGE_DELETE,
	ALBUM_COUNT
} from '../graphql/images'

const Single_pic = ({img}) => {
	const [visible, setVisible] = useState(false)
	const [delImage] = useMutation(IMAGE_DELETE)

	const Today = new Date()
	const today = { year: Today.getFullYear().toString(), month : (Today.getMonth()+1).toString(), date : Today.getDate().toString()}

	const newURL = img.url.slice(0, -4)+'b.jpg'

	const determinState = (date) => {
		if(!date){
			date = "yyyy/mm/dd"
		}
		const d_sep = date.split('/')
		if(d_sep[0] === today.year && d_sep[1] === today.month && d_sep[2] === today.date)
		{
			return ('today')
		}
		return(date)
	}

	const deletePic = ()=>{
		//delete the picture
		console.log(img)
		delImage({ variables: {id: img._id} }).then((res)=>{
			console.log(res)
		}).catch((err)=>{
			console.log(err)
		})
	}

	const changeTag = () =>{
		//changeTag, addTag
	}

	return(
		<>	
			<div className="img-show-div">
				<img className="img-show"  src={newURL}/>
				<div className="img-show-button">
					<Button icon={<EyeOutlined />} type="text" onClick={() => setVisible(true)}/>
					<Popconfirm placement="bottom" onConfirm={deletePic} 
						title="Are you sure you want to delete this picture?" 
						okText="Yes" cancelText="No" 
					>
						<Button icon={<DeleteOutlined />} type="text"/>
					</Popconfirm>
					<Button icon={<FolderAddOutlined />} type="text" onClick={changeTag}/>
				</div>
			</div>
			<Modal
				bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
				visible={visible}
				onCancel={() => setVisible(false)}
				width={"80vw"}
      		>
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
			</Modal>
		</>
	)
}

export const CONTENT = ({choose}) => {
	const taglist = (choose === 'All') ? null : [choose]
	const {loading, error, data: imgData, updateQuery} = useQuery(IMAGE_QUERY, { variables: {tags: taglist} })
	const {loading: countLoading, data: countData, refetch: countRefetch} = useQuery(ALBUM_COUNT, { variables: {tag: (choose === 'All') ? null : choose}})
	const [fetchImg, {loading: fetchLoading, data: fetchImgData}] = useLazyQuery(IMAGE_QUERY)

	useEffect(()=>{
		countRefetch()
	}, [])

	useEffect(()=>{
		if(imgData && countData && !loading && !countLoading){
			if(imgData.images && countData.albumCount){
				if(imgData.images.length < countData.albumCount){
					console.log(`need update: local(${imgData.images.length}), server(${countData.albumCount})`)
					const fetchNum = countData.albumCount - imgData.images.length
					fetchImg({variables: {tags: taglist, num: fetchNum}})
				}
			}
		}
	}, [imgData, countData])

	useEffect(() => {
		if(fetchImgData && !fetchLoading){
			if(fetchImgData.images){
				updateQuery(prev => ({
					images: [...fetchImgData.images, ...prev.images]
				}))
			}
		}
	}, [fetchImgData])

	return(
		<>
			{loading ? (
				<p></p>
			) : error ? (
				<p>error</p>
			) : (
				imgData.images.map((img, index) => {
					return (<Single_pic img={img} key={index}/>)
				})
			)}
		</>
	)
}