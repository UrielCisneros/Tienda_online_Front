import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, message, Carousel, Badge } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './carousel.scss';
import imagen from '../../../users/promocion.jpeg';

const key = 'updatable';

function CarouselImages() {
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ galeria, setGaleria ] = useState();
	const [ idImagen, setIdImagen ] = useState();

	useEffect(
		() => {
			obtenerImagen();
		},
		[ productoID ]
	);

	console.log('algo');

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
    
    const subirImagen = async (formData) => {
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.post(`/galeria/nueva/${productoID}`, formData, {
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
		const res = await clienteAxios.put(`/galeria/${productoID}/imagen/${idImagen}`, formdata, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerImagen();
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

	const obtenerImagen = async () => {
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
	const eliminarImagen = async (idimagen) => {
		const res = await clienteAxios.delete(`/galeria/${productoID}/imagen/${idimagen}`, {
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

	const [ prev, setPrev ] = useState('');
	if (galeria !== undefined) {
		var render = galeria.map((imagenes) => (
			<div className="shadow rounded imgStyle d-inline-block border">
				<div className="padre-iconos d-flex justify-content-around align-items-center">
					<img className="img" src={`https://tiendaab.herokuapp.com/${imagenes.url}`} alt="preview-imagen" />
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
								eliminarImagen(imagenes._id);
							}}
						/>
					</div>
				</div>
			</div>
		));
	}

	return (
		<div>
			<div>
				<Upload {...props}>
					<Button>
						<UploadOutlined /> Subir
					</Button>
				</Upload>
				<div className="padre">
					<Badge>
						<div className="contenedor-imagen d-flex shadow mr-1">
							<img className="imagen" src={imagen} alt="preview-imagen" />
							<div className="iconos-uploads-carousel justify-content-around">
                                <div style={{ fontSize: 80, color: 'white' }}>1</div>
                                <div>
                                    <Upload {...propsActualizar} className="icons-edit">
                                        <EditOutlined style={{ fontSize: 30, color: 'white' }} />
                                    </Upload>
                                    <DeleteOutlined className="icons-delete" style={{ fontSize: 30, color: 'white' }} />
                                </div>
							</div>
						</div>
					</Badge>
                    <Badge>
						<div className="contenedor-imagen d-flex shadow mr-1">
							<img className="imagen" src={imagen} alt="preview-imagen" />
							<div className="iconos-uploads-carousel justify-content-around">
                                <div style={{ fontSize: 80, color: 'white' }}>2</div>
                                <div>
                                    <Upload {...propsActualizar} className="icons-edit">
                                        <EditOutlined style={{ fontSize: 30, color: 'white' }} />
                                    </Upload>
                                    <DeleteOutlined className="icons-delete" style={{ fontSize: 30, color: 'white' }} />
                                </div>
							</div>
						</div>
					</Badge>
				</div>
			</div>
			<Carousel autoplay>
				<div className="d-flex justify-content-center">
					<h3 className="numero">1</h3>
					<img className="img-carousel" src={imagen} alt="preview-imagen" />
				</div>
				<div className="d-flex justify-content-center">
					<h3 className="numero">2</h3>
				</div>
			</Carousel>
		</div>
	);
}
export default CarouselImages;
