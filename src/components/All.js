import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react'
import { useQuery } from '@apollo/react-hooks'
import {Breadcrumb, Button, Tooltip} from 'antd';
import {PictureTwoTone, RollbackOutlined, CloseOutlined, CheckOutlined} from '@ant-design/icons';

import '../style.css'
import {PREVIEW, CONTENT} from './Album'
import {
	ALBUM_COUNT
} from '../graphql/images'
import {
	TAG_ALL
} from '../graphql/tags'

export const ALL = forwardRef(({updPreview}, ref) => {
	const [state, setState] = useState('preview')
	const [choose, setChoose] = useState('')
	const [upd, setUpd] = useState(false)
	const [multi, setMulti] = useState(false)
	
	const {loading:countLoading, data: countData, refetch: countRefetch} = useQuery(ALBUM_COUNT)
	const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	useImperativeHandle(ref, () => ({
		uploadUpdate(){
		  console.log("uploadUpdate from All");
		  countRefetch();
		  tagRefetch();
		}
	}))

	useEffect(()=>{
		countRefetch()
		if(updPreview){
			setUpd(true)
		}
	}, [])

	useEffect(() => {
		console.log(`updPreview = ${updPreview}`)
	}, [updPreview])
	
	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<PictureTwoTone twoToneColor="#9932CC"/>
					{(state === 'preview')?
						<> Choose an album to view!</>
						:
						<> 
							Current Album : {choose}
							<Tooltip title="Go Back" type="bottom">
								<Button style={{marginLeft: 5}} icon={<RollbackOutlined />} size="small" onClick={()=>{setState('preview');setMulti(false);}}/>
							</Tooltip> 
							<Tooltip title="Choose mutiple pictures" type="bottom">
								<Button icon={<CheckOutlined />} size="small" onClick={()=>{setMulti(true);}}/>
							</Tooltip>
							{multi?
								<Tooltip title="Choose mutiple pictures" type="bottom">
									<Button icon={<CloseOutlined />} size="small" onClick={()=>{setMulti(false);}}/>
								</Tooltip>:
								<></>
							}
						</>
					}
				</Breadcrumb.Item>
			</Breadcrumb>

			<div className="main-display-left">
				{(state === 'preview') ? (
					(!tagLoading && !countLoading && countData.albumCount > 0) ? (
						<>
						<PREVIEW 
							onChoose={() => {setState('content'); setChoose('All'); setUpd(false)}}
							tag={'All'} key={0} upd={updPreview && upd}
						/>
						{tagData.tags.map((td, index) => {
							return (<PREVIEW 
							onChoose={() => {setState('content'); setChoose(td); setUpd(false)}} 
							tag={td} key={index+1} upd={updPreview && upd}
							/>)
						})}
						</>
					):(
						<p>no photos</p>
					)
				): <CONTENT choose={choose} multi={multi}/>
					
				}
			</div>			
		</>
	)
})