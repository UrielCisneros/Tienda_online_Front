import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Select, Steps, notification, Upload, Spin, Divider } from 'antd';
import { UploadOutlined, PlusCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import './registrar_producto.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import RegistrarGaleria from './registrar_galeria';
import RegistrarTalla from './registrar_talla';
import RegistrarNumero from './registrar_numero';
import { Editor } from '@tinymce/tinymce-react';

const { Option } = Select;
const { Step } = Steps;

///Layout para formulario(columnas)
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 }
};

function RegistrarProducto(props) {
	const formRef = useRef(null);
	const [ form ] = Form.useForm();
	const [ disabled, setDisabled ] = props.disabledButtons;
	///Autorizacion a la pagina con Token
	const token = localStorage.getItem('token');
	/// Declaracion de variables para los pasos
	const [ current, setCurrent ] = useState(0);

	const [ editor, setEditor ] = useState();
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledform, setDisabledForm ] = useState(true);
	const [ disabledformProductos, setDisabledFormProductos ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const reload = props.reloadProductos;
	const [ upload, setUpload ] = useState(false);

	const [ item, setItem ] = useState();
	const [ buttonCat, setButtonCat ] = useState(true);
	const [ categoriasBD, setCategoriasBD ] = useState([]);
	const [ categoriasDefault, setCategoriasDefault ] = useState([ 'ropa', 'calzado' ]);
	const [ subcategoriasDefault, setSubcategoriasDefault ] = useState([]);
	const [ subCategoriasBD, setSubCategoriasBD] = useState([]);
	const [ subCategoria, setSubCategoria] = useState([]);

	useEffect(
		() => {
			if (reload) {
				form.resetFields();
				setCurrent(0);
				setDisabledFormProductos(false);
			}
			setCurrent(0);
			setDisabledFormProductos(false);
			obtenerCategorias();
		},
		[ reload, form ]
	);

	

	const next = () => {
		setCurrent(current + 1);
		if (current === 0) {
			obtenerSubcategorias();
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
			setUpload(true);
			return false;
		},
		onRemove: (file) => {
			setUpload(false);
			setFiles([]);
		}
	};

	///capturar datos}
	const [ datos, setDatos ] = useState({
		codigo: '',
		subCategoria: '',
		nombre: '',
		cantidad: '',
		precio: '',
		imagen: ''
	});
	//// Capturar valores de categoria
	const [ select, setSelect ] = useState('');
	const [ tipoCategoria, setTipoCategoria ] = useState('');

	const onSelect = (value) => {
		setSelect(value);
		setValueSelect(value);
		if (value === 'calzado' || value === 'ropa') {
			setTipoCategoria(value);
		} else {
			setTipoCategoria('otros');
		}
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
		formData.append('tipoCategoria', tipoCategoria);
		formData.append('subCategoria', subCategoria);
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

	async function obtenerCategorias() {
		setLoading(true);
		await clienteAxios
			.get('/productos/categorias', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setCategoriasBD(res.data);
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
	async function obtenerSubcategorias(){
		await clienteAxios
				.get(`/productos/Subcategorias/${select}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setSubCategoriasBD(res.data);
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
	}

	const [ valueSelect, setValueSelect ] = useState();
	
	const addItemCategoria = () => {
		setCategoriasDefault([ ...categoriasDefault, item ]);
		setSelect(item);
		setTipoCategoria('otros');
		setDisabled(false);
		setValueSelect(item);
	};
	const addItemSubCategoria = () => {
		setSubcategoriasDefault([ ...subcategoriasDefault, item ]);
	};
	const onSelectSubCategoria = (value) => {
		setSubCategoria(value)
	}
	const onCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value);
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};
	const onSubCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value);
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};

	////CONTENIDO DE LOS PASOS
	const steps = [
		{
			title: 'Categoria',
			content: (
				<div className="d-flex justify-content-center align-items-center mt-4 mb-2">
					<div className="text-center">
						<h2 className="mb-5">Selecciona una categoria para continuar</h2>
						<Select
							value={valueSelect}
							style={{ width: 300 }}
							placeholder="Seleciona una categoria"
							onChange={onSelect}
							dropdownRender={(menu) => (
								<div>
									{menu}
									<Divider style={{ margin: '4px 0' }} />
									<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
										<Input style={{ flex: 'auto' }} onChange={onCategoriaChange} />
										<Button disabled={buttonCat} onClick={addItemCategoria}>
											<PlusOutlined style={{ fontSize: 20 }} /> Nueva
										</Button>
									</div>
								</div>
							)}
						>
							{categoriasDefault.map((item) => <Option key={item}>{item}</Option>)}
							{categoriasBD.length === 0 ? (
								<Option />
							) : (
								categoriasBD.map((item) => {
									if (item._id === 'ropa' || item._id === 'calzado') {
										return null;
									} else {
										return <Option key={item._id}>{item._id}</Option>;
									}
								})
							)}
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
								ref={formRef.current}
							>
								<Form.Item label="Codigo de barras" onChange={datosForm}>
									<Input
										name="codigo"
										disabled={disabledformProductos}
										placeholder="Campo opcional"
									/>
								</Form.Item>
								<Form.Item label="Subcategoria" onChange={datosForm}>
									<Form.Item name="subCategoria">
										<Select
											style={{ width: 300 }}
											placeholder="Seleciona una subcategoria"
											onChange={onSelectSubCategoria}
											dropdownRender={(menu) => (
												<div>
													{menu}
													<Divider style={{ margin: '4px 0' }} />
													<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
														<Input style={{ flex: 'auto' }} onChange={onSubCategoriaChange} />
														<Button disabled={buttonCat} onClick={addItemSubCategoria}>
															<PlusOutlined style={{ fontSize: 20 }} /> Nueva
														</Button>
													</div>
												</div>
											)}
										>
											{subcategoriasDefault.map((item) => <Option key={item}>{item}</Option>)}
											{subCategoriasBD.length === 0 ? (
												<Option />
											) : (
												subCategoriasBD.map((item) => {
													if (item._id === null) {
														return null;
													} else {
														return <Option key={item._id}>{item._id}</Option>;
													}
												})
											)}
										</Select>
									</Form.Item>
								</Form.Item>
								<Form.Item label="Nombre del producto" onChange={datosForm}>
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="nombre"
									>
										<Input name="nombre" disabled={disabledformProductos} />
									</Form.Item>
								</Form.Item>
								{tipoCategoria === 'otros' ? (
									<Form.Item label="Cantidad" onChange={datosForm}>
										<Form.Item
											rules={[ { required: true, message: 'Este campo es requerido' } ]}
											noStyle
											name="cantidad"
										>
											<Input type="number" name="cantidad" disabled={disabledformProductos} />
										</Form.Item>
									</Form.Item>
								) : (
									<div />
								)}
								<Form.Item label="Precio del producto" onChange={datosForm}>
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="precio"
									>
										<Input type="number" disabled={disabledformProductos} name="precio" />
									</Form.Item>
								</Form.Item>
								<Form.Item label="Descripcion del producto">
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="descripcion"
										valuePropName="Editor"
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
								</Form.Item>
								<Form.Item label="Imagen principal">
									<Form.Item
										rules={[ { required: true, message: 'Este campo es requerido' } ]}
										noStyle
										name="imagen"
										valuePropName="filelist"
									>
										<Upload {...propss}>
											<Button disabled={upload}>
												<UploadOutlined /> Subir
											</Button>
										</Upload>
									</Form.Item>
								</Form.Item>
								<Form.Item className="d-flex justify-content-center align-items-center text-center">
									<Button type="primary" htmlType="submit" disabled={disabledformProductos}>
										Registrar
									</Button>
								</Form.Item>
							</Form>
							{select === 'ropa' ? (
								<div className="d-flex justify-content-center">
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarTalla disabledButtons={setDisabled} />
									</ProductoContext.Provider>
								</div>
							) : (
								<div />
							)}
							{select === 'calzado' ? (
								<div>
									<ProductoContext.Provider value={[ productoID, disabledform ]}>
										<RegistrarNumero disabledButtons={setDisabled} />
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
			title: 'Galeria(opcional)',
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
			<div className="steps-content">
				<Spin size="large" spinning={loading}>
					{steps[current].content}
				</Spin>
			</div>
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
							}, 2000);
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
