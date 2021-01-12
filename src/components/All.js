import React, {useState, useEffect} from 'react'
import '../style.css'
import {Breadcrumb, Divider, Button} from 'antd';
import {PictureTwoTone, RollbackOutlined} from '@ant-design/icons';
import {PREVIEW, CONTENT} from './Album'

export const ALL = ({imgData, taglist}) =>{
	const [state, setState] = useState('preview')
	const [choose, setChoose] = useState('')

	var taglist_ad = ['All']
	taglist_ad = taglist_ad.concat(taglist)

	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<PictureTwoTone twoToneColor="#9932CC"/>
					{(state === 'preview')?
						<> Choose an album to view!</>
						:
						<> Current Album : {choose} <Button icon={<RollbackOutlined />} size="small" onClick={()=>{setState('preview')}}/> </>
					}
				</Breadcrumb.Item>
			</Breadcrumb>

			<div className="main-display-left">
				{(state === 'preview') ? 
					(taglist_ad.map((td) => {
						const cor_img = imgData.filter((im) => (im.tags.indexOf(td) !== -1))
						const cor_data = cor_img.map((im) => {return(im.url)})
						return (<PREVIEW onChoose={() => {setState('content');setChoose(td)}} data={cor_data} tag={td}/>)})
					):
					<CONTENT imgData={imgData} choose={choose}/>
				}
			</div>			
		</>
	)
}