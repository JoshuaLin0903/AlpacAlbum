import React from 'react';
import '../style.css';
import {Spin, Breadcrumb} from 'antd';
import {SmileTwoTone } from '@ant-design/icons'

export const SEARCH= () =>{
	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<SmileTwoTone twoToneColor="coral" /> Your results will be showing here!
				</Breadcrumb.Item>
			</Breadcrumb>
			<div className="main-display-cen">
				<Spin tip="Searching" size="large"/>
			</div>
		</>
	)
}