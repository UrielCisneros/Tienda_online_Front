import React, { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { Card, Col, Row, Pagination, Spin, Input } from 'antd';

const { Search } = Input;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function Productos() {
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

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spin size="large" />
			</div>
		);
	}

	const render = productosFiltrados.map((productos) => (
		<Col span={32} key={productos.id}>
			<Card.Grid hoverable style={gridStyle}>
				<Card
					style={{ width: 300 }}
					cover={
						<img
							className="ml-4"
							alt="producto"
							src={`https://tiendaab.herokuapp.com/${productos.imagen}`}
							style={{ maxHeight: 200, maxWidth: 250 }}
						/>
					}
				>
					<div>
						<h1 className="h4">{productos.nombre}</h1>
						<p>{productos.descripcion}</p>
						<h2 className="h5">{new Intl.NumberFormat().format(productos.precio)}</h2>
					</div>
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<div>
			<h3 className="ml-5 mt-4 mb-4">Algunos de nuestros productos...</h3>
			<div className="container w-50 mb-5">
				<h5>Busca un producto en específico</h5>
				<Search
					placeholder="Busca un producto"
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 400, height: 40, marginBottom: 10 }}
				/>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="site-card-wrapper">
					<Row gutter={24} style={{ maxWidth: '90vw' }}>
						{render}
					</Row>
				</div>
			</div>
			<div className="mt-5 mb-5 text-center">
				<Pagination defaultCurrent={1} total={500} />
			</div>
		</div>
	);
}

export default Productos;
