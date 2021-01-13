import React, {useState, useEffect} from 'react'
import '../style.css'
import {Breadcrumb, Divider, Button} from 'antd';
import {PictureTwoTone, RollbackOutlined} from '@ant-design/icons';
import {PREVIEW, CONTENT} from './Album'

export const ALL = ({imgData, taglist}) =>{
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
					(
					<>
					<PREVIEW onChoose={() => {setState('content');setChoose('All')}} tag={'All'} key={0}/>
					{taglist.map((td, index) => {
						return (<PREVIEW onChoose={() => {setState('content');setChoose(td)}} tag={td} key={index+1}/>)
					})}
					</>
					)
					: <CONTENT imgData={imgData} choose={choose}/>
					
				}
			</div>			
		</>
	)
}