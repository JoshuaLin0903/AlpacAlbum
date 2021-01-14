import React, {useEffect, useState} from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import {Modal, Avatar} from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_QUERY,
	ALBUM_COUNT
} from '../graphql/images'

const Single_pic = ({url}) => {
	const [visible, setVisible] = useState(false)

	const len = url.length
	const new_u = url.substr(0,len-4)+'b.jpg'
	return(
		<>
			<img className="img-show" onClick={() => setVisible(true)} src={new_u}/>
			<Modal
				bodyStyle={{height: "80vh", display: "flex", flexDirection: "row"}}
				centered
				visible={visible}
				onCancel={() => setVisible(false)}
				width={"80vw"}
      		>
      		<div className="img_big_box">
      			<img className="img_big" src={url}/>
      		</div>
      		<div className="social">
      			<div>
      				<Avatar icon={<UserOutlined/>}/>
      				下面的cancel OK不要理他
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
		<div>
			{loading ? (
				<p></p>
			) : error ? (
				<p>error</p>
			) : (
				imgData.images.map((img, index) => {
					return (<Single_pic url={img.url} key={index}/>)
				})
			)}
		</div>
	)
}