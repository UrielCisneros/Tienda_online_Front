import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Tabs, Form, Input, Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import ActualizarGaleria from './actualizar_galeria';
import ActualizarTalla from './actualizar_talla';
import ActualizarNumero from './actualizar_numero';
import { Editor } from '@tinymce/tinymce-react';

const { TabPane } = Tabs;
const { Option } = Select;
const key = 'updatable';

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

function ActualizarProducto() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ files, setFiles ] = useState([]);
	const [ select, setSelect ] = useState('');
	const [ editor, setEditor ] = useState();

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
			obtenerDatos();
		},
		[ productoID ]
	);

	///UPLOAD ANTD PRODUCTO
	const props = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
				setFiles(file);
			};
			return false;
		}
	};

	const obtenerDatos = async () => {
		const res = await clienteAxios.get(`/productos/${productoID}`);
		try {
			if (!res.data.err) {
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

		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.put(`/productos/${productoID}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerDatos();
				message.success({
					content: res.data.message,
					key,
					duration: 3
				});
			} else {
				message.error({
					content: res.data.message,
					key,
					duration: 3
				});
			}
		} catch (error) {
			console.log(error);
			message.error({
				content: 'Hubo un error',
				key,
				duration: 3
			});
		}
	};

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab="Actualizar datos del producto" key="1">
				<Form {...layout} name="nest-messages" onFinish={subirDatos} form={form}>
					<Form.Item name="codigo" label="Codigo de barras" onChange={obtenerValores}>
						<Input name="codigo" placeholder="Campo opcional" />
					</Form.Item>
					<Form.Item name="nombre" label="Nombre del producto" onChange={obtenerValores}>
						<Input name="nombre" />
					</Form.Item>
					<Form.Item name="categoria" label="Categoria">
						<Select placeholder="Seleciona una categoria" onChange={obtenerSelect}>
							<Option value="ropa">Ropa</Option>
							<Option value="calzado">Calzado</Option>
							<Option value="otros">Otros</Option>
						</Select>
					</Form.Item>
					{productos.categoria === 'otros' ? (
						<Form.Item name="cantidad" label="Cantidad" onChange={obtenerValores}>
							<Input name="cantidad" />
						</Form.Item>
					) : (
						<div />
					)}
					<Form.Item name="precio" label="Precio del producto" onChange={obtenerValores}>
						<Input name="precio" />
					</Form.Item>
					<Form.Item name="descripcion" label="Descripcion del producto">
						<Editor
							init={{
								height: 200,
								menubar: false,
								plugins: [
									'advlist autolink lists link image charmap print preview anchor',
									'searchreplace visualblocks code fullscreen',
									'insertdatetime media table paste code help wordcount'
								],
								toolbar:
									'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
							}}
							onEditorChange={obtenerEditor}
						/>
					</Form.Item>
					{productos.categoria === 'ropa' ? (
						<div className="d-flex justify-content-center">{<ActualizarTalla />}</div>
					) : (
						<div />
					)}
					{productos.categoria === 'calzado' ? <div>{<ActualizarNumero />}</div> : <div />}
					<Form.Item label="Imagen principal">
						<Upload {...props} name="imagen">
							<Button>
								<UploadOutlined /> Subir
							</Button>
						</Upload>
					</Form.Item>
					<Form.Item label="Imagen Actual">
						<img
							className="d-block img-fluid mt-2"
							width="200"
							alt="imagen de base"
							src={`http://localhost:4000/${files}`}
						/>
					</Form.Item>
					<Form.Item className="d-flex justify-content-center align-items-center text-center">
						<Button type="primary" htmlType="submit">
							Actualizar
						</Button>
					</Form.Item>
				</Form>
			</TabPane>
			<TabPane tab="Actualizar galeria de imagenes" key="2">
				<ActualizarGaleria />
			</TabPane>
		</Tabs>
	);
}
export default ActualizarProducto;
