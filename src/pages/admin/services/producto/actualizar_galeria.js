import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, PictureOutlined, EditOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './actualizar_galeria.scss';

const key = 'updatable';

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

	console.log('algo');

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
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.put(`/galeria/${productoID}/imagen/${idImagen}`, formdata, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerBD();
				message.success({
					content: res.data.message,
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

	const subirBD = async (formData) => {
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.post(`/galeria/nueva/${productoID}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerBD();
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
	const obtenerBD = async () => {
		const res = await clienteAxios.get(`/galeria/${productoID}`);
		try {
			if (!res.data.err) {
				setGaleria(res.data.imagenes);
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
	const eliminarBD = async (idimagen) => {
		const res = await clienteAxios.delete(`/galeria/${productoID}/imagen/${idimagen}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerBD();
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

	const [ prev, setPrev ] = useState('');
	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block">
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img className="img" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagenes.url}`} alt="preview-imagen" />
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
						<img className="imagen" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${prev}`} alt="preview-imagen" />
					)}
				</div>
			</div>
		</div>
	);
}
export default RegistrarGaleria;
