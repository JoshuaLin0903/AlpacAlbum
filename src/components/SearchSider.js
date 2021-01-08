import React, {useState} from 'react'
import { Collapse, Tag, Button, Input, Divider, Tooltip} from 'antd';
import { StarFilled, CheckCircleTwoTone, SearchOutlined, CloseCircleOutlined} from '@ant-design/icons';

const { Panel } = Collapse;
const { CheckableTag } = Tag;
const {Search} = Input;

var chosen = []

export const SEARCH_SIDER = ({taglist})=>{
	const [selectedTags, setSelectedTags] = useState(chosen);
  const [showingTags, setShowingTags] = useState(taglist)

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
      setShowingTags(taglist)
    }
    else{
      const _filter = taglist.filter((t) => 
        (t.toLowerCase().substr(0,l) === search.toLowerCase())
      )
      setShowingTags(_filter)
    }
    
  }

	return(
		<Collapse defaultActiveKey={['1']}>
      <Panel 
      	showArrow={false} 
      	header={<><SearchOutlined/> Search by Tags</>}
      	key="1">
      	<div style={{margin: '5px'}}>
	  			<Input
		 				allowClear 
            prefix={<SearchOutlined/>}
		 				style={{ width: 400, margin: '10px' }}
            onChange={(e) => {filterTags(e.target.value)}}/>
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
                  type="dashed"/>
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
    	  <div className="tags_group">
    	  	{(taglist.length === 0) ?
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
    	</Panel>
    </Collapse>
	)
}