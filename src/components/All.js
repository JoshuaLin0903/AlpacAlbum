import React, {useState, useEffect, createRef, forwardRef, useImperativeHandle} from 'react'
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

export const ALL = forwardRef(({getUserByID}, ref) => {
	const [state, setState] = useState('preview')
	const [choose, setChoose] = useState('')
	const [multi, setMulti] = useState(false)
	const [pvRefs, setPvRefs] = useState([])
	
	const {loading: countLoading, data: countData, refetch: countRefetch} = useQuery(ALBUM_COUNT, {fetchPolicy: 'cache-and-network'})
	const {loading: tagLoading, data: tagData, refetch: tagRefetch, updateQuery: updTagDataQuery} = useQuery(TAG_ALL)

	useImperativeHandle(ref, () => ({
		uploadUpdate(){
			// console.log("uploadUpdate from All");
			countRefetch();
			tagRefetch();
			pvRefs.forEach(ref => {
				if(ref.current)
					ref.current.uploadUpdate()
			});
		}
	}))

	useEffect(() => {
		if(tagData){
			if(tagData.tags){
				// console.log("current tags:", tagData.tags)
				setPvRefs(refs => (
					Array(tagData.tags.length+1).fill().map((_, i) => refs[i] || createRef())
				))
			}
		}
	}, [tagData])

	const onClickGoBack = () => {
		setState('preview');
		setMulti(false);
	}
	
	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<PictureTwoTone twoToneColor="#9932CC"/>
					{(state === 'preview')?
						<> Choose an album to view!</>
						:
						<> 
							<> Current Album : {choose} </>
							<Tooltip title="Go Back" type="bottom">
								<Button style={{marginLeft: 5}} icon={<RollbackOutlined />} size="small" onClick={onClickGoBack}/>
							</Tooltip>
							{multi?
								<Tooltip title="Choose mutiple pictures" type="bottom">
									<Button icon={<CloseOutlined />} size="small" onClick={()=>{setMulti(false);}}/>
								</Tooltip>:
								<Tooltip title="Choose mutiple pictures" type="bottom">
									<Button icon={<CheckOutlined />} size="small" onClick={()=>{setMulti(true);}}/>
								</Tooltip>
							}
						</>
					}
				</Breadcrumb.Item>
			</Breadcrumb>

			<div className="main-display-left">
				{(state === 'preview') ? (
					(tagLoading || countLoading) ? (
						<p>loading</p>
					) : (
						(countData.albumCount > 0) ? (
							<>
							<PREVIEW 
								onChoose={() => {setState('content'); setChoose('All');}}
								tag={'All'} key={0} ref={pvRefs[0]}
							/>
							{tagData.tags.map((td, index) => {
								return (<PREVIEW updTagDataQuery={updTagDataQuery}
								onChoose={() => {setState('content'); setChoose(td);}} 
								tag={td} key={index+1} ref={pvRefs[index+1]}
								/>)
							})}
							</>
						):( <p>no photos</p> )
					)
				): <CONTENT tagData={tagData.tags} updTagDataQuery={updTagDataQuery}
					choose={choose} multi={multi}
					getUserByID={getUserByID}
				/>	
				}
			</div>			
		</>
	)
})