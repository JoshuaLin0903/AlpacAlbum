import React, {useState, useEffect, useRef} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Breadcrumb, Input, Upload, message, Tag, Divider, Button, Popconfirm, AutoComplete} from 'antd'
import {RocketTwoTone, InboxOutlined} from '@ant-design/icons'
import axios from 'axios';

import '../style.css';
import { IMAGE_CREATE } from '../graphql/images'
import {
	TAG_ALL
  } from '../graphql/tags'

const { Dragger } = Upload;
const client_id = 'bcdefbeb2fcc6da';

export const UPLOAD = ({ user, AppWhenUpload, updPics, setUpdPics}) =>{
	const [tagValue, setTagValue] = useState('')
	const [select, setSelect] = useState([])
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
		fileList,
	};

	const selectTag = () => {
		var buf = select
		if (buf.indexOf(tagValue) === -1 && tagValue !== ''){
			buf.push(tagValue)
			setSelect(buf)
		}
		else if (buf.indexOf(tagValue) !== -1){
			const str = '"'+ tagValue + '" has already been selected.'
			message.info(str)
		}
		setTagValue('')
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
					tags: select
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
		// START: update UpdPics object
		const newUpdPics = updPics
		select.map((tag)=>{
			if(!newUpdPics[tag]){
				newUpdPics[tag] = []
			}
			newUpdPics[tag] = [...sucFileIDList.reverse() , ...newUpdPics[tag]]
		})
		if(!newUpdPics["All"]){
			newUpdPics["All"] = []
		}
		newUpdPics["All"] = [...sucFileIDList , ...newUpdPics["All"]]
		// console.log(newUpdPics)
		setUpdPics(newUpdPics)
		// END: update UpdPics object
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

	const Options = tagLoading ? [] : tagData.tags.map((m) =>{
		return {value: m}
	})

	useEffect(()=>{
		isMountedRef.current = true
		tagRefetch()
		return () => isMountedRef.current = false
	},[])

	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<RocketTwoTone twoToneColor="#eb2f96" /> Upload new photos here!
				</Breadcrumb.Item>
			</Breadcrumb>
			<div className="main-display-cen">
				<div style={{width: 350, textAlign:"center"}}>
					<h1 style={{fontSize: 35, marginBottom:25, color:"#00008B"}}> Upload to ... </h1>
					<AutoComplete
						style={{marginBottom: 10, width: 350}}
						open={open}
						onBlur={() => setOpen(false)}
						onClick={() => setOpen(true)}
						onSelect={()=> setOpen(false)}
						value={tagValue}
						options={Options}
						filterOption={(inputValue, option) =>
      				option.value.toUpperCase().substr(0,inputValue.length) === inputValue.toUpperCase()
    				}
    				onChange={(value) => {setTagValue(value);setOpen(true)}}
					>
       			<Input.Search
       				enterButton="Enter"
       		 		placeholder="Enter the tag you want"
       		 		onChange={(e) => {setTagValue(e.target.value)}}
       		 		onSearch={() => {selectTag();setOpen(false);}}
       		 	/>
       		 </AutoComplete>
       		<div style={{textAlign:"left"}}>
       			<Tag color="geekblue"> Selected </Tag>
       			:
       			{select.map((tag) => (
         			<Tag 
         				key={tag} 
         				closable={true} 
         				style={(select.indexOf(tag)===0)?
         					{marginLeft: "5px"}:{marginLeft: "0px"}} 
             		onClose={() => closeTags(tag)}>
             		{tag}
            	</Tag>
          	))}
       		</div>
       		{select.length?
          		<Button size="small" 
          		style={{marginTop:15, borderColor:"#E9967A", fontSize: 12}} 
          		danger
          		onClick={() => setSelect([])}
          		shape="round"> 
          			Clear All 
          		</Button>:
          		<div style={{marginTop:15}}></div>
          }
       		<Divider/>
       		<Dragger {...upload_props} style={{width: 350}}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag file to this area to upload</p>
				<p className="ant-upload-hint">
					Support for a single or multiple pictures.
				</p>
  			</Dragger>
			<div style={{margin: 15}}>
				<Popconfirm placement="bottom" 
					onConfirm={handleCancel} 
					title="Are you sure to restart? Your photos won't be added."
					okText="Yes"
					cancelText="No"
				>
					<Button style={{marginRight: 5, width: 75}} disabled={fileList.length === 0}> Reset </Button>
				</Popconfirm>
				<Button 
					type="primary"
					onClick={handleUpload}
					disabled={fileList.length === 0}
					loading={uploading}
					style={{marginRight: 5, width: 75}}
				>
					OK
				</Button>
			</div>
  			</div>
			</div>
		</>
	)
}
