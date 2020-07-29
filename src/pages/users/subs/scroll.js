import React, {useState, useEffect } from 'react';

import clienteAxios from '../../../config/axios.js';
import '../vistas.css';

import ImageScroller from 'react-image-scroller';

import { Card, Col} from 'antd';

const { Meta } = Card;

const properties = {
    hideScrollbar: false,
    scrollOnClick: true,
    scrollWithArrows: true,
    
}


function  Scroll() {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);

	useEffect(() => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				console.log(res);
				setProductos(res.data.posts.docs);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
    }, []);

    useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					return producto.nombre.toLowerCase().includes(search.toLowerCase());
				})
			);
		},
		[ search, productos ]
	);

    const render = productosFiltrados.map((productos) => (
		<Col key={productos.id}>
                <Card hoverable
                    className="mt-3 ml-2"
					style={{ width: 300, height: 350}}
					cover={
						<img
							className="ml-4"
							alt="producto"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
							style={{ maxHeight: 200, maxWidth: 250 }}
						/>
					}
				>
					<div>
						<h1 className="h4">{productos.nombre}</h1>
						<h2 className="h5">{new Intl.NumberFormat().format(productos.precio)}</h2>
					</div>
				</Card>
		</Col>
    ));
    
    return (
		<div>
			<div >
            <h1>Tambien te pueden interesar:</h1>
                <ImageScroller {...properties} >
                {render}
                </ImageScroller>
			</div>
			
		</div>
	);

}

export default  Scroll;

