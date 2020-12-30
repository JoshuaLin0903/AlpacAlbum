import React, {useState} from 'react'
import { Collapse, Tag, Button, Input} from 'antd';
import { StarFilled, CheckCircleTwoTone, SearchOutlined} from '@ant-design/icons';

const { Panel } = Collapse;
const { CheckableTag } = Tag;
const {Search} = Input;

const tagsData = ['Favorite', 'Alpaca', 'Kpop', 'Daily', 'GreenIsland'];

export const SEARCH_SIDER = ()=>{
	const [selectedTags, setSelectedTags] = useState([]);

	const chooseTags = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log(nextSelectedTags)
    setSelectedTags(nextSelectedTags);
  }

  const closeTags = (tag) => {
  	const updateSelectedTags = selectedTags.filter(t => t !== tag);
		setSelectedTags(updateSelectedTags)
  }

	return(
		<Collapse defaultActiveKey={['1']}>
      <Panel 
      	showArrow={false} 
      	header={<><SearchOutlined/> Search by Tags</>}
      	key="1">
      	<div style={{margin: '5px'}}>
	  			<Search 
		 				allowClear 
		 				style={{ width: 400, margin: '10px' }}/>
				</div>
        <div className="chosen_tag_block">
        	<Tag icon={<StarFilled />} color="success" style={{marginTop: "5px"}}>
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
    	   	{selectedTags.length?
    	   		<Button size="small" 
    	   			style={{float:"right", margin: "5px 28px 0px 5px"}} 
    	   			icon={<CheckCircleTwoTone twoToneColor="#52c41a"/>}/>:<></>}
    	  </div>
    	  <div className="tags_group">
    	  	{tagsData.map(tag => (
  				<CheckableTag
   		   		key={tag}
    				checked={selectedTags.indexOf(tag) > -1}
   					onChange={checked => chooseTags(tag, checked)}>
   				#{tag}
  				</CheckableTag>
 					))}
    	  </div>
    	</Panel>
    </Collapse>
	)
}