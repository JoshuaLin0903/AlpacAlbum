import React, {useState, useEffect} from 'react';
import '../style.css';
import {Spin, Breadcrumb} from 'antd';
import {SmileTwoTone } from '@ant-design/icons'

export const SEARCH= ({selectTags}) =>{
	const [showTags,setShowTags] = useState([])

	useEffect(() => {
		setShowTags(selectTags)
	}
	,[selectTags])


	return(
		<>
			{showTags.length ?
				<>
					<Breadcrumb style={{margin: "21px 0"}}>
						<Breadcrumb.Item style={{color:"gray"}}>
							<SmileTwoTone twoToneColor="coral" /> Pictures with 
							{showTags.map((t) => {
									return(
										<> #{t} </>
									)
								})
							}
						</Breadcrumb.Item>
					</Breadcrumb>
					<div className="main-display-left">
						
					</div>
				</>
				:<>
					<Breadcrumb style={{margin: "21px 0"}}>
						<Breadcrumb.Item style={{color:"gray"}}>
							<SmileTwoTone twoToneColor="coral" /> Your results will be showing here!
						</Breadcrumb.Item>
					</Breadcrumb>
					<div className="main-display-cen">
						<Spin tip="Searching" size="large"/>
					</div>
				</>
			}
		</>
	)
}