import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, notification, Spin, Modal } from 'antd';
import {
	UploadOutlined,
	EyeOutlined,
	DeleteOutlined,
	PictureOutlined,
	LoadingOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import './registrar_galeria.scss';
import { ProductoContext } from '../../contexts/ProductoContext';

const antIcon = <LoadingOutlined style={{ fontSize: 24, marginLeft: 10 }} spin />;
const { confirm } = Modal;

function RegistrarGaleria() {
	const token = localStorage.getItem('token');
	const productoContext = useContext(ProductoContext);
	const [ galeria, setGaleria ] = useState();
	const [ loading, setLoading ] = useState(false);

	const props = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('producto', productoContext);
			formData.append('imagen', file);
			await subirBD(formData);
		}
	};

	const subirBD = async (formData) => {
		setLoading(true);
		await clienteAxios
			.post(`/galeria/nueva/${productoContext}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				setLoading(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
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
		setLoading(true);
		await clienteAxios
			.delete(`/galeria/${productoContext}/imagen/${idimagen}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerBD();
				setLoading(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	function showDeleteConfirm(idimagen) {
		confirm({
			title: 'Estás seguro de borrar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarBD(idimagen);
			}
		});
	}

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
								showDeleteConfirm(imagenes._id);
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
					{loading ? <Spin indicator={antIcon} /> : <div />}
				</Upload>
				<div className="padre">{render}</div>
			</div>
			<div className="col-sm-4 col-lg-6">
				<p className="text-center">Visualización de la imagen</p>
				<div className="shadow rounded imgPreview-registrar-galeria d-flex justify-content-center align-items-center">
					{prev === '' || galeria.length === 0 ? (
						<PictureOutlined style={{ fontSize: 80 }} />
					) : (
						<img
							className="imagen-registrar-galeria"
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
