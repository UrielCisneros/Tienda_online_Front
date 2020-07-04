import React, { useState, useContext, useReducer } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import './registrar_galeria.scss';
import { ProductoContext } from '../../contexts/ProductoContext';

const galeriaReducer = (state = [], action) => {
	switch (action.type) {
		case 'agregar':
			return [ ...state, action.payload ];
		default:
			return state;
	}
};

function RegistrarGaleria() {
	const token = localStorage.getItem('token');

	const productoContext = useContext(ProductoContext);
	const [ state, dispatch ] = useReducer(galeriaReducer);
	const [ idGaleria, setIdGaleria ] = useState('');

	const props = {
		action: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoContext);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};

	const subirBD = async (formData) => {
		const respuesta = await clienteAxios.post(`/galeria/nueva/${productoContext}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				obtenerBD(respuesta.data._id);
			} else {
				message.error({
					content: respuesta.data.message,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
                content: 'Hubo un error',
                duration: 3,
            });
		}
	};
	const obtenerBD = async (idgaleria) => {
		const respuesta = await clienteAxios.get(`/galeria/${idgaleria}`);
		try {
			if (!respuesta.data.err) {
				const newGaleria = respuesta.data.imagenes;
				const action = {
					type: 'agregar',
					payload: newGaleria
				};
				dispatch(action);
				setIdGaleria(idgaleria);
			} else {
				message.error({
					content: respuesta.data.message,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
                content: 'Hubo un error',
                duration: 3,
            });
		}
	};
	const eliminarBD = async (idimagen) => {
		const respuesta = await clienteAxios.delete(`/galeria/${idGaleria}/imagen/${idimagen}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
                obtenerBD(idGaleria);
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
                duration: 3,
            });
		}
	};

	const [ prev, setPrev ] = useState('');
	if (state !== undefined) {
		var imagenes = state[state.length - 1];
		var render = imagenes.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block">
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img
						className="img"
						height="86"
						width="86"
						src={`http://localhost:4000/${imagenes.url}`}
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
					{prev === '' || imagenes.length === 0 ? (
						<PictureOutlined style={{ fontSize: 80 }} />
					) : (
						<img height="300" width="400" src={`http://localhost:4000/${prev}`} alt="preview-imagen" />
					)}
				</div>
			</div>
		</div>
	);
}
export default RegistrarGaleria;
