import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import { Button, Spin, Col, Row, Input, Tabs, Drawer, Space } from 'antd';
import Ofertas from './services/promociones/ofertas';
import CarouselImages from './services/promociones/carousel';
import Sugerencia from './services/promociones/sugerencia'
import { IdProductoContext } from './contexts/ProductoContext';
import './promociones.scss';

const { Search } = Input;
const { TabPane } = Tabs;

function Promociones(props) {
	const token = localStorage.getItem('token');
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ productoID, setProductoID ] = useState('');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	const showDrawer = () => {
		setVisible(true);
	};
	function drawnerClose() {
		setVisible(false);
	}

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				setProductos(res.data.posts.docs);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		obtenerProductos();
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
		return <Spin size="large" />;
	}

	const render = productosFiltrados.map((productos) => (
		<Col
			style={{width: '700px'}}
			key={productos.id}
			onClick={() => {
				showDrawer();
				setProductoID(productos._id);
			}}
		>
			<Row className="contenedor shadow-sm mb-3">
				<div className="d-flex justify-content-center align-items-center mr-2" style={{ width: 150, height: 150 }}>
					<img
						className="img-fluid"
						alt="producto"
						src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
						style={{ width: '100%', maxHeight: '100%' }}
					/>
				</div>
				<div className="mt-4 titulo-producto">
					<h1 className="h4">{productos.nombre}</h1>
					<h2 className="h5">$ {new Intl.NumberFormat().format(productos.precio)}</h2>
				</div>
			</Row>
		</Col>
	));
	return (
		<div>
			<p style={{ fontSize: 20 }}>
				En este apartado puedes agregar sugerencias de otros productos a un producto, ofertas especiales o
				promocionar tu producto en la pagina principal
			</p>
			<p className="my-5 text-center" style={{ fontSize: 20 }}>
				¡Haz clic en algun producto!
			</p>
			<Row justify="center">
				<Col>
					<Search
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
					/>
				</Col>
			</Row>
			<div className="d-flex justify-content-center">
				<div>
					{render}
				</div>
			</div>
			
			<Drawer
				title="Sugerencias, Ofertas y Promociones"
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Space>
							<Button onClick={drawnerClose} type="primary">
								Cancelar
							</Button>
							<Button onClick={drawnerClose} type="primary">
								Cerrar
							</Button>
						</Space>
					</div>
				}
			>
				<IdProductoContext.Provider value={productoID}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="Promocion en Carousel" key="1">
							<CarouselImages />
						</TabPane>
						<TabPane tab="Ofertas del producto" key="2">
							<Ofertas />
						</TabPane>
						<TabPane tab="Sugerencias del producto" key="3">
							<Sugerencia />
						</TabPane>
					</Tabs>
				</IdProductoContext.Provider>
			</Drawer>
		</div>
	);
}
export default withRouter(Promociones);
