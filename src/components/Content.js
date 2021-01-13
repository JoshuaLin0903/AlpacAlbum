import React, {useState} from 'react'
import { useQuery } from '@apollo/react-hooks'
import {Modal, Avatar} from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons';

import '../style.css'
import {
	IMAGE_QUERY
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
	const {loading, error, data: imgData} = useQuery(IMAGE_QUERY, { variables: {tags: taglist}})

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