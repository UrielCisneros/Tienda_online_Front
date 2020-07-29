import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../../../config/axios.js';

import { Card, Col, Row, Meta} from 'antd';
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };


function Sugerencia() {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const { Meta } = Card;
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
		<Col span={32} key={productos.id}>
			<Card.Grid hoverable style={gridStyle}>
				<Card
					style={{ width: 300 }}
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
			</Card.Grid>
		</Col>
    ));
    
    return (
		<div className="Container">
			<div className="row">
			<Card
				hoverable
				style={{ width: 240 }}
				cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
				>
				<Meta title="Europe Street beat" description="www.instagram.com" />
			</Card>
			<h1>+</h1>
			<Card
				hoverable
				style={{ width: 240 }}
				cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
				>
				<Meta title="Europe Street beat" description="www.instagram.com" />
			</Card>
			<h1>=</h1>
			</div>
		</div>
	);

}

export default Sugerencia;