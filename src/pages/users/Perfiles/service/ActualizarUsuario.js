import React,{useCallback,useEffect,useState} from 'react'
import {Form,Input,Divider,Button,Avatar,notification,Upload} from 'antd'
import {useDropzone} from 'react-dropzone';
import clienteAxios from '../../../../config/axios';
import {UploadOutlined } from '@ant-design/icons';

import './ActualizarUsuario.scss';

export default function ActualizarUsuario(props) {

    const {datosUser,decoded,token,setLoading,setAccion} = props;

    const [avatar, setAvatar] = useState(null);
    const [enviarFile, setEnviarFile] = useState([]);
    const [datosFormulario, setdatosFormulario] = useState({});

    const [ form ] = Form.useForm();

    const mostrarDatosUser = (e) => {
        form.setFieldsValue(e)
    }


    useEffect(() => {
        if(datosUser !== null){
            if(decoded.imagen){
                setAvatar({preview:`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${decoded.imagen}`})
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datosUser])

    useEffect(() => {
        console.log(datosUser);
        if(datosUser !== null){
            let direccion = {};
            if(datosUser.direccion.length > 0){
                direccion =  datosUser.direccion[0];
            }
            
            mostrarDatosUser({
                nombre: datosUser.nombre,
                apellido: datosUser.apellido,
                email: datosUser.email,
                telefono: datosUser.telefono,
                calle_numero: direccion.calle_numero,
                entre_calles: direccion.entre_calles,
                cp: direccion.cp,
                colonia: direccion.colonia,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                pais: direccion.pais, 
            })
            setdatosFormulario({
                nombre: datosUser.nombre,
                apellido: datosUser.apellido,
                email: datosUser.email,
                telefono: datosUser.telefono,
                calle_numero: direccion.calle_numero,
                entre_calles: direccion.entre_calles,
                cp: direccion.cp,
                colonia: direccion.colonia,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                pais: direccion.pais, 
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datosUser])

    const propss = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
                setEnviarFile(file);
            };
			return false;
        }
    };

    async function enviarDatosUser(){
        setAccion(true);
        const formData = new FormData();
        formData.append('nombre', datosFormulario.nombre);
        formData.append('apellido', datosFormulario.apellido);
        formData.append('email', datosFormulario.email);
        formData.append('telefono', datosFormulario.telefono);
        formData.append('calle_numero', datosFormulario.calle_numero);
        formData.append('entre_calles', datosFormulario.entre_calles);
        formData.append('cp', datosFormulario.cp);
        formData.append('colonia', datosFormulario.colonia);
        formData.append('ciudad', datosFormulario.ciudad);
        formData.append('estado', datosFormulario.estado);
        formData.append('pais', datosFormulario.pais);
        formData.append('imagen', enviarFile);
        if(enviarFile.length !== 0){
            console.log(enviarFile);
            
        }

        await clienteAxios.put(`/cliente/${decoded._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                 Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            // localStorage.removeItem('token');
            // localStorage.setItem('token', res.data.token);
            // window.location.reload();
            setLoading(false)
            console.log(res);
            notification.success({
                message: 'Hecho!',
                description: res.data.message,
                duration: 2
            });
        })
        .catch((res) => {
            console.log(res.response);
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

      if(decoded === null){
          return null
      }

      const datosForm = (e) => {
		setdatosFormulario({
			...datosFormulario,
			[e.target.name]: e.target.value
		});
	};

    return (
        <div>
            <Form 
                layout="horizontal"
                size={"large"}
                form={form}
                onFinish={enviarDatosUser}
            >
                        <Form.Item label="Logo" >
                            <Upload {...propss} name="imagen">
                                <Button >
                                    <UploadOutlined /> Subir
                                </Button>
                            </Upload>
                        </Form.Item>  
                {decoded.tipoSesion !== "APIRestAB" ? (
                    <div>
                        <div className="upload-user-perfil">
                        <img
                            className=""
                            alt="logotipo-tienda"
                            src={decoded.imagenFireBase}
                        />
                        </div>
                    </div>
                ) : 
                (
                   "" // <UploadAvatar avatar={avatar} setAvatar={setAvatar} nombre={decoded.nombre} setEnviarFile={setEnviarFile} />
                ) }
                    

                    <Divider style={{fontSize: 22}}>Información Personal</Divider>
                    
                    <h2>Nombre:</h2>
                    <Form.Item name="nombre" onChange={datosForm} >
                        <Input name="nombre" a placeholder="Nombre"  />
                    </Form.Item>
                    <h2>Apellidos:</h2>
                    <Form.Item name="apellido" onChange={datosForm} >
                        <Input name="apellido"  placeholder="Apellidos" />
                    </Form.Item>

                    <h2>Email:</h2>
                    <Form.Item name="email" onChange={datosForm} >
                        <Input name="email"  placeholder="usuario@usuario.hotmail.com" />
                    </Form.Item>

                    <h2>Telefono:</h2>
                    <Form.Item  name="telefono" onChange={datosForm} >
                        <Input name="telefono"  placeholder="+52 3171234567" />
                    </Form.Item>
                    <br/>
                    <Divider className="mt-5" style={{fontSize: 22}}>Datos domiciliarios</Divider>
                    
                    <h2>Direccion:</h2>
                    <Form.Item name="calle_numero" onChange={datosForm} >
                        <Input name="calle_numero" placeholder="Calle y numero de calle"  />
                    </Form.Item>

                    <h2>Referencia:</h2>
                    <Form.Item name="entre_calles" onChange={datosForm} >
                        <Input name="entre_calles" placeholder="Calles de referencia"  />
                    </Form.Item>
                    <h2>Codigo postal:</h2>
                    <Form.Item name="cp" onChange={datosForm} >
                        <Input name="cp"   placeholder="Codigo Postal" />
                    </Form.Item>
                    <h2>Colonia:</h2>
                    <Form.Item name="colonia" onChange={datosForm} >
                        <Input name="colonia"  placeholder="Colonia" />
                    </Form.Item>
                    <h2>Ciudad: </h2>
                    <Form.Item name="ciudad" onChange={datosForm} >
                        <Input name="ciudad"  placeholder="Localidad" />
                    </Form.Item>
                    <h2>Estado:</h2>
                    <Form.Item name="estado"  onChange={datosForm} >
                        <Input name="estado" placeholder="Estado:" />
                    </Form.Item>
                    <h2>País:</h2>
                    <Form.Item name="pais" onChange={datosForm} >
                        <Input name="pais" placeholder="País:" />
                    </Form.Item>

                    {decoded.tipoSesion === 'FireBase' ? "":(
                        <div>
                            <h2>Contraseña:</h2>
                            <Form.Item onChange={datosForm} >
                                <Input.Password  placeholder="Password" />
                            </Form.Item>
                            <h2>Confirmar Contraseña:</h2>
                            <Form.Item onChange={datosForm} >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                        </div>
                    )}
                    <div className="d-flex justify-content-center pb-3">
                        <Button htmlType="submit" type="primary" size="large" style={{width: 150, fontSize: 20}}>
                            Guardar
                        </Button>
                    </div>
            </Form>
        </div>
    )
}

function UploadAvatar(props){
    const {avatar,setAvatar,nombre,setEnviarFile} = props; 

    

    const onDrop = useCallback(
        acceptedFiles => {
            const file = acceptedFiles[0];
            setAvatar({file,preview: URL.createObjectURL(file)})
            setEnviarFile(file)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [setAvatar])

      const {getRootProps, getInputProps, isDragActive} = useDropzone({
          accept: "image/jpg, image/png, image/jpeg",
          noKeyboard: true,
          onDrop
      })


      return(
          <div>
              <Divider className="" style={{fontSize: 22}}>Imagen de perfil</Divider>
              <div className="upload-user-perfil" {...getRootProps()}>
                <input {...getInputProps()} />
                    {isDragActive ? (
                            <Avatar size={200} style={{ backgroundColor: '#87d068' }}>
                                <p className="" style={{fontSize: 150}}>{nombre.charAt(0)}</p>
                            </Avatar>
                        ) : avatar ? (
                            <Avatar size={200} src={avatar.preview} style={{ backgroundColor: '#87d068' }}>
                                <p style={{fontSize: 150}}>{nombre.charAt(0)}</p>
                            </Avatar>
                        ) : (
                            <Avatar size={200} style={{ backgroundColor: '#87d068' }}>
                                <p style={{fontSize: 150}}>{nombre.charAt(0)}</p>
                            </Avatar>
                        )}

                </div>
          </div>

      )
}
