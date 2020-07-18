import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, message, Modal, List, Avatar, Card, Spin } from 'antd';
import { IdProductoContext } from '../../contexts/ProductoContext';
import InfiniteScroll from 'react-infinite-scroller';
import './sugerencia.scss';

const { Search } = Input;
const { Meta } = Card;

const Sugerencia = () => {
    const [ loadingPrincipal, setLoadingPrincipal ] = useState(false);
	const productoContext = useContext(IdProductoContext);
	//states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	//states de obtener productos sugeridos de base, crear producto sugerido y para mapear el producto sugerido
	const [ sugerencia, setSugerencia ] = useState([]);
	const [ productoSugerido, setProductoSugerido ] = useState([]);
	//modal para crear un producto sugerido
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);

	//infinite scroll
	const [ loadingScroll, setLoadingScroll ] = useState(false);
	const [ hasMore, setHasMore ] = useState(true);

	///state para saber si va a actualizar o registrar
	const [ actualizar, setActualizar ] = useState(false);
	//token
	const token = localStorage.getItem('token');
	console.log('hola');

	useEffect(
		() => {
			obtenerProducto();
			obtenerTodosProductos();
			obtenerSugerencia();
		},
		[ productoContext ]
	);

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

	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerTodosProductos = async () => {
		const res = await clienteAxios.get(`/productos/`);
		try {
			setProductos(res.data.posts.docs);
		} catch (err) {
            console.log(err);
            message.error({
				content: 'Hubo un error al obtener productos',
				duration: 2
			});
		}
	};

	const obtenerProducto = async () => {
		const res = await clienteAxios.get(`/productos/${productoContext}`);
		try {
			setProducto(res.data);
		} catch (err) {
            console.log(err);
            message.error({
				content: 'Hubo un error al obtener producto',
				duration: 2
			});
		}
	};

	const obtenerSugerencia = async () => {
        setLoadingPrincipal(true)
		const res = await clienteAxios.get(`/sugerencia/${productoContext}`);
		try {
			if (!res.data.err) {
				if (!res.data.message) {
                    res.data.sugerencias.forEach((item) => setSugerencia(item.producto));
                    setLoadingPrincipal(false)
				} else {
                    setSugerencia('No hay sugerencia');
                    setLoadingPrincipal(false)
				}
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			console.log(err);
			message.error({
				content: 'Hubo un error al obtener sugerencia',
				duration: 2
			});
		}
	};
	///// CREAR, ACTUALIZAR Y ELIMINAR SUGERENCIAS DE LA BASE DE DATOS
	const crearSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		const res = await clienteAxios.post(`/sugerencia/nueva/${productoContext}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
        });
		try {
            if(!res.data.err){
                message.success({
                    content: 'Hecho!',
                    duration: 2
                });
                setModalVisible(false);
                obtenerSugerencia();
                setLoading(false);
            }else{
                message.error({
                    content: res.data.message,
                    duration: 2
                });
            }	
		} catch (err) {
            console.log(err);
            setLoading(false);
            message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const actualizarSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		const res = await clienteAxios.put(`/sugerencia/${productoContext}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
            if(!res.data.err){
                message.success({
                    content: 'Hecho! Sugerencia actualizada',
                    duration: 2
                });
                setModalVisible(false);
                obtenerSugerencia();
                setLoading(false);
            }else{
                message.error({
                    content: res.data.message,
                    duration: 2
                });
            }
		} catch (err) {
            console.log(err);
            setLoading(false);
            message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
    };
    
    const eliminarSugerencia = async () => {
		const res = await clienteAxios.delete(`/sugerencia/${productoContext}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
            if(res.data.message === 'Sugerencia de compra eliminada'){
                message.success({
                    content: res.data.message,
                    duration: 2
                });
                obtenerSugerencia()
            }else{
                message.error({
                    content: res.data.message,
                    duration: 2
                });
            }
		} catch (err) {
            console.log(err);
            message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
    }

	/////MODAL
	const showModal = (accion) => {
		if (accion === 'actualizar') {
			setModalVisible(true);
			setActualizar(true);
		} else {
			setModalVisible(true);
		}
	};
	const handleCancel = () => {
		setModalVisible(false);
	};

	const render = productosFiltrados.map((productos) => (
		<List.Item
			actions={[
				<Button
					onClick={() => {
						setProductoSugerido(productos);
					}}
				>
					Seleccionar
				</Button>
			]}
		>
			<List.Item.Meta
				avatar={
					<Avatar src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`} />
				}
				title={productos.nombre}
			/>
		</List.Item>
    ));
    
    if (loadingPrincipal) {
		return(
            <div className="d-flex justify-content-center align-items-center">
                <Spin size="large" />
            </div>);
	}

	return (
		<div>
			<Modal
				title="Sugerencias de producto"
				visible={modalVisible}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Salir
					</Button>,
					actualizar === false ? (
						<Button key="crear" type="primary" loading={loading} onClick={crearSugerencia}>
							Crear
						</Button>
					) : (
						<Button key="crear" type="primary" loading={loading} onClick={actualizarSugerencia}>
							Actualizar
						</Button>
					)
				]}
			>
				<p>Elige un producto que quieres sugerir</p>
				<Search
					placeholder="Busca un producto"
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 300, height: 40, marginBottom: 10 }}
				/>
				<InfiniteScroll
					initialLoad={false}
					pageStart={0}
					loadMore={obtenerTodosProductos}
					hasMore={!loading && hasMore}
					useWindow={false}
				>
					<List>{render}</List>
				</InfiniteScroll>
			</Modal>
			<div>
				<p className="text-center" style={{ fontSize: 20 }}>
					En esta sección puedes agregar una de otro producto a tu producto
				</p>
				{sugerencia === 'No hay sugerencia' ? (
					<p className="text-center" style={{ fontSize: 18 }}>
						En este momento no tienes sugerencia para tu producto
					</p>
				) : (
					<p />
				)}
			</div>

			{sugerencia === 'No hay sugerencia' ? (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Button onClick={showModal}>Nueva sugerencia</Button>
				</div>
			) : (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Space>
						<Button
							onClick={() => {
								showModal('actualizar');
							}}
						>
							Actualizar sugerencia
						</Button>
						<Button onClick={eliminarSugerencia}>Quitar sugerencia</Button>
					</Space>
				</div>
			)}
			<div className="d-lg-flex d-sm-block justify-content-center mt-4">
				<Card
					className="shadow"
					style={{ width: 300 }}
					cover={
						<img
							className="imagen-producto-actual"
							alt="producto actual"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
						/>
					}
				>
					<Meta title={producto.nombre} />
				</Card>
				<div className="contenedor-span d-flex justify-content-center align-items-center">
					<span>+</span>
				</div>
				{sugerencia === 'No hay sugerencia' ? (
					<div />
				) : (
					<Card
						className="shadow"
						style={{ width: 300 }}
						cover={
							<img
								className="imagen-producto-actual"
								alt="producto sugerido"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${sugerencia.imagen}`}
							/>
						}
					>
						<Meta title={sugerencia.nombre} />
					</Card>
				)}
			</div>
		</div>
	);
};

export default Sugerencia;
