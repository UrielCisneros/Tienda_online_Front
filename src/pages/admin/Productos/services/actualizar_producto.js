import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Tabs, Form, Input, Upload, Button, notification, Select, Spin, Divider } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { IdProductoContext } from '../../contexts/ProductoContext';
import ActualizarGaleria from './actualizar_galeria';
import ActualizarTalla from './actualizar_talla';
import ActualizarNumero from './actualizar_numero';
import { Editor } from '@tinymce/tinymce-react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

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

	const [ item, setItem ] = useState();
	const [ buttonCat, setButtonCat ] = useState(true);
	const [ subcategoriasDefault, setSubcategoriasDefault ] = useState([]);
	const [ subCategoriasBD, setSubCategoriasBD ] = useState([]);
	const [ subCategoria, setSubCategoria ] = useState([]);
	const [ genero, setGenero ] = useState('');
	const [ valueSelect, setValueSelect ] = useState();

	const [ productos, setProductos ] = useState([
		{
			codigo: '',
			nombre: '',
			precio: '',
			cantidad: '',
			imagen: ''
		}
	]);
	const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
	const [ color, setColor ] = useState('FFFFFF');
	const styles = reactCSS({
		default: {
			color: {
				width: '36px',
				height: '14px',
				borderRadius: '2px',
				background: color
				/* background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` */
			},
			swatch: {
				padding: '5px',
				background: '#fff',
				borderRadius: '1px',
				boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
				display: 'inline-block',
				cursor: 'pointer'
			},
			popover: {
				position: 'absolute',
				zIndex: '2'
			},
			cover: {
				position: 'fixed',
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px'
			}
		}
	});

	const handleClick = () => {
		setDisplayColorPicker(true);
	};

	const handleClose = () => {
		setDisplayColorPicker(false);
	};

	const handleChange = (color) => {
		setColor(color.hex);
	};

	const resetColor = () => {
		setColor('');
		form.setFieldsValue({color: ''})
		productos.color = '';
	};

	useEffect(
		() => {
			if (reload) {
				/* obtenerDatos(); */
				form.resetFields();
				setFiles([]);
				setUpload(false);
				setColor('');
			}
			obtenerDatos();
			obtenerSubcategorias();
		},
		[ productoID, reload, form, select ]
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
					categoria: res.data.subCategoria,
					genero: res.data.genero,
					precio: res.data.precio,
					color: res.data.color,
					cantidad: res.data.cantidad,
					descripcion: res.data.descripcion
				});
				setSelect(res.data.categoria);
				setEditor(res.data.descripcion);
				setFiles(res.data.imagen);
				setProductos(res.data);
				setColor(res.data.colorHex);
				setGenero(res.data.genero);
				setSubCategoria(res.data.subCategoria);
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

	const generoOnChange = (value) => {
		setGenero(value);
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

	const addItemSubCategoria = () => {
		setSubcategoriasDefault([ ...subcategoriasDefault, item ]);
		setSubCategoria(item);
		setValueSelect(item);
	};
	const onSelectSubCategoria = (value) => {
		setSubCategoria(value);
	};
	const onSubCategoriaChange = (e) => {
		if (e.target.value.length !== 0) {
			setItem(e.target.value);
			setSubCategoria(e.target.value);
			setButtonCat(false);
		} else {
			setButtonCat(true);
		}
	};

	async function obtenerSubcategorias() {
		if (!select) {
			return null;
		}
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
console.log(productos.color)
	const subirDatos = async () => {
		const formData = new FormData();
		if (productos.tipoCategoria === 'otros') {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', productos.categoria);
			formData.append('subCategoria', subCategoria);
			formData.append('genero', genero);
			formData.append('color', productos.color);
			formData.append('colorHex', color);
			formData.append('cantidad', productos.cantidad);
			formData.append('precio', productos.precio);
			formData.append('descripcion', editor);
			formData.append('imagen', files);
		} else {
			formData.append('codigo', productos.codigo);
			formData.append('nombre', productos.nombre);
			formData.append('categoria', productos.categoria);
			formData.append('subCategoria', subCategoria);
			formData.append('genero', genero);
			formData.append('color', productos.color);
			formData.append('colorHex', color);
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
						<Form.Item name="codigo" label="Código de barras" onChange={obtenerValores}>
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
						<Form.Item label="Subcategoria" name="categoria" onChange={obtenerValores}>
							<Form.Item name="categoria">
								<Select
									style={{ width: 300 }}
									placeholder="Seleciona una subcategoria"
									value={valueSelect}
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
						<Form.Item label="Género" onChange={obtenerValores}>
							<Form.Item name="genero">
								<Select
									name="genero"
									placeholder="Selecciona género"
									style={{ width: 250 }}
									onChange={generoOnChange}
								>
									<Option value="niño">Niño</Option>
									<Option value="niña">Niña</Option>
									<Option value="hombre">Hombre</Option>
									<Option value="mujer">Mujer</Option>
									<Option value="mixto">Mixto</Option>
								</Select>
							</Form.Item>
						</Form.Item>
						<Form.Item label="Color del producto" onChange={obtenerValores}>
							<Input.Group compact>
								<Form.Item name="colorHex">
									<div className="d-flex align-items-center">
										<div className="d-inline">
											<div style={styles.swatch} onClick={handleClick}>
												<div style={styles.color} />
											</div>
											{displayColorPicker ? (
												<div style={styles.popover}>
													<div style={styles.cover} onClick={handleClose} />
													<SketchPicker color={color} onChange={handleChange} />
												</div>
											) : null}
										</div>
									</div>
								</Form.Item>
								<Form.Item wrapperCol={{ span: 22, offset: 0 }} name="color">
									<Input
										className="d-inline ml-2"
										type="text"
										name="color"
										placeholder="Escribe el color, por ejemplo: Verde"
									/>
								</Form.Item>
								<Form.Item>
									<Button className="d-inline ml-2" size="middle" type="text" onClick={resetColor}>
										Quitar color
									</Button>
								</Form.Item>
							</Input.Group>
						</Form.Item>
						{productos.tipoCategoria === 'otros' ? (
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
						<Form.Item label="Descripción del producto" name="descripcion">
							<Form.Item
								rules={[ { required: true, message: 'Este campo es requerido' } ]}
								noStyle
								name="descripcion"
								valuePropName="Editor"
							>
								<Editor
									value={editor}
									name="descripcion"
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
								Guardar
							</Button>
						</Form.Item>
					</Form>
				</Spin>
			</TabPane>
			<TabPane tab="Actualizar galería de imágenes" key="2">
				<ActualizarGaleria />
			</TabPane>
		</Tabs>
	);
}
export default ActualizarProducto;
