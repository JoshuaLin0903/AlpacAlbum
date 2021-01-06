import React, {useState} from 'react'
import '../style.css'
import {Breadcrumb, Button, Modal, Divider, Input, Tag, Upload, message} from 'antd';
import {UploadOutlined, FolderAddOutlined, InboxOutlined} from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const client_id = 'bcdefbeb2fcc6da';

export const ALL = () =>{
	const [uploadvis, setUploadvis] = useState(false)
	const [addvis, setAddvis] = useState(false)
	const [state, setState] = useState('none')

	const [urllist, setUrls] = useState([])

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

	return(
		<>
			<Breadcrumb style={{margin: "16px 0", textAlign: "right"}}>
				<Breadcrumb.Item >
					<Button ghost icon={<UploadOutlined style={{color: "gray"}} onClick={() => {setUploadvis(true);setState('up')}}/>}/>
				</Breadcrumb.Item>
				<Breadcrumb.Item >
					<Button ghost icon={<FolderAddOutlined style={{color: "gray"}} onClick={() => {setAddvis(true);setState('add')}}/>}/>
				</Breadcrumb.Item>
			</Breadcrumb>
			
   		<Modal
       	title={(state === 'up')? "Upload":"Add a new album"}
       	centered
       	visible={(state === 'up')? uploadvis:addvis}
       	onOk={() => {setState('none');(state === 'up')? setUploadvis(false):setAddvis(false)}}
       	onCancel={() => {setState('none');(state === 'up')? setUploadvis(false):setAddvis(false)}}
       	cancelText="Exit"
      >
      	{(state === 'up')?
      		<div>
      			<p> Upload to ... </p>
       			<Input placeholder="Enter the tag you want" style={{marginBottom: 10}}/>
       			<div>
       				<Tag color="geekblue"> Selected </Tag>
       				:
       			</div>
       			<Divider/>
       				<Dragger {...props}>
    					<p className="ant-upload-drag-icon">
      					<InboxOutlined />
    					</p>
    					<p className="ant-upload-text">Click or drag file to this area to upload</p>
    					<p className="ant-upload-hint">
      					Support for a single or multiple pictures.
    					</p>
  					</Dragger>
  				</div>
      		:
      		<div>
       		<p> The new album </p>
       		<Input placeholder="Enter the new album's name" />
       		<Divider/>
       		<Dragger>
    				<p className="ant-upload-drag-icon">
      				<InboxOutlined />
    				</p>
    				<p className="ant-upload-text">Click or drag file to this area to upload</p>
    				<p className="ant-upload-hint">
      				Support for a single or multiple pictures.
    				</p>
  				</Dragger>
  			</div>
  			}
   		</Modal>

			<div className="main-display-all">
				{urllist.length === 0 ? (
					<p>No photos ...</p>
				):(
					urllist.map((url, i) => {
						return (<p key={i}><a target="_blank" rel="noopener noreferrer" href={url}>image {i}</a></p>)
					})
				)}
			</div>
		</>
	)
}