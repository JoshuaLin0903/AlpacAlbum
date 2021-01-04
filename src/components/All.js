import React, {useState} from 'react'
import '../style.css'
import {Breadcrumb, Button, Modal, Divider, Input, Tag, Upload} from 'antd';
import {UploadOutlined, FolderAddOutlined, InboxOutlined} from '@ant-design/icons';

const { Dragger } = Upload;

export const ALL= () =>{
	const [uploadvis, setUploadvis] = useState(false)
	const [addvis, setAddvis] = useState(false)

	return(
		<>
			<Modal
       	title="Upload"
       	centered
       	visible={uploadvis}
       	onOk={() => setUploadvis(false)}
       	onCancel={() => setUploadvis(false)}
       	cancelText="Exit"
      >
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
   		</Modal>
   		
			<Breadcrumb style={{margin: "16px 0", textAlign: "right"}}>
				<Breadcrumb.Item >
					<Button ghost icon={<UploadOutlined style={{color: "gray"}} onClick={() => setUploadvis(true)}/>}/>
				</Breadcrumb.Item>
				<Breadcrumb.Item >
					<Button ghost icon={<FolderAddOutlined style={{color: "gray"}} onClick={() => setAddvis(true)}/>}/>
				</Breadcrumb.Item>
			</Breadcrumb>
			
   		<Modal
       	title="Add a new album"
       	centered
       	visible={addvis}
       	onOk={() => setAddvis(false)}
       	onCancel={() => setAddvis(false)}
       	cancelText="Exit"
      >
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
   		</Modal>

			<div className="main-display-all">
				No photos ..
			</div>
		</>
	)
}