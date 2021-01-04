import React from 'react'
import '../style.css'
import {LoadingOutlined} from '@ant-design/icons';

export const SEARCH= () =>{
	return(
		<div className="main-display">
			<LoadingOutlined style={{fontSize: "300%", color: "blue"}}/>
		</div>
	)
}