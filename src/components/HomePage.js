import React from 'react'
import alpaca from '../images/alpaca.png';
import '../style.css'
import { Button, Input} from 'antd';
import { UserAddOutlined} from '@ant-design/icons';

export const HOMEPAGE = () =>{
	return(
		<div className="image-display">
            <img src={alpaca}/>
        </div>

	)
}