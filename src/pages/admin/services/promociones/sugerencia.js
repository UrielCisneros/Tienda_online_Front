import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, message, Modal, List, Avatar } from 'antd';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './sugerencia.scss';

const { Search } = Input;

const Sugerencia = () => {
    const productoContext = useContext(IdProductoContext);
    //states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
    const [ productos, setProductos ] = useState([]);
    //states de obtener productos sugeridos de base, crear producto sugerido y para mapear el producto sugerido
	const [ sugerencia, setSugerencia ] = useState([]);
    const [ productoSugerido, setProductoSugerido ] = useState([]);
    const [ productoSugeridoObtenido, setProductoSugeridoObtenido ] = useState([]);
    //modal para crear un producto sugerido
	const [ modalVisible, setModalVisible ] = useState(false);
    const [ search, setSearch ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ productosFiltrados, setProductosFiltrados ] = useState([]);
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

	const obtenerTodosProductos = async () => {
		const res = await clienteAxios.get(`/productos/`);
		try {
			console.log(res);
			setProductos(res.data.posts.docs);
		} catch (err) {
			console.log(err);
		}
	};

	const obtenerProducto = async () => {
		const res = await clienteAxios.get(`/productos/${productoContext}`);
		try {
			console.log(res);
			setProducto(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const obtenerSugerencia = async () => {
        const res = await clienteAxios.get(`/sugerencia/${productoContext}`);

		try {
			console.log(res);
			if (!res.data.err) {
				if (!res.data.message) {
                    res.data.sugerencias.forEach((item) => (
                        setSugerencia(item.producto)         
                    ))
				} else {
					setSugerencia('No hay sugerencia');
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
				content: 'Hubo un error',
				duration: 2
			});
		}
    };
	/////MODAL
	const showModal = () => {
		setModalVisible(true);
	};

	const crearSugerencia = async () => {
        console.log(productoSugerido)
        setLoading(true);
        const datos = {
            producto: productoContext,
            sugerencias:[{
                producto: productoSugerido
            }]
        }
        const res = await clienteAxios.post(`/sugerencia/nueva/${productoContext}`, datos , {
            headers: {
				Authorization: `bearer ${token}`
			}
        });
		try {
            console.log(res);
            message.success({
                content: 'Hecho!',
                duration: 2
            });
			setModalVisible(false);
		} catch (err) {
			console.log(err);
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

	return (
		<div>
			<Modal
				title="Basic Modal"
				visible={modalVisible}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Salir
					</Button>,
					<Button key="crear" type="primary" loading={loading} onClick={crearSugerencia}>
						Crear
					</Button>
				]}
			>
				<p>Elige un producto que quieres sugerir</p>
				<Search
					placeholder="Busca un producto"
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 300, height: 40, marginBottom: 10 }}
				/>
				<List>{render}</List>
			</Modal>
			<div>
				<p className="text-center" style={{ fontSize: 20 }}>
					En esta sección puedes agregar una de otro producto a tu producto
				</p>
				<p className="text-center" style={{ fontSize: 18 }}>
					En este momento no tienes sugerencia para tu producto
				</p>
			</div>

			{sugerencia === 'No hay sugerencia' ? (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Button onClick={showModal}>Nueva sugerencia</Button>
				</div>
			) : (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Space>
						<Button>Actualizar sugerencia</Button>
						<Button>Quitar sugerencia</Button>
					</Space>
				</div>
			)}
			<div className="d-lg-flex d-sm-block justify-content-center mt-4 shadow border">
				<div className="contenedor-producto-actual">
					<div className="d-flex justify-content-center align-items-center">
						<img
							className="imagen-producto-actual"
							alt="producto actual"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
						/>
					</div>
					<h2>{producto.nombre}</h2>
				</div>
				<div className="contenedor-span d-flex justify-content-center align-items-center">
					<span>+</span>
				</div>
				<div className="contenedor-producto-sugerido">
					{sugerencia === 'No hay sugerencia' ? (
						<div />
					) : (
						<div>
							<img
								className="imagen-producto-sugerido"
								alt="producto sugerido" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${sugerencia.imagen}`}
							/>
							<h2>{sugerencia.nombre}</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Sugerencia;
