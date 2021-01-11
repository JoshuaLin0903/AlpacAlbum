import React, {useState, useEffect} from 'react'
import '../style.css'
import {Breadcrumb, Divider, Button} from 'antd';
import {PictureTwoTone, RollbackOutlined} from '@ant-design/icons';
import {PREVIEW, CONTENT} from './Album'

export const ALL = ({tagsData}) =>{
	const [state, setState] = useState('preview')
	const [choose, setChoose] = useState('')

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
					(tagsData.map((td) => {
						return (<PREVIEW onChoose={() => {setState('content');setChoose(td.name)}} data={td}/>)})
					):
					<CONTENT tagsData={tagsData} choose={choose}/>
				}
			</div>			
		</>
	)
}