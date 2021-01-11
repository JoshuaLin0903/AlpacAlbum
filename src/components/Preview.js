import React, {useState} from 'react'
import '../style.css'
import {Divider, Image} from 'antd';

export const PREVIEW = ({onChoose,data}) => {
	const l = data.url.length
	const show = []
	data.url.map((u,i) => {
		if (i >= l-4){
			const len = u.length
			const new_u = u.substr(0,len-4)+'s.jpg'
			show.push(<img className="img-preview" src={new_u}/>)
		}
	})

	for (let i = 0; i < 4-l; i++){
		show.push(<Image className="img-preview" width={90} height={90} placeholder={true}/>)
	}

	return(
		<div className="album" onClick={onChoose}>
			<div className="four-img">
				<div className="preview-row">
					{show[0]}
					{show[1]}
				</div>
				<div className="preview-row">
					{show[2]}
					{show[3]}
				</div>
			</div>
			<Divider style={{margin: 5}}/>
			<h1 style={{marginLeft: 5, marginBottom: 0}}> {data.name} </h1>
			<div style={{marginLeft: 5}}>{l} photos</div>
		</div>
	)
}