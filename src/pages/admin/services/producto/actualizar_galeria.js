import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, PictureOutlined, EditOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './actualizar_galeria.scss';

function RegistrarGaleria() {
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ galeria, setGaleria ] = useState();
	const [ idImagen, setIdImagen ] = useState();

	useEffect(
		() => {
			obtenerBD();
		},
		[ productoID ]
	);

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoID);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('imagen', file);
			await actualizarBD(formData);
		}
	};

	const actualizarBD = async (formdata) => {
		await clienteAxios
			.put(`/galeria/${productoID}/imagen/${idImagen}`, formdata, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	const subirBD = async (formData) => {
		await clienteAxios
			.post(`/galeria/nueva/${productoID}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};
	const obtenerBD = async () => {
		await clienteAxios
			.get(`/galeria/${productoID}`)
			.then((res) => {
				setGaleria(res.data.imagenes);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};
	const eliminarBD = async (idimagen) => {
		await clienteAxios
			.delete(`/galeria/${productoID}/imagen/${idimagen}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	const [ prev, setPrev ] = useState('');
	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block">
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img
						className="img"
						src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagenes.url}`}
						alt="preview-imagen"
					/>
					<div className="iconos rounded">
						<EyeOutlined
							style={{ fontSize: 20 }}
							className="ver"
							onClick={function() {
								setPrev(imagenes.url);
							}}
						/>
						<Upload {...propsActualizar}>
							<EditOutlined
								style={{ fontSize: 20 }}
								className="modificar"
								onClick={function() {
									setIdImagen(imagenes._id);
								}}
							/>
						</Upload>
						<DeleteOutlined
							style={{ fontSize: 20 }}
							className="eliminar"
							onClick={function() {
								eliminarBD(imagenes._id);
							}}
						/>
					</div>
				</div>
			</div>
		));
	}

	return (
		<div className="responsive">
			<div className="col-sm-4 col-lg-6 imgUploads">
				<Upload {...props}>
					<Button>
						<UploadOutlined /> Upload
					</Button>
				</Upload>
				<div className="padre">{render}</div>
			</div>
			<div className="col-sm-4 col-lg-6">
				<div className="shadow rounded imgPreview d-flex justify-content-center align-items-center">
					{prev === '' || galeria.length === 0 ? (
						<PictureOutlined style={{ fontSize: 80 }} />
					) : (
						<img
							className="imagen"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${prev}`}
							alt="preview-imagen"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default RegistrarGaleria;
