import React, {useState, useEffect} from 'react';
import '../style.css';
import {Breadcrumb, Input, Upload, message, Tag, Divider, Button, Popconfirm} from 'antd'
import {RocketTwoTone, InboxOutlined} from '@ant-design/icons'
import axios from 'axios';

const { Dragger } = Upload;
const client_id = 'bcdefbeb2fcc6da';
const URLLIST = [];

export const UPLOAD = () =>{
	const [tagValue, setTagValue] = useState('')
	const [select, setSelect] = useState([])
	const [urllist, setUrls] = useState([])
	const [fileList, setFileList] = useState([])
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
		if (urllist.length !== 0){
			URLLIST.push(urllist[urllist.length-1])
		}
	}, [urllist])

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
		buf.push(tagValue)
		setSelect(buf)
		setTagValue('')
	}

	const handleUpload = async() => {
		// upload
		setUploading(true)
		let errFileList = []
		for (let index = 0; index < fileList.length; index++) {
			const file = fileList[index];
			const data = new FormData();
			data.append('image', file);
			const config = { headers: { Authorization: `Client-ID ${client_id}` } };
			await axios.post('https://api.imgur.com/3/image', data, config).then((res) => {
				const imgUrl = res.data.data.link
				console.log(imgUrl)
				setUrls([...urllist, imgUrl])
				message.success(`${file.name} uploaded successfully`)
			}).catch((err) => {
				message.error(`${file.name} upload failed.`)
				errFileList.push(file)
				console.log(err)
			})
		}
		setUploading(false)
		setFileList(errFileList)
	}

	const handleCancel = () => {
		// clear fileList
		setFileList([])
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

export {URLLIST}
