import React from 'react';
import '../style.css';
import {Spin} from 'antd';

export const SEARCH= () =>{
	return(
		<div className="main-display">
			<Spin tip="Searching" size="large"/>
		</div>
	)
}