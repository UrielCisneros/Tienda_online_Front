import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Select, Steps, notification, Upload, Spin } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import './registrar_producto.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import { StepsContext } from '../../contexts/stepsContext';
import RegistrarGaleria from './registrar_galeria';
import RegistrarTalla from './registrar_talla';
import RegistrarNumero from './registrar_numero';
import { Editor } from '@tinymce/tinymce-react';

const { Option } = Select;
const { Step } = Steps;
const antIcon = <LoadingOutlined style={{ fontSize: 24, marginLeft: 10 }} spin />;

///Layout para formulario(columnas)
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

function RegistrarProducto(props) {
	const [ form ] = Form.useForm();
	const [ disabled, setDisabled ] = useContext(StepsContext);
	///Autorizacion a la pagina con Token
	const token = localStorage.getItem('token');
	/// Declaracion de variables para los pasos
	const [ current, setCurrent ] = useState(0);

	////Activar y desactivar los botones Next y Prev
	const [ editor, setEditor ] = useState();
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledform, setDisabledForm ] = useState(true);
	const [ disabledformProductos, setDisabledFormProductos ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ reload, setReload ] = props.reloadProductos;

	if (reload) {
		form.resetFields();
	}
	useEffect(
		() => {
			setCurrent(0);
		},
		[ reload ]
	);

	const next = () => {
		setCurrent(current + 1);
		if (current === 0) {
			setDisabled(true);
		} else if (current >= 1) {
			setDisabledPrev(true);
		} else {
			setDisabledPrev(false);
		}
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	///UPLOAD ANTD PRODUCTO
	const [ files, setFiles ] = useState([]);
	const propss = {
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

	///capturar datos maualmente}
	const [ datos, setDatos ] = useState({
		codigo: '',
		nombre: '',
		cantidad: '',
		precio: '',
		imagen: ''
	});
	//// Capturar valores del select
	const [ select, setSelect ] = useState('');

	const onSelect = (value) => {
		setSelect(value);
		if (value) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};
	const obtenerEditor = (value) => {
		setEditor(value);
	};
	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	/// Guardar y almacenar en la api REST
	const [ productoID, setProductoID ] = useState('');

	async function onFinish() {
		setLoading(true);
		const formData = new FormData();
		formData.append('codigo', datos.codigo);
		formData.append('nombre', datos.nombre);
		formData.append('categoria', select);
		formData.append('cantidad', datos.cantidad);
		formData.append('precio', datos.precio);
		formData.append('descripcion', editor);
		formData.append('imagen', files);

		await clienteAxios
			.post('/productos/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setReload(true);
				setLoading(false);
				setDisabledPrev(true);
				setDisabled(false);
				setDisabledFormProductos(true);
				setDisabledForm(false);
				setProductoID(res.data.userStored._id);
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
	}

	////CONTENIDO DE LOS PASOS
	const steps = [
		{
			title: 'Categoria',
			content: (
				<div className="d-flex justify-content-center align-items-center mt-4 mb-2">
					<div className="text-center">
						<h2 className="mb-5">Selecciona una categoria para continuar</h2>
						<Select placeholder="Seleciona una categoria" onChange={onSelect} style={{ width: 300 }}>
							<Option value="ropa">Ropa</Option>
							<Option value="calzado">Calzado</Option>
							<Option value="otros">Otros</Option>
						</Select>
					</div>
				</div>
			)
		},
		{
			title: 'Producto',
			content: (
				<div className="d-flex justify-content-center align-items-center mt-4 mb-2">
					<div style={{ width: 900 }}>
						<h2 className="mb-5 text-center">Registrar el producto</h2>
						<div>
							<Form
								{...layout}
								name="nest-messages"
								onFinish={onFinish}
								initialValues={{ categoria: select }}
								form={form}
							>
								<Form.Item label="Codigo de barras" onChange={datosForm}>
									<Input
										name="codigo"
										disabled={disabledformProductos}
										placeholder="Campo opcional"
									/>
								</Form.Item>
								<Form.Item
									label="Nombre del producto"
									name="nombre"
									onChange={datosForm}
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
								>
									<Input name="nombre" disabled={disabledformProductos} />
								</Form.Item>
								{select === 'otros' ? (
									<Form.Item
										label="Cantidad"
										name="cantidad"
										onChange={datosForm}
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
									>
										<Input type="number" name="cantidad" disabled={disabledformProductos} />
									</Form.Item>
								) : (
									<div />
								)}
								<Form.Item
									label="Precio del producto"
									name="precio"
									onChange={datosForm}
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
								>
									<Input type="number" disabled={disabledformProductos} name="precio" />
								</Form.Item>
								<Form.Item
									label="Descripcion del producto"
									name="descripcion"
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
								>
									<Editor
										disabled={disabledformProductos}
										init={{
											height: 200,
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
								<Form.Item
									label="Imagen principal"
									name="imagen"
									rules={[ { required: true, message: 'Este campo es requerido' } ]}
								>
									<Upload {...propss}>
										<Button disabled={disabledformProductos}>
											<UploadOutlined /> Subir
										</Button>
									</Upload>
								</Form.Item>
								<Form.Item className="d-flex justify-content-center align-items-center text-center">
									<Button type="primary" htmlType="submit" disabled={disabledformProductos}>
										Registrar
									</Button>
									{loading ? <Spin indicator={antIcon} /> : <div />}
								</Form.Item>
							</Form>
							{select === 'ropa' ? (
								<div className="d-flex justify-content-center">
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarTalla />
									</ProductoContext.Provider>
								</div>
							) : (
								<div />
							)}
							{select === 'calzado' ? (
								<div>
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarNumero />
									</ProductoContext.Provider>
								</div>
							) : (
								<div />
							)}
						</div>
					</div>
				</div>
			)
		},
		{
			title: 'Galeria',
			content: (
				<div className="contenedor-galeria d-flex justify-content-center align-items-center mt-4 mb-5">
					<div className="text-center" style={{ width: '90%' }}>
						<h2>Agrega mas imagenes para tu prodcuto</h2>
						<p>Puedes agregar mas imagenes de tu producto para que tus clientes puedan verlas</p>
						<ProductoContext.Provider value={productoID}>
							<RegistrarGaleria />
						</ProductoContext.Provider>
					</div>
				</div>
			)
		}
	];

	return (
		<div>
			<div className="d-flex justify-content-center">
				<div style={{ width: '80%' }}>
					<Steps current={current}>{steps.map((item) => <Step key={item.title} title={item.title} />)}</Steps>
				</div>
			</div>
			<div className="steps-content">{steps[current].content}</div>
			<div className="steps-action d-flex justify-content-center align-items-center">
				{current < steps.length - 1 && (
					<Button type="primary" onClick={next} disabled={disabled}>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button
						type="primary"
						onClick={() => {
							notification.success({
								message: 'su producto ha sido creado!',
								duration: 2
							});
							setTimeout(() => {
								window.location.reload();
							}, 3000);
						}}
					>
						Done
					</Button>
				)}
				{current > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={prev} disabled={disabledPrev}>
						Previous
					</Button>
				)}
			</div>
		</div>
	);
}
export default withRouter(RegistrarProducto);
