import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import './registrar_galeria.scss';
import { ProductoContext } from '../../contexts/ProductoContext';

const key = 'updatable';

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
		message.loading({ content: 'En proceso...', key });
		const respuesta = await clienteAxios.post(`/galeria/nueva/${productoContext}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				obtenerBD();
				message.success({
					content: 'Listo!',
					key,
					duration: 1
				});
			} else {
				message.error({
					content: respuesta.data.message,
					key,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				key,
				duration: 3
			});
		}
	};
	const obtenerBD = async () => {
		const respuesta = await clienteAxios.get(`/galeria/${productoContext}`);
		try {
			if (!respuesta.data.err) {
				setGaleria(respuesta.data.imagenes);
			} else {
				message.error({
					content: respuesta.data.message,
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
	const eliminarBD = async (idimagen) => {
		const respuesta = await clienteAxios.delete(`/galeria/${productoContext}/imagen/${idimagen}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				obtenerBD();
				message.success({
					content: respuesta.data.message,
					duration: 3
				});
			} else {
				message.error({
					content: respuesta.data.message,
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

	const [ prev, setPrev ] = useState('');
	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block">
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img className="img" src={`https://tiendaab.herokuapp.com/${imagenes.url}`} alt="preview-imagen" />
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
						<img className="imagen" src={`https://tiendaab.herokuapp.com/${prev}`} alt="preview-imagen" />
					)}
				</div>
			</div>
		</div>
	);
}
export default RegistrarGaleria;
