import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import RegistrarProducto from './registrar_producto';
import ActualizarProducto from './actualizar_producto';
import { Card, Col, Row, Input, Spin, Button, Modal, Drawer } from 'antd';
import {
	ExclamationCircleOutlined,
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { confirm } = Modal;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function RegistrarProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const token = localStorage.getItem('token');
	const rol = parseJwt(token);

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (rol['rol'] !== true) {
		props.history.push('/');
	}

	function drawnerClose() {
		setVisible(false);
	}
	function setActualizar() {
		setAccion(true);
		setVisible(true);
	}
	function setRegistrar() {
		setAccion(false);
		setVisible(true);
	}

	function parseJwt(token) {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	}

	function showDeleteConfirm() {
		confirm({
			title: 'Estas seguro de eliminar este articulo?',
			icon: <ExclamationCircleOutlined />,
			content: 'Este articulo sera borrado permanentemente',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				console.log('OK');
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	}

	useEffect(() => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				setProductos(res.data);
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
		return <Spin size="large" />;
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
							src={productos.imagen}
							style={{ maxHeight: 200, maxWidth: 250 }}
						/>
					}
					actions={[
						<Link onClick={setActualizar} className="text-decoration-none">
							<EditOutlined style={{ fontSize: 22 }} />Actualizar
						</Link>,
						<Link to="/articulo" className="text-decoration-none">
							<EyeOutlined style={{ fontSize: 22 }} />Ver
						</Link>,
						<Link onClick={showDeleteConfirm} className="text-decoration-none">
							<DeleteOutlined style={{ fontSize: 22 }} />Eliminar
						</Link>
					]}
				>
					<div>
						<h1 className="h4">{productos.nombre}</h1>
						<p>{productos.descripcion}</p>
						<h2 className="h5">{productos.precio}</h2>
					</div>
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<div>
			<Drawer
				title="Create a new account"
                height={620}
                placement={"top"}
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={drawnerClose} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				{accion === true ? <ActualizarProducto /> : <RegistrarProducto />}
			</Drawer>
			<Row justify="center">
				<Col>
					<Search
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 400, height: 40 }}
					/>
				</Col>
				<Col>
					<Button
						type="primary"
						size="large"
						className="ml-3 d-flex justify-content-center align-items-center"
						onClick={setRegistrar}
						icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
					>
						Registrar un producto
					</Button>
				</Col>
			</Row>

			<Row gutter={24} style={{ maxWidth: '90vw' }} className="mt-5">
				{render}
			</Row>
		</div>
	);
}
export default withRouter(RegistrarProductos);
