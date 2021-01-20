import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Collapse, Tag, Button, Input, Divider, Tooltip} from 'antd';
import { StarFilled, CheckCircleTwoTone, SearchOutlined, CloseCircleOutlined} from '@ant-design/icons';

import {
	TAG_ALL
} from '../graphql/tags'

const { Panel } = Collapse;
const { CheckableTag } = Tag;

var chosen = []

export const SEARCH_SIDER = ({onChange})=>{
	const [selectedTags, setSelectedTags] = useState(chosen);
  const [showingTags, setShowingTags] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	const chooseTags = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    chosen = nextSelectedTags
    setSelectedTags(nextSelectedTags);
  }

  const closeTags = (tag) => {
  	const updateSelectedTags = selectedTags.filter(t => t !== tag);
    chosen = updateSelectedTags
		setSelectedTags(updateSelectedTags)
  }

  const clearAll = () => {
    chosen = []
    setSelectedTags([])
  }

  const filterTags = (search) => {
    const l = search.length
    if(l === 0){
      setShowingTags(tagData.tags)
    }
    else{
      const _filter = tagData.tags.filter((t) => 
        (t.toLowerCase().substr(0,l) === search.toLowerCase())
      )
      setShowingTags(_filter)
    }
    
  }

  const handleConfirm = () => {
    onChange(selectedTags)
    setSelectedTags([])
    setShowingTags(tagData.tags)
    setSearchValue('')
  }

  useEffect(()=>{
    tagRefetch();
  },[tagRefetch])


  useEffect(()=> {
    if(tagData){
      if(tagData.tags){
        setShowingTags(tagData.tags)
      }
    }
  }, [tagData])

	return(
		<Collapse defaultActiveKey={['1']}>
      <Panel 
      	showArrow={false} 
      	header={<><SearchOutlined/> Search by Tags</>}
      	key="1">
      	<div style={{margin: '5px'}}>
	  			<Input
		 				allowClear 
            value={searchValue}
            prefix={<SearchOutlined/>}
		 				style={{ width: "88%", margin: '10px' }}
            onChange={(e) => {filterTags(e.target.value);setSearchValue(e.target.value);}}/>
				</div>
        <div className="chosen_tag_block">
        	<Tag icon={<StarFilled />} color="volcano" style={{marginTop: "5px"}}>
        		Selected
        	</Tag>
        	: 
          {selectedTags.map(tag => (
         		<Tag 
         			key={tag} 
         			closable={true} 
         			style={(selectedTags.indexOf(tag)===0)?{
             	marginLeft: "5px",marginTop: "5px"}:{marginLeft: "0px",marginTop: "5px"}} 
             	onClose={() => closeTags(tag)}>
             	{tag}
            </Tag>
          ))}
    	  </div>
        {selectedTags.length?
            <div style={{padding: 5}}>
              <Tooltip title="Confirm" placement="bottom">
                <Button size="small" 
                  style={{color:"#52c41a"}} 
                  icon={<CheckCircleTwoTone twoToneColor="#52c41a"/>}
                  shape="circle"
                  type="dashed"
                  onClick={handleConfirm}/>
              </Tooltip>
              <Tooltip title="Clear All" placement="bottom">
                <Button size="small" 
                  style={{color:"red"}} 
                  icon={<CloseCircleOutlined twoToneColor="red"/>}
                  onClick={clearAll}
                  shape="circle"
                  type="dashed"/>
              </Tooltip>
            </div>:<></>}
        <Divider style={{margin:1}}/>
        {tagLoading ? (
          <p>loading</p>
        ):(
          <div className="tags_group">
    	  	{(tagData.tags.length === 0) ?
          <p style={{color:"gray", textAlign: "center"}}> No tags ... </p> 
          :
          ((showingTags.length === 0)?
          <p style={{color:"gray", textAlign: "center"}}> No tags are found </p>
          :
          (showingTags.map(tag => (
  				<CheckableTag
   		   		key={tag}
    				checked={selectedTags.indexOf(tag) > -1}
   					onChange={checked => chooseTags(tag, checked)}>
   				 #{tag}
  				</CheckableTag>
 					))))}
        </div>
        )}
    	</Panel>
    </Collapse>
	)
}