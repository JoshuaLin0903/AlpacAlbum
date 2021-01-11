import React, {useState} from 'react'
import '../style.css'

export const CONTENT = ({tagsData, choose}) => {
	//album content
	const URL = tagsData.filter((t) => (t.name === choose))[0].url

	return(
		<div>
			{
				URL.map((u) => {
					const len = u.length
					const new_u = u.substr(0,len-4)+'b.jpg'
					return (<img className="img-preview" src={new_u}/>)})
			}
		</div>
	)
}