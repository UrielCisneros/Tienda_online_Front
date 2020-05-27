import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import './ofertas.scss'

export default function Ofertas () {
    
const [index, setIndex] = useState(0);
const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
};
    
    return (
        <div>
            <Carousel activeIndex={index} onSelect={handleSelect}>
				<Carousel.Item>
					<div className="d-block carousel-home d-flex justify-content-center align-items-center">
                        <img className="img-fluid" src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/db508dc5-5701-43b8-8579-4f522213584d_1.acc19e11e0cb8ef13757038ca2e30ed2.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff" alt="img" />
                    </div>
                    <Carousel.Caption>
						<h3>Second slide label</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
                    <div className="d-block w-100 carousel-home">
                            <img className="img-fluid" src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/1p/images/product-images/img_large/00085369967893l.jpg" alt="img2"/>
                    </div>  
					<Carousel.Caption>
						<h3>Second slide label</h3>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
                    <div className="d-block w-100 carousel-home">
                        <img className="img-fluid" src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/c9362d35-d6e1-43ba-97ea-f2fb668d5d4b_1.ee1922b090f811fc32adc8223e4454fd.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff" alt="im3"/>
                    </div>
					<Carousel.Caption>
						<h3>Third slide label</h3>
						<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
        </div>
    )
}