import React,{useCallback,useEffect} from 'react'
import {Form,Input,Divider,Button} from 'antd'
import {useDropzone} from 'react-dropzone';

export default function ActualizarUsuario(props) {

    const {datosUser,decoded} = props;

    const [ form ] = Form.useForm();

    const mostrarDatosUser = (e) => {
        form.setFieldsValue(e)
    }

    useEffect(() => {
        if(datosUser !== null){
            const direccion =  datosUser.direccion;
            mostrarDatosUser({
                nombre: datosUser.nombre,
                apellido: datosUser.apellido,
                email: datosUser.email,
                imagen: datosUser.imagen,
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
    }, [datosUser])

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

      if(decoded === null){
          return null
      }

    return (
        <div>
            <Form 
                name="nest-messages"
                layout="horizontal"
                size={"large"}
                form={form}
            >
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>

                    <Divider style={{fontSize: 22}}>Información Personal</Divider>
                    
                    <h2>Nombre:</h2>
                    <Form.Item name="nombre">
                        <Input name="nombre" placeholder="Nombre" />
                    </Form.Item>

                    <Form.Item name="apellido" >
                        <h2>Apellidos:</h2>
                        <Input name="apellido"  placeholder="Apellidos" />
                    </Form.Item>

                    <h2>Email:</h2>
                    <Form.Item name="email" >
                        <Input name="email"  placeholder="usuario@usuario.hotmail.com" />
                    </Form.Item>

                    <h2>Telefono</h2>
                    <Form.Item  name="telefono">
                        <Input name="telefono"  placeholder="+52 3171234567" />
                    </Form.Item>
                    <br/>
                    <Divider className="mt-5" style={{fontSize: 22}}>Datos domiciliarios</Divider>
                    <h2>Calle y Numero</h2>
                    <Form.Item name="calle_numero" >
                        <Input name="calle_numero" style={{ width: '80%' }} placeholder="Calle y numero de calle"  />
                    </Form.Item>

                    <h2>Referencia:</h2>
                    <Form.Item name="entre_calles" >
                        <Input name="entre_calles" style={{ width: '50%' }} placeholder="Calles de referencia"  />
                    </Form.Item>
                    <h2>Codigo postal</h2>
                    <Form.Item name="cp" >
                        <Input name="cp"   placeholder="C.P." />
                    </Form.Item>
                    <h2>Colonia</h2>
                    <Form.Item name="colonia" >
                        <Input name="colonia"  placeholder="Colonia" />
                    </Form.Item>
                    <h2>Ciudad: </h2>
                    <Form.Item name="ciudad" >
                        <Input name="ciudad"  placeholder="Localidad" />
                    </Form.Item>
                    <h2>Estado: </h2>
                    <Form.Item name="estado" >
                        <Input name="estado"  placeholder="Estado:" />
                    </Form.Item>
                    <h2>País: </h2>
                    <Form.Item name="pais" >
                        <Input name="pais"  placeholder="País:" />
                    </Form.Item>

                    {decoded.imagenFireBase ? "":(
                        <div>
                            <h2>Contraseña:</h2>
                            <Form.Item >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <h2>Confirmar Contraseña:</h2>
                            <Form.Item >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                        </div>
                    )}
                    <div className="d-flex justify-content-center pb-3">
                        <Button type="primary" size="large" style={{width: 150, fontSize: 20}}>
                            Guardar
                        </Button>
                    </div>
            </Form>
        </div>
    )
}
