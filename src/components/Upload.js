import React, {useState, useEffect} from 'react';
import '../style.css';
import {Breadcrumb, Input, Upload, message, Tag, Divider, Button, Popconfirm, AutoComplete} from 'antd'
import {RocketTwoTone, InboxOutlined} from '@ant-design/icons'
import axios from 'axios';

const { Dragger } = Upload;
const client_id = 'bcdefbeb2fcc6da';

export const UPLOAD = ({imgData, taglist, user}) =>{
	const [tagValue, setTagValue] = useState('')
	const [select, setSelect] = useState([])
	const [urllist, setUrls] = useState([])
	const [open, setOpen] = useState(false)
	const [fileList, setFileList] = useState([])
	const [uploading, setUploading] = useState(false)

	const Today = new Date()
	const today = Today.getFullYear() +'/' + (Today.getMonth()+1) + '/' + Today.getDate()

	useEffect(() => {
		//updata imgData
		if (urllist.length !== 0){
			var s = ['All']
			s = s.concat(select)
			urllist.forEach((u) => {
				imgData.push({
					url: u,
					tags: s,
					author: user,
					date: today,
					msg: []
				})
			})
			const new_tag = select.filter((t) => (taglist.indexOf(t) === -1))
			new_tag.forEach((t) => {taglist.push(t)})
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
		setSelect([])
	}

	const handleCancel = () => {
		// clear fileList
		setFileList([])
	}

	const closeTags = (tag) => {
		var buf = select.filter((t) => (t !== tag))
		setSelect(buf)
	}

	const Options = taglist.map((m) =>{
		return {value: m}
	})

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
