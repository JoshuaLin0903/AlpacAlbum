import React, {useState} from 'react'
import '../style.css'
import {Breadcrumb} from 'antd';
import {PictureTwoTone} from '@ant-design/icons';
import {URLLIST} from './Upload.js'


export const ALL = () =>{

	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<PictureTwoTone twoToneColor="#9932CC"/> Choose an album to view!
				</Breadcrumb.Item>
			</Breadcrumb>

			<div className="main-display-all">
				{URLLIST.length === 0 ? (
					<p>No photos ...</p>
				):(
					URLLIST.map((url, i) => {
						return (<p key={i}><a target="_blank" rel="noopener noreferrer" href={url}>image {i}</a></p>)
					})
				)}
			</div>
		</>
	)
}