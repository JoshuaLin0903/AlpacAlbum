import React, {useState} from 'react'
import '../style.css'
import {Modal, Avatar} from 'antd'
import {
  UserOutlined,
} from '@ant-design/icons';

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

export const CONTENT = ({imgData, choose}) => {
	//album content
	const cor_img = imgData.filter((im) => (im.tags.indexOf(choose) !== -1))
	const URL = cor_img.map((im) => {return(im.url)})

	return(
		<div>
			{
				URL.map((u) => {
					const len = u.length
					const new_u = u.substr(0,len-4)+'b.jpg'
					return (<Single_pic url={u}/>)})
			}
		</div>
	)
}