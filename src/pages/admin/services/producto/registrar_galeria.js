import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import './registrar_galeria.scss';
import { ProductoContext } from '../../contexts/ProductoContext';

function RegistrarGaleria() {
	const token = localStorage.getItem('token');
	const productoContext = useContext(ProductoContext);
	const [ galeria, setGaleria ] = useState();

	useEffect(
		() => {
			obtenerBD();
		},
		[ productoContext ]
	);

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoContext);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};

	const subirBD = async (formData) => {
		await clienteAxios
			.post(`/galeria/nueva/${productoContext}`, formData, {
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
			.get(`/galeria/${productoContext}`)
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
			.delete(`/galeria/${productoContext}/imagen/${idimagen}`, {
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
						<span
							onClick={function() {
								setPrev(imagenes.url);
							}}
						>
							<EyeOutlined style={{ fontSize: 20 }} className="ver" />
						</span>
						<span
							onClick={function() {
								eliminarBD(imagenes._id);
							}}
						>
							<DeleteOutlined style={{ fontSize: 20 }} className="eliminar" />
						</span>
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
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/
						${prev}`}
							alt="preview-imagen"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
export default RegistrarGaleria;
