import React, {useEffect, forwardRef, useImperativeHandle} from 'react'
import { useQuery } from '@apollo/react-hooks'
import '../style.css'
import {Divider} from 'antd';

import noPic from '../images/no_pic.png';

import {
	ALBUM_PREVIEW,
	ALBUM_COUNT
} from '../graphql/images'

export const PREVIEW = forwardRef(({updTagDataQuery, onChoose, tag}, ref) => {
	const {loading, error, data: imgData, refetch: previewRefetch} = useQuery(ALBUM_PREVIEW, { variables: {tag: (tag === 'All') ? null : tag}})
	const {loading:countLoading, data: countData, refetch: countRefetch} = useQuery(ALBUM_COUNT, { variables: {tag: (tag === 'All') ? null : tag}})

	useEffect(() => {
		previewRefetch()
		countRefetch()
	}, [])

	useImperativeHandle(ref, () => ({
		uploadUpdate(){
			// console.log(`uploadUpdate from Preview ${tag}`);
			previewRefetch()
			countRefetch()
		}
	}))

	const showImg = (idx) => {
		if(idx >= imgData.albumPreview.length){
			return <img className="img-empty" src={noPic} style={{width: 90, height: 90}}/>
		}
		const url = imgData.albumPreview[idx].url.slice(0, -4)+'s.jpg'
		return <img className="img-preview" src={url}/>
	}

	return(
		<div className="album" onClick={onChoose}>
			{loading ? (
				<p> loading </p>
			) : error ? (
				<p> error </p>
			) : 
				<>
				<div className="four-img">
					<div className="preview-row">
						{showImg(0)}
						{showImg(1)}
					</div>
					<div className="preview-row">
						{showImg(2)}
						{showImg(3)}
					</div>
				</div>
				<Divider style={{margin: 5}}/>
				<h1 style={{marginLeft: 5, marginBottom: 0}}> {tag} </h1>
				<div style={{marginLeft: 5}}>{countLoading ? '' :countData.albumCount} photos</div>
				</>
			}
		</div>
	)
})