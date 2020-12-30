import React from 'react'
import alpaca from '../images/alpaca.png';
import '../style.css'

export const HOMEPAGE = () =>{
	return(
		<div className="image-display">
            <img src={alpaca}/>
        </div>
	)
}