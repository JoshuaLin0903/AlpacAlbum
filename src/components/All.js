import React, {useState, useEffect} from 'react'
import {Breadcrumb, Divider, Button} from 'antd';
import {PictureTwoTone, RollbackOutlined} from '@ant-design/icons';

import '../style.css'
import {PREVIEW, CONTENT} from './Album'

export const ALL = ({taglist, updPreview}) =>{
	const [state, setState] = useState('preview')
	const [choose, setChoose] = useState('')
	const [upd, setUpd] = useState(false)

	useEffect(()=>{
		if(updPreview){
			setUpd(true)
		}
	}, [])
	
	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<PictureTwoTone twoToneColor="#9932CC"/>
					{(state === 'preview')?
						<> Choose an album to view!</>
						:
						<> Current Album : {choose} <Button icon={<RollbackOutlined />} size="small" onClick={()=>{setState('preview');}}/> </>
					}
				</Breadcrumb.Item>
			</Breadcrumb>

			<div className="main-display-left">
				{(state === 'preview') ?
					(
					<>
					<PREVIEW 
						onChoose={() => {setState('content'); setChoose('All'); setUpd(false)}}
						tag={'All'} key={0} upd={updPreview && upd}
					/>
					{taglist.map((td, index) => {
						return (<PREVIEW 
							onChoose={() => {setState('content'); setChoose(td); setUpd(false)}} 
							tag={td} key={index+1} upd={updPreview && upd}
						/>)
					})}
					</>
					)
					: <CONTENT choose={choose}/>
					
				}
			</div>			
		</>
	)
}