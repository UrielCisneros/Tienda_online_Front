import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Tabs, Form, Input, Upload, Button, notification, Select, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import ActualizarGaleria from './actualizar_galeria';
import ActualizarTalla from './actualizar_talla';
import ActualizarNumero from './actualizar_numero';
import { Editor } from '@tinymce/tinymce-react';

const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

function ActualizarProducto(props) {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ files, setFiles ] = useState([]);
	const [ select, setSelect ] = useState('');
	const [ editor, setEditor ] = useState();
	const [ loading, setLoading ] = useState(false);
	const reload = props.reloadProductos;
	const [ upload, setUpload ] = useState(false);

	const [ productos, setProductos ] = useState([
		{
			codigo: '',
			nombre: '',
			precio: '',
			cantidad: '',
			imagen: ''
		}
	]);

	useEffect(
		() => {
			if(reload){
				obtenerDatos();
			}
			obtenerDatos();
		},
		[ productoID, reload ]
	);

	///UPLOAD ANTD PRODUCTO
	const antprops = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
				setFiles(file);
			};
			setUpload(true);
			return false;
		},
		onRemove: (file) => {
			setUpload(false);
			setFiles([]);
		}
	};

	const obtenerDatos = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/${productoID}`)
			.then((res) => {
				setLoading(false);
				form.setFieldsValue({
					codigo: res.data.codigo,
					nombre: res.data.nombre,
					categoria: res.data.categoria,
					precio: res.data.precio,
					cantidad: res.data.cantidad,
					descripcion: res.data.descripcion
				});
				setSelect(res.data.categoria);
				setEditor(res.data.descripcion);
				setFiles(res.data.imagen);
				setProductos(res.data);
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

	const obtenerSelect = (value) => {
		setSelect(value);
	};
	const obtenerEditor = (value) => {
		setEditor(value);
	};
	const obtenerValores = (e) => {
		setProductos({
			...productos,
			[e.target.name]: e.target.value
		});
	};

	const subirDatos = async () => {
		const formData = new FormData();
		if (productos.categoria === 'otros') {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', select);
			formData.append('cantidad', productos.cantidad);
			formData.append('precio', productos.precio);
			formData.append('descripcion', editor);
			formData.append('imagen', files);
		} else {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', select);
			formData.append('precio', productos.precio);
			formData.append('descripcion', editor);
			formData.append('imagen', files);
		}

		setLoading(true);
		await clienteAxios
			.put(`/productos/${productoID}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerDatos();
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

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab="Actualizar datos del producto" key="1">
				<Spin size="large" spinning={loading}>
					{productos.categoria === 'ropa' ? (
						<div className="d-flex justify-content-center">{<ActualizarTalla />}</div>
					) : (
						<div />
					)}
					{productos.categoria === 'calzado' ? <div>{<ActualizarNumero />}</div> : <div />}
					<Form {...layout} name="nest-messages" onFinish={subirDatos} form={form}>
						<Form.Item name="codigo" label="Codigo de barras" onChange={obtenerValores}>
							<Input name="codigo" placeholder="Campo opcional" />
						</Form.Item>
						<Form.Item label="Nombre del producto" onChange={obtenerValores}>
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="nombre"
							>
								<Input name="nombre" />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Categoria">
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="categoria"
							>
								<Select placeholder="Seleciona una categoria" onChange={obtenerSelect}>
									<Option value="ropa">Ropa</Option>
									<Option value="calzado">Calzado</Option>
									<Option value="otros">Otros</Option>
								</Select>
							</Form.Item>
						</Form.Item>
						{productos.categoria === 'otros' ? (
							<Form.Item label="Cantidad" onChange={obtenerValores}>
								<Form.Item
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
									noStyle
									name="cantidad"
								>
									<Input type="number" name="cantidad" />
								</Form.Item>
							</Form.Item>
						) : (
							<div />
						)}
						<Form.Item label="Precio del producto" onChange={obtenerValores}>
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="precio"
							>
								<Input type="number" name="precio" />
							</Form.Item>
						</Form.Item>
						<Form.Item label="Descripcion del producto" name="descripcion" >
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="descripcion"
								valuePropName="Editor"
							>
								<Editor
								value={editor}
								
									init={{
										height: 300,
										menubar: true,
										plugins: [
											'advlist autolink lists link image charmap print preview anchor',
											'searchreplace visualblocks code fullscreen',
											'insertdatetime media table paste code help wordcount'
										],
										toolbar:
											'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
									}}
									onEditorChange={obtenerEditor}
								/>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Imagen principal" name="imagen" valuePropName="filelist">
							<Upload {...antprops} name="imagen">
								<Button disabled={upload}>
									<UploadOutlined /> Subir
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item label="Imagen Actual">
							<img
								className="d-block img-fluid mt-2"
								width="200"
								alt="imagen de base"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${files}`}
							/>
						</Form.Item>
						<Form.Item className="d-flex justify-content-center align-items-center text-center">
							<Button type="primary" htmlType="submit">
								Actualizar
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</TabPane>
			<TabPane tab="Actualizar galeria de imagenes" key="2">
				<ActualizarGaleria />
			</TabPane>
		</Tabs>
	);
}
export default ActualizarProducto;
