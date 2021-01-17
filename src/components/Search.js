import React, {useState, useEffect} from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import {Spin, Breadcrumb} from 'antd'
import {SmileTwoTone } from '@ant-design/icons'

import '../style.css'
import { SINGLE_PIC } from './Single_Pic'
import { IMAGE_QUERY } from '../graphql/images'

export const SEARCH= ({selectTags}) =>{
	const [showTags,setShowTags] = useState([])

	const [getSearchImages, {loading, data}] = useLazyQuery(IMAGE_QUERY, {
		fetchPolicy: 'cache-and-network'
	})

	useEffect(() => {
		setShowTags(selectTags)
		if(selectTags.length > 0){
			getSearchImages({variables: {tags: selectTags}})
		}
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
										` #${t} `
									)
								})
							}
						</Breadcrumb.Item>
					</Breadcrumb>
					<>
						{(loading || !data) ? (
							<div className="main-display-cen">
								<Spin tip="Searching" size="large"/>
							</div>
						) : (
							<div className="main-display-left">
								{data.images.map((img, index)=>{
									return (<SINGLE_PIC img={img} key={index} multi={false} delPic={()=>{return true}}/>)
								})}
							</div>
						)}
					</>
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