import React,{ useContext, useState } from 'react'
import { BlogContext } from '../../contexts/BlogContext';
import Form from 'antd/lib/form/Form';
import { Input, Upload, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UploadOutlined } from '@ant-design/icons';

export default function ActualizarBlog() {

    const blogContext = useContext(BlogContext); 

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

        //Variables donde se guardan la informacion de los input (nombre - administrador)
        const [ datos, setDatos ] = useState({
            nombre: '',
            administrador: '',
            url: ''
        });
        
        //Funcion que captura los datos de los input
        const datosForm = (e) => {
            setDatos({
                ...datos,
                [e.target.name]: e.target.value
            });
        };

            //Variable que guarda el contenido del editor
    const [ editor, setEditor ] = useState();

    const [ upload, setUpload ] = useState(false);
    //Variables que guardan las imagenes
    const [ files, setFiles ] = useState([]);

            //Funcion que captura la imagen seleccionada por el usuario
	const propss = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
                setFiles(file);
                console.log('que hizo ?')
            };
            setUpload(true)
			return false;
        },
        onRemove: (file) => {
            setUpload(false)
            setFiles([]);
        }
    };
    
    return (
        <div>
                <Form 
                name="nest-messages"
                {...layout}
                /* onFinish={EnviarBlog} */
            >
                <Form.Item label="Titulo del blog: "  onChange={datosForm}>
                    <Form.Item rules={[{ required: true, message: 'Titulo obligatorio' }]} noStyle name="nombre" >
                        <Input name="nombre" placeholder="Titulo del Blog" />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Autor: " onChange={datosForm}>
                    <Form.Item rules={[{ required: true, message: 'Autor obligatorio' }]} noStyle name="administrador">
                        <Input name="administrador" placeholder="Nombre del Autor" />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Url (Campo unico) " onChange={datosForm}>
                    <Form.Item rules={[{ required: true, message: 'La url es obligatoria' }]} noStyle name="url">
                        <Input name="url" placeholder="Url del blog" />
                    </Form.Item>
                </Form.Item>

                
                <Form.Item name="descripcion" label="Contenido del blog">
                    <Editor
                        disabled={false}
                        init={{
                            height: 500,
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
                        /* onEditorChange={obtenerEditor} */
                    />
                </Form.Item>
                <Form.Item label="Imagen principal del Blog:">
                    <Upload {...propss} name="imagen">
                        <Button disabled={upload}>
                            <UploadOutlined /> Subir
                        </Button>
                    </Upload>
                </Form.Item>
                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                    <Button type="primary" htmlType="submit">
                        Registrar Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
