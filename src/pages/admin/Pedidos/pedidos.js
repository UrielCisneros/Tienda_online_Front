import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './pedidos.scss';
import { Card, Col, Row, Modal, notification, Result, Spin, Radio, Tag, Button } from 'antd';
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';
import clienteAxios from '../../../config/axios';
import DetallesPedido from './detalles_pedido';
import EstadoPedido from './estado_pedido';

const { Meta } = Card;

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

function Pedidos(props) {
	const token = localStorage.getItem('token');
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

	const [ pedidos, setPedidos ] = useState([]);
	const [ pedidosFiltrados, setPedidosFiltrados ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	//States de filtros
	const [ mostrarPedidos, setMostrarPedidos ] = useState('todos');
	//state modales
    const [ visible, setVisible ] = useState(false);
    const [ estadoVisible, setEstadoVisible ] = useState(false);
	//state para mostrar pedido en el modal
    const [ detallePedido, setDetallePedido ] = useState([]);
    const [ reload, setReload ] = useState(false);

	useEffect(() => {
        obtenerPedidos();
        setReload(false);
	}, [reload]);

	useEffect(
		() => {
			setPedidosFiltrados(
				pedidos.filter((pedido) => {
					switch (mostrarPedidos) {
						case 'todos':
							return pedido;
						case 'proceso':
							return pedido.estado_pedido.includes('En proceso');
						case 'enviados':
							return pedido.estado_pedido.includes('Enviado');
						case 'pagados':
							return pedido.pagado.toString().includes('true');
						case 'noPagados':
							return pedido.pagado.toString().includes('false');
						default:
							return pedido;
					}
				})
			);
		},
		[ mostrarPedidos, pedidos ]
	);

	const obtenerPedidos = async () => {
		setLoading(true);
		await clienteAxios
			.get('/pedidos', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPedidos(res.data);
				setLoading(false);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	function onChange(e) {
		setMostrarPedidos(e.target.value);
	}
	const showModal = () => {
		setVisible(true);
    };
    const showModalEstado = () => {
		setEstadoVisible(true);
    };
    const handleCancelEstado = () => {
		setEstadoVisible(false);
	};
	const handleCancel = () => {
        setVisible(false);
	};

	const render = pedidosFiltrados.map((pedidos) => (
		<Col className="mb-3" span={window.screen.width > 990 ? 8 : 24} key={pedidos._id}>
			<Card
				actions={[
					<div className="d-flex justify-content-center align-items-center">
						<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
						<p
							onClick={() => {
								setDetallePedido(pedidos);
								showModal();
							}}
							className="d-inline"
						>
							Detalles del pedido
						</p>
					</div>,
					<div className="d-flex justify-content-center align-items-center">
						<EditOutlined className="mr-2" style={{ fontSize: 20 }} />
						<p
							onClick={() => {
								setDetallePedido(pedidos);
								showModalEstado()
							}}
							className="d-inline"
						>
							Cambiar estado
						</p>
					</div>
				]}
			>
				<Meta
					description={
						<div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">ID del pedido: </h6>
								<p className="data-info-pedidos">{pedidos._id}</p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Creado el:</h6>
								<p className="data-info-pedidos">{pedidos.createdAt}</p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Cliente:</h6>
								<p className="data-info-pedidos">{pedidos.cliente.nombre}</p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">No. de productos:</h6>
								<p className="data-info-pedidos">{pedidos.pedido.length}</p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Estado:</h6>
								<Tag
									className="data-info-pedidos"
									color={pedidos.estado_pedido === 'Enviado' ? '#5cb85c' : '#0275d8'}
								>
									{pedidos.estado_pedido}
								</Tag>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Pagado:</h6>
								<Tag
									className="data-info-pedidos"
									color={pedidos.pagado === true ? '#5cb85c' : '#f0ad4e'}
								>
									{pedidos.pagado === true ? 'Si' : 'No'}
								</Tag>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Total:</h6>
								<p className="precio-total-pedidos data-info-pedidos">
									$ {formatoMexico(pedidos.total)}
								</p>
							</div>
						</div>
					}
				/>
			</Card>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div>
				<p style={{ fontSize: 20 }}>
					En este apartado puedes ver todos los pedidos de tus clientes, filtrar por estados, si ya están
					pagados o no y cambiar su estado.
				</p>
				<div className="mt-4">
					<p className="d-lg-inline d-block mr-5">Mostrar por:</p>
					<Radio.Group name="radiogroup" defaultValue="todos" size="mediun">
						<Radio className="d-lg-inline d-block mb-1" value="todos" onChange={onChange}>
							Todos los pedidos
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="proceso" onChange={onChange}>
							Pedidos en Proceso
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="enviados" onChange={onChange}>
							Pedidos enviados
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="pagados" onChange={onChange}>
							Pedidos Pagados
						</Radio>
						<Radio className="d-lg-inline d-block mb-1" value="noPagados" onChange={onChange}>
							Pedidos no pagados
						</Radio>
					</Radio.Group>
				</div>
				<div className="mt-4">
					{pedidos.length === 0 || pedidosFiltrados.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result status="404" title="No hay resultados" />
						</div>
					) : (
						<Row gutter={16}>{render}</Row>
					)}
				</div>
			</div>
			<Modal
                key="detalle"
				width={600}
				style={{ top: 0 }}
				title="Detalles de este pedido"
                visible={visible}
                onCancel={handleCancel}
				footer={[
                    <Button key="detalle" type="primary" onClick={handleCancel}>
                      Cerrar
                    </Button>
                  ]}
			>
				<DetallesPedido datosDetalle={detallePedido} />
			</Modal>
            <Modal
                key="estado"
				width={600}
				title="Estado del pedido"
                visible={estadoVisible}
                onCancel={handleCancelEstado}
				footer={[
                    <Button key="estado" type="primary" onClick={handleCancelEstado}>
                      Cerrar
                    </Button>
                  ]}
			>
				<EstadoPedido datosPedido={detallePedido} reload={setReload}/>
			</Modal>
		</Spin>
	);
}
export default withRouter(Pedidos);
