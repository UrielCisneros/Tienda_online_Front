import React,{useState,useEffect} from 'react'
import {Form, Col, Row, Input,Divider, Button,Alert,Upload,notification} from 'antd';
import {PlusCircleOutlined,EditOutlined,UploadOutlined } from '@ant-design/icons';
import {Editor} from '@tinymce/tinymce-react';
import clienteAxios from '../../../../../config/axios';


export default function RegistroTienda(props) {

    const {datosNegocio,token,setLoading,setReloadInfo} = props;

    const [datos, setDatos] = useState({})
    const [control, setControl] = useState(false)
    const [ form ] = Form.useForm();

    const [ upload, setUpload ] = useState(false);
    //Variables que guardan las imagenes
    const [ files, setFiles ] = useState([]);
    const [imagen, setImagen] = useState("");

    const monstrarInformacionBlog = (e) => {
        form.setFieldsValue(e);
     }

    useEffect(() => {
        if(datosNegocio !== undefined){
            setImagen(datosNegocio.imagenLogo)
            if(datosNegocio.ubicacion[0].lat === "undefined"){
                datosNegocio.ubicacion[0].lat = "";
            }
            if(datosNegocio.ubicacion[0].lng === "undefined"){
                datosNegocio.ubicacion[0].lng = "";
            }
            if(datosNegocio.linkFace === "undefined"){
                datosNegocio.linkFace = "";
            }
            if(datosNegocio.linkInsta === "undefined"){
                datosNegocio.linkInsta = "";
            }
            if(datosNegocio.linkTweeter === "undefined"){
                datosNegocio.linkTweeter = "";
            }
            monstrarInformacionBlog({
                nombre:datosNegocio.nombre,
                telefono: datosNegocio.telefono,
                calle_numero: datosNegocio.direccion[0].calle_numero,
                cp:datosNegocio.direccion[0].cp,
                colonia:datosNegocio.direccion[0].colonia,
                ciudad: datosNegocio.direccion[0].ciudad,
                lat: datosNegocio.ubicacion[0].lat,
                lng: datosNegocio.ubicacion[0].lng,
                politicas: datosNegocio.politicas,
                imagenCorp: datosNegocio.imagenCorp,
                linkFace: datosNegocio.linkFace,
                linkInsta: datosNegocio.linkInsta,
                linkTweeter: datosNegocio.linkTweeter
            })
            setDatos({
                nombre:datosNegocio.nombre,
                telefono: datosNegocio.telefono,
                calle_numero: datosNegocio.direccion[0].calle_numero,
                cp:datosNegocio.direccion[0].cp,
                colonia:datosNegocio.direccion[0].colonia,
                ciudad: datosNegocio.direccion[0].ciudad,
                lat: datosNegocio.ubicacion[0].lat,
                lng: datosNegocio.ubicacion[0].lng,
                politicas: datosNegocio.politicas,
                imagenCorp: datosNegocio.imagenCorp,
                linkFace: datosNegocio.linkFace,
                linkInsta: datosNegocio.linkInsta,
                linkTweeter: datosNegocio.linkTweeter
            });
            setControl(true);
        }else{
            setDatos({});
            setControl(false);
        }
    }, [datosNegocio])

    const capturarPoliticasEditor = (content, editor) => {
        setDatos({...datos, politicas: content})
      }

      const capturarImagenCorpEditor = (content, editor) => {
        setDatos({...datos, imagenCorp: content})
      }

      const propss = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
                setFiles(file);
            };
            setUpload(true)
			return false;
        },
        onRemove: (file) => {
            setUpload(false)
            setFiles([]);
        }
    };

    const SendForm = async () => {
            
            const formData = new FormData();
            formData.append('nombre', datos.nombre);
            formData.append('telefono', datos.telefono);
            formData.append('calle_numero', datos.calle_numero);
            formData.append('cp', datos.cp);
            formData.append('colonia', datos.colonia);
            formData.append('ciudad', datos.ciudad);
            formData.append('lat',datos.lat);
            formData.append('lng',datos.lng);
            formData.append('politicas', datos.politicas);
            formData.append('imagenCorp', datos.imagenCorp);
            formData.append('linkFace', datos.linkFace);
            formData.append('linkInsta', datos.linkInsta);
            formData.append('linkTweeter', datos.linkTweeter);

            if(control === false){
                if(files.length === 0){
                    notification.info({
                        message: 'Ups, algo salio mal',
                        description: 'La imagen es obligatoria',
                      })
                }else{
                    setLoading(true)
                    formData.append('imagen', files);
                    await clienteAxios.post('/tienda/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `bearer ${token}`
                        }
                    }).then((res) => {
                        setLoading(false)
                        setReloadInfo(true)
                        console.log(res);
                            notification.success({
                                message: 'Registro exitoso',
                                description: res.data.message,
                                })
    
                    })
                    .catch((err) => {  
                        setLoading(false) 
                        console.log(err.response);                 
                        if(err.response.status === 500 || err.response.status === 404){
                            notification.error({
                                message: 'Error de conexion',
                                description: err.response.data.message,
                                })
                        }else{
                            notification.error({
                                message: 'Error de conexion',
                                description: "Parece que algo salio mal, favor de intentarlo de nuevo",
                                })
                        }
                    });   
                }
            }else{
                setLoading(true)
                if(files.length !== 0){
                    console.log(files);
                    formData.append('imagen', files);
                }
                await clienteAxios.put(`/tienda/${datosNegocio._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `bearer ${token}`
                    }
                }).then((res) => {
                    setLoading(false) 
                    setReloadInfo(true)
                    console.log(res);
                        notification.success({
                            message: 'Registro exitoso',
                            description: res.data.message,
                          })

                })
                .catch((err) => {   
                    setLoading(false) 
                    console.log(err.response);                 
                    if(err.response.status === 500 || err.response.status === 404){
                        notification.error({
                            message: 'Error de conexion',
                            description: err.response.data.message,
                          })
                    }else{
                        notification.error({
                            message: 'Error de conexion',
                            description: "Parece que algo salio mal, favor de intentarlo de nuevo",
                          })
                    }
                });   
            }



        
    }

    

    return (
        <div>
            <Form
                onFinish={SendForm}
                form={form}
            >
                <div>
                <Divider>Logo del negocio</Divider>
                    <div className="m-auto">
                        <Form.Item label="Logo" >
                            <Upload {...propss} name="imagen">
                                <Button disabled={upload}>
                                    <UploadOutlined /> Subir
                                </Button>
                            </Upload>
                        </Form.Item>  
                        {control === false ? "" : (
                            <Form.Item label="Imagen Actual">
                                <img
                                    className="d-block img-fluid mt-2"
                                    width="200"
                                    alt="imagen de base"
                                    src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagen}`}
                                />
                            </Form.Item>
                        )}
                    </div>
                <Divider>Informacion de la tienda</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Nombre"  onChange={ e => setDatos({ ...datos, nombre: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Nombre obligatorio' }]}  noStyle name="nombre" >
                                    <Input name="nombre" placeholder="Nombre del negocio"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Telefono "  onChange={ e => setDatos({ ...datos, telefono: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Telefono obligatorio' }]}  noStyle name="telefono" >
                                    <Input name="telefono" placeholder="Telefono"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Calle"  onChange={ e => setDatos({ ...datos, calle_numero: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Direccion obligatoria' }]}  noStyle name="calle_numero" >
                                    <Input name="calle_numero" placeholder="Calle y Numero" />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Codigo Postal "  onChange={ e => setDatos({ ...datos, cp: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Codigo Postal obligatorio' }]}  noStyle name="cp" >
                                    <Input name="cp" placeholder="Codigo Postal"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Colonia "  onChange={ e => setDatos({ ...datos, colonia: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Colonia obligatoria' }]}  noStyle name="colonia" >
                                    <Input name="colonia" placeholder="Colonia"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Ciudad"  onChange={ e => setDatos({ ...datos, ciudad: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Direccion obligatoria' }]}  noStyle name="ciudad" >
                                    <Input name="ciudad" placeholder="Calle y Numero"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Ubicacion</Divider>
                    <div className="w-100" style={{margin: "auto"}} >
                        {control === false ? (                 
                             <Alert
                                description={<p className="h6 text-center">Estos datos no son obigatorios, pero tu tienda sera encontrada mas facil si incorporas estos datos</p>}
                                type="info"
                            />
                            )
                        : "" }

                    </div>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Latitud "  onChange={ e => setDatos({ ...datos, lat: e.target.value }) }>
                                <Form.Item noStyle name="lat" >
                                    <Input name="lat" placeholder="Latitud"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Longitud"  onChange={ e => setDatos({ ...datos, lng: e.target.value }) }>
                                <Form.Item noStyle name="lng" >
                                    <Input name="lng" placeholder="Latitud"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Redes sociales</Divider>
                    <Row>
                        <Col span={8}>
                            <Form.Item className="m-2" label="Facebook "  onChange={ e => setDatos({ ...datos, linkFace: e.target.value }) }>
                                <Form.Item noStyle name="linkFace" >
                                    <Input name="linkFace" placeholder="Link de pagina de facebook" />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item className="m-2" label="Instagram"  onChange={ e => setDatos({ ...datos, linkInsta: e.target.value }) }>
                                <Form.Item noStyle name="linkInsta" >
                                    <Input name="linkInsta" placeholder="Link de perfil de Instagram"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item className="m-2" label="Tweeter"  onChange={ e => setDatos({ ...datos, linkTweeter: e.target.value }) }>
                                <Form.Item noStyle name="linkTweeter" >
                                    <Input name="linkTweeter" placeholder="Link de perfil en tweeter" />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Informacion de Politicas de la empresa</Divider>
                    <Row>
                        <Col span={24}>
                            <Form.Item className="m-2" >
                                <Form.Item rules={[{ required: true, message: 'Politicas de privacidad obligatorias' }]}  noStyle name="politicas" >
                                    <Editor
                                        disabled={false}
                                        init={{
                                            height: 450,
                                            menubar: true,
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
                                        onEditorChange={capturarPoliticasEditor}
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Imagen corporativa</Divider>
                    <Row>
                        <Col span={24}>
                            <Form.Item className="m-2" >
                                <Form.Item rules={[{ required: true, message: 'Imagen corporativa es obligatoria' }]}  noStyle name="imagenCorp" >
                                    <Editor
                                        disabled={false}
                                        init={{
                                            height: 450,
                                            menubar: true,
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
                                        onEditorChange={capturarImagenCorpEditor}
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                    <Button className="text-center" size="large" type="primary" htmlType="submit" icon={control === false ? (<PlusCircleOutlined style={{ fontSize: 24 }} />):(<EditOutlined style={{ fontSize: 24 }} />)}>
                        {control === false ? "Registrar" : "Editar"}
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}
