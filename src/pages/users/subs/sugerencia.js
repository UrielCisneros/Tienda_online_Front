import React from 'react';
import { Link } from 'react-router-dom';

import { Card} from 'antd';

const { Meta } = Card;

const Sugerencia = () => {
    return(
       <div>
		   <div className="row px-5" >
		   <Card
				hoverable
				style={{ width: 160, height: 210 }}
				cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} >
				<Meta title="Europe Street beat" description="www.instagram.com" />
			</Card>
			<h1 style={{fontSize: 80, marginTop: 30}}>+</h1>
			<Card
				hoverable
				style={{ width: 160, height: 210 }}
				cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />} >
				<Meta title="Europe Street beat" description="www.instagram.com" />
			</Card>
			<h1  style={{fontSize: 80, marginTop: 30}}>=</h1>

			<h1 style={{fontSize: 52, marginTop: 48}}>$10201</h1>
		   </div>
	   </div>
    )
}

export default Sugerencia;