import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message, Spin, List, Avatar, Input } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './carousel.scss';

const { Search } = Input;

function CarouselImages() {
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ imagen, setImagen ] = useState();
	const [ loadButton, setLoadButton ] = useState(false);
	//states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	//modal para crear una imagen de carousel
	const [ search, setSearch ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);

	useEffect(
		() => {
			obtenerImagen();
		},
		[ productoID ]
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

	/// OBTENER DATOS DE LA BASE DE DATOS
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

	const obtenerImagen = async () => {
		const res = await clienteAxios.get(`/carousel/${productoID}`);
		try {
			if (!res.data.err) {
				if (res.data.message === 'Este carousel no existe') {
					setImagen(res.data.message);
				} else {
					setImagen(res.data.imagen);
				}
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoID);
			formData.append('imagen', file);
			await subirImagen(formData);
		}
	};

	const subirImagen = async (formData) => {
		setLoadButton(true);
		const res = await clienteAxios.post(`/carousel/nuevo/${productoID}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerImagen();
				setLoadButton(false);
				message.success({
					content: 'Listo!',
					duration: 2
				});
			} else {
				setLoadButton(false);
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (error) {
			setLoadButton(false);
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const render = productosFiltrados.map((productos) => (
		<List.Item
			actions={[
				<Button
					onClick={() => {
						setProducto(productos._id);
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

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div>
			<div className="row ">
				<p>Elige un producto</p>
				<Search
					placeholder="Busca un producto"
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 300, height: 40, marginBottom: 10 }}
				/>

				<List>{render}</List>
				<div className="d-flex justify-content-center align-items-center my-3">
					<Upload {...props} >
						<Button type="primary" loading={loadButton}>
							<UploadOutlined />Subir
						</Button>
					</Upload>
				</div>
				<div className="shadow imagen-preview-carousel d-flex justify-content-center align-items-center">
					{imagen === 'Este carousel no existe' ? (
						<PictureOutlined style={{ fontSize: 80 }} />
					) : (
						<img
							className="imagen"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagen}`}
							alt="preview-imagen"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default CarouselImages;
