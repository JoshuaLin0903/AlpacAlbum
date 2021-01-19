import React from 'react'
import title from '../images/titleGIF.gif';
import alpaca from '../images/alpaca.png';
import '../style.css'

export const WELPAGE = () =>{

	return(
		<div className="main-display-wel">
			<div className="wel-word">
        <img src={title} style={{width: "100%", height: "auto"}}/>
        <h1 className="descrip1"> Find your pictures in an easy way </h1>
        <h1 className="descrip2"> Create your own albums </h1>
       </div>
        <div className="image-display">
      	<img src={alpaca}/>
    	</div>
    </div>
	)
}