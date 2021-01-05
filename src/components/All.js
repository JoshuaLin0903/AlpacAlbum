import React, {useState} from 'react'
import '../style.css'
import {Breadcrumb, Button, Modal, Divider, Input, Tag, Upload} from 'antd';
import {UploadOutlined, FolderAddOutlined, InboxOutlined} from '@ant-design/icons';

const { Dragger } = Upload;

export const ALL= () =>{
	const [uploadvis, setUploadvis] = useState(false)
	const [addvis, setAddvis] = useState(false)
	const [state, setState] = useState('none')

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
				No photos ...
			</div>
		</>
	)
}