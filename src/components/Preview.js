import React, {useState} from 'react'
import '../style.css'
import {Divider} from 'antd';

export const PREVIEW = ({onChoose, data, tag}) => {
	const l = data.length
	const show = []
	data.map((u,i) => {
		if (i >= l-4){
			const len = u.length
			const new_u = u.substr(0,len-4)+'s.jpg'
			show.push(<img className="img-preview" src={new_u}/>)
		}
	})

	for (let i = 0; i < 4-l; i++){
		show.push(<img className="img-empty" src={"https://imgur.com/OKg01CIs.png"}/>)
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
			<h1 style={{marginLeft: 5, marginBottom: 0}}> {tag} </h1>
			<div style={{marginLeft: 5}}>{l} photos</div>
		</div>
	)
}