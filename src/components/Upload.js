import React, {useState, useEffect, useRef} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Breadcrumb, Input, Upload, message, Tag, Divider, Button, Popconfirm} from 'antd'
import {
	RocketTwoTone, 
	InboxOutlined, 
	UploadOutlined, 
	SearchOutlined, 
	StarFilled,
	TagsOutlined
} from '@ant-design/icons'
import axios from 'axios';
import 'antd/dist/antd.css';

import '../style.css';
import { IMAGE_CREATE } from '../graphql/images'
import {
	TAG_ALL
  } from '../graphql/tags'

const { Dragger } = Upload;
const { CheckableTag } = Tag;
const client_id = 'b9ddfed504a8d02';

export const UPLOAD = ({ user, AppWhenUpload}) =>{
	const [select, setSelect] = useState([])
	const [showingTags, setShowingTags] = useState([])
  	const [searchValue, setSearchValue] = useState('')
	const [open, setOpen] = useState(false)
	const [fileList, setFileList] = useState([])
	const [uploading, setUploading] = useState(false)

	const isMountedRef = useRef(null)

	const [addImg] = useMutation(IMAGE_CREATE)
	const {loading: tagLoading, data: tagData, refetch: tagRefetch} = useQuery(TAG_ALL)

	const Today = new Date()
	const today = Today.getFullYear() +'/' + (Today.getMonth()+1) + '/' + Today.getDate()

	// imgur upload props
	const upload_props = {
		multiple: true,
		onRemove: file => {
			const index = fileList.indexOf(file)
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: (_, filelist) => {
			setFileList([...fileList, ...filelist])
			return false
		},
		defaultFileList: fileList,
		fileList
	};

	const selectTag = () => {
		var buf = select
		console.log(select)
		console.log(searchValue)
		if (select.indexOf(searchValue) === -1 && searchValue !== ''){
			buf.push(searchValue)
			if (tagData.tags.indexOf(searchValue) === -1){
				const str = 'A new tag is added: "'+ searchValue + '".'
				message.info({
					content: str
				})
			}
			setSelect(buf)
		}
		else if (select.indexOf(searchValue) !== -1){
			const str = '"'+ searchValue + '" has already been selected.'
			message.info({
				content: str
			})
		}
		setSearchValue('')
		setShowingTags(tagData.tags)
	}

	const handleUpload = async() => {
		// upload
		setUploading(true)
		let errFileList = []
		let sucFileIDList = []
		for (let index = 0; index < fileList.length; index++) {
			const file = fileList[index];
			const data = new FormData();
			data.append('image', file);
			const config = { headers: { Authorization: `Client-ID ${client_id}` } };
			await axios.post('https://api.imgur.com/3/image', data, config).then(async(res) => {
				const imgUrl = res.data.data.link
				console.log(res)
				console.log(imgUrl)
				const {data} = await addImg({ variables: {
					url: imgUrl,
					tags: select,
					author: user._id,
					date: today
				}})
				// console.log(data)
				sucFileIDList.push(data.createImage)
				message.success(`${file.name} uploaded successfully`)
			}).catch((err) => {
				message.error(`${file.name} upload failed.`)
				errFileList.push(file)
				console.log(err)
			})
		}
		await AppWhenUpload()
		if(isMountedRef.current){
			await tagRefetch()
			setUploading(false)
			setFileList(errFileList)
			if(errFileList.length === 0){
				// upload success
				setSelect([])
			}
		}
	}

	const handleCancel = () => {
		// clear fileList
		setFileList([])
	}

	const closeTags = (tag) => {
		var buf = select.filter((t) => (t !== tag))
		setSelect(buf)
	}

	useEffect(()=>{
		isMountedRef.current = true
		tagRefetch()
		return () => isMountedRef.current = false
	},[])

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

  const chooseTags = (tag, checked) => {
    const nextSelectedTags = checked ? [...select, tag] : select.filter(t => t !== tag);
    setSelect(nextSelectedTags);
  }

  useEffect(()=> {
    if(tagData){
      if(tagData.tags){
        setShowingTags(tagData.tags)
      }
    }
  }, [tagData])

	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<RocketTwoTone twoToneColor="#eb2f96" /> Upload new photos here!
				</Breadcrumb.Item>
			</Breadcrumb>
			<div className="main-display-up">
				<h1 style={{fontSize: 35, marginBottom:25, color:"#00008B", fontWeight: "bold"}}> 
					Upload to ... 
				</h1>
				<div className="upload-div">
					<div style={{width: "50%", height: "100%"}}>
						<div className="upload-tag">
							<h2 style={{color: "white"}}> <TagsOutlined /> Search a tag or enter a new tag. </h2>
							<Input allowClear value={searchValue} prefix={<SearchOutlined/>} style={{ width: "70%" }} 
								onChange={(e) => {filterTags(e.target.value);setSearchValue(e.target.value);}}
								onKeyDown={(e) => {
                  if(e.key === 'Enter') {selectTag()}
                }}/>
		 					<div className="chosen_tag_block-up">
        				<Tag icon={<StarFilled />} color="#26004d" style={{marginTop: "5px"}}>
        					Selected
        				</Tag>
        				: 
          			{select.map(tag => (
         				<Tag key={tag} closable={true} color={(tagData.tags.indexOf(tag) === -1)?"#87d068":"#6600cc"}
         				style={(select.indexOf(tag)===0)?{marginLeft: "5px",marginTop: "5px"}:{marginLeft: "0px",marginTop: "5px"}} 
             		onClose={() => closeTags(tag)}>
             			{tag}
            		</Tag>
          			))}
    	  			</div>
            	{tagLoading ? (<p>loading</p>):
            		(<div className="tags_group-up">
    	  					{(tagData.tags.length === 0) ?
          					<p style={{color:"gray", textAlign: "center"}}> No tags ... </p>:
         						((showingTags.length === 0)?
          						<p style={{color:"gray", textAlign: "center"}}> No tags are found </p>
          						:
          						(<><h3 style={{color: "#3b5999"}}> Click the tag you want to add </h3>
          						{showingTags.map(tag => {
          							return(
  												<CheckableTag	key={tag}	checked={select.indexOf(tag) > -1}
   													onChange={checked => chooseTags(tag, checked)}>
   				 									#{tag}
  												</CheckableTag>)})
 											}	
  										</>)
  									)	
 									}
 								</div>)}
       			</div>
       		</div>
       		<div style={{width: "50%", height: "100%"}}>
       			<div className="upload-dragger">
       				<h2 style={{color: "white"}}> <UploadOutlined /> Upload your pictures here! </h2>
       				<div style={{width: 337, height: 150}}>
       					<Dragger {...upload_props} >
									<p className="ant-upload-drag-icon">
										<InboxOutlined style={{fontSize: 50}}/>
									</p>
									<p> Click or drag file to this area </p>
  							</Dragger>
  						</div>
  						{(fileList.length === 0)?<></>:
							<div style={{margin: 15, position: "absolute", bottom: 0}}>
								<Popconfirm placement="bottom" onConfirm={handleCancel} 
								title="Are you sure to restart? Your photos won't be added."
								okText="Yes"cancelText="No">
									<Button style={{marginRight: 5, width: 75}}> Reset </Button>
								</Popconfirm>
								<Button type="primary" onClick={handleUpload}
								loading={uploading} style={{marginRight: 5, width: 75}}>
									OK
								</Button>
							</div>
							}
  					</div>
					</div>
				</div>
			</div>
		</>
	)
}
