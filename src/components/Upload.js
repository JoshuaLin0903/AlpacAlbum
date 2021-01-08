import React, {useState, useEffect} from 'react';
import '../style.css';
import {Breadcrumb, Input, Upload, message, Tag, Divider, Button, Popconfirm} from 'antd'
import {RocketTwoTone, InboxOutlined} from '@ant-design/icons'
import axios from 'axios';

const { Dragger } = Upload;
const client_id = 'bcdefbeb2fcc6da';
const URLLIST = [];

export const UPLOAD= () =>{
	const [tagValue, setTagValue] = useState('')
	const [select, setSelect] = useState([])
	const [urllist, setUrls] = useState([])

	useEffect(() => {
		if (urllist.length !== 0){
			URLLIST.push(urllist[urllist.length-1])
		}
	}, [urllist]) 

	// imgur upload props
	const props = {
		name: 'file',
		action: 'https://api.imgur.com/3/image',
		headers: {
			Authorization: `Client-ID ${client_id}`
		},
		method: 'POST',
		onChange: (info)=>{
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				message.success(`${info.file.name} file uploaded successfully`);
			}
			else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
		customRequest: (info) => {
			const data = new FormData();
			data.append('image', info.file);
			const config = { headers: info.headers };
			axios.post(info.action, data, config).then((res) => {
				const imgUrl = res.data.data.link
				console.log(imgUrl)
				setUrls([...urllist, imgUrl])
				info.onSuccess(res.data, info.file)
			}).catch((err) => {
				info.onError(err, info.file)
			})
		}
	};

	const selectTag = () => {
		var buf = select
		buf.push(tagValue)
		setSelect(buf)
		setTagValue('')
	}

	const handleCancel = () => {
		// clear fileList
	}

	const closeTags = (tag) => {
		var buf = select.filter((t) => (t !== tag))
		setSelect(buf)
	}

	return(
		<>
			<Breadcrumb style={{margin: "21px 0"}}>
				<Breadcrumb.Item style={{color:"gray"}}>
					<RocketTwoTone twoToneColor="#eb2f96" /> Upload new photos here!
				</Breadcrumb.Item>
			</Breadcrumb>
			<div className="main-display" style={{minHeight: 535}}>
				<div style={{width: 350, textAlign:"center"}}>
					<h1 style={{fontSize: 35, marginBottom:25, color:"#00008B"}}> Upload to ... </h1>
       		<Input.Search
       			allowClear
       			value={tagValue}
       			enterButton="Enter"
       		 	placeholder="Enter the tag you want" 
       		 	style={{marginBottom: 10, width: 350}}
       		 	onChange={(e) => setTagValue(e.target.value)}
       		 	onSearch={selectTag}/>
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
          		style={{marginTop:15}} 
          		danger
          		onClick={() => setSelect([])}> 
          		Clear All </Button>:
          		<div style={{marginTop:15}}></div>
          }
       		<Divider/>
       		<Dragger {...props} style={{width: 350}}>
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
					cancelText="No">
					<Button style={{marginRight: 5, width: 75}}> Reset </Button>
				</Popconfirm>
				<Button type="primary" style={{marginRight: 5, width: 75}}> OK </Button>
			</div>
  			</div>
			</div>
		</>
	)
}

export {URLLIST}
