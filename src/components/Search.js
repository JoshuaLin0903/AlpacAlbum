import React, {useState, useEffect} from 'react'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import {Spin, Breadcrumb} from 'antd'
import {SmileTwoTone } from '@ant-design/icons'

import '../style.css'
import { SINGLE_PIC } from './Single_Pic'
import { IMAGE_QUERY } from '../graphql/images'
import {
	TAG_ALL
} from '../graphql/tags'

import searching from '../images/searching.gif';

export const SEARCH= ({user, selectTags, getUserByID}) =>{
	const [showTags,setShowTags] = useState([])
	const {loading: tagLoading, data: tagData, updateQuery: updTagDataQuery} = useQuery(TAG_ALL, {fetchPolicy: 'cache-and-network'})

	const [getSearchImages, {loading, data, updateQuery}] = useLazyQuery(IMAGE_QUERY, {
		fetchPolicy: 'cache-and-network'
	})

	const updQueryOnDelete = (imgID) => {
		updateQuery(prev => ({
			images: prev.images.filter((img)=> img._id !== imgID)
		}))
	}

	const onChangeTag = (imgID, delArr) => {
		if(delArr.some(tag => selectTags.includes(tag))){
			updQueryOnDelete(imgID)
		}
	}

	useEffect(() => {
		setShowTags(selectTags)
		if(selectTags.length > 0){
			getSearchImages({variables: {tags: selectTags}})
		}
	}
	,[selectTags, getSearchImages])


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
						{(loading || tagLoading || !data) ? (
							<div className="main-display-cen">
								<Spin tip="Searching" size="large"/>
							</div>
						) : (
							<div className="main-display-left">
								{data.images.length > 0 ? (
									data.images.map((img, index)=>{
										img.next = index >= data.images.length-1 ? null : data.images[index+1]
										img.prev = index <= 0 ? null : data.images[index-1]
										return (<SINGLE_PIC user={user} tagData={tagData.tags} updTagDataQuery={updTagDataQuery}
											img={img} key={index} onDelete={updQueryOnDelete}
											onChangeTag={onChangeTag}
											getUserByID={getUserByID}
											multi={false} choosePic={[]} setChoosePic={()=>{return true}}	// unused
										/>)
									})
								):(
									<p>No results!</p>
								)}
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
						<img src={searching} alt=""/>
					</div>
				</>
			}
		</>
	)
}