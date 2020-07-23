import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message, Space } from 'antd';
import { UploadOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './carousel.scss';

const key = 'updatable';

function CarouselImages() {
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ imagen, setImagen ] = useState();

	useEffect(
		() => {
			obtenerImagen();
		},
		[ productoID ]
	);

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoID);
			formData.append('imagen', file);
			await subirImagen(formData);
		}
	};
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('imagen', file);
			await actualizarImagen(formData);
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

	const subirImagen = async (formData) => {
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.post(`/carousel/nuevo/${productoID}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerImagen();
				message.success({
					content: 'Listo!',
					key,
					duration: 1
				});
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

	const actualizarImagen = async (formdata) => {
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.put(`/carousel/${productoID}/`, formdata, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerImagen();
				message.success({
					content: 'Imagen actualizada!',
					key,
					duration: 1
				});
			} else {
				message.error({
					content: res.data.message,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				duration: 3
			});
		}
	};

	const eliminarImagen = async () => {
		const res = await clienteAxios.delete(`/carousel/${productoID}/`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerImagen();
				message.success({
					content: res.data.message,
					duration: 1
				});
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

	return (
		<div>
			<div>
				<div>
					<p>
						En esta sección puedes subir una imagen promocional de tu producto al carrusel principal en caso
						de que no existan promociones, si no existen promociones apareceran esta imagen
					</p>
				</div>
				<div className="d-flex justify-content-center align-items-center my-3">
					{imagen === 'Este carousel no existe' ? (
						<Upload {...props} className="d-inline">
							<Button>
								<UploadOutlined />Subir
							</Button>
						</Upload>
					) : (
						<Space>
							<Upload {...propsActualizar} className="d-inline">
								<Button>
									<UploadOutlined />Actualizar
								</Button>
							</Upload>
							<Button
								onClick={() => {
									eliminarImagen();
								}}
							>
								<DeleteOutlined />Eliminar
							</Button>
						</Space>
					)}
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
