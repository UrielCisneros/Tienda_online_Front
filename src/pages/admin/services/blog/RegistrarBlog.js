import React,{useState,useEffect,useContext} from 'react'
import {Form,Input,Button,notification,Upload,message} from 'antd'
import {Editor} from '@tinymce/tinymce-react';
import { UploadOutlined } from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';
import { BlogContext } from '../../contexts/BlogContext';

export default function RegistrarBlog(props) {

    const {setReloadBlog,token,setVisible} = props;
    const blog = useContext(BlogContext);
    console.log(blog)

    //Variablo que trae la informacion del post
    const [blogData,setBlogData] = useState({});
    const [imagenUrl,setImagenUrl] = useState(null);

    const [ upload, setUpload ] = useState(false);
    //Variables que guardan las imagenes
    const [ files, setFiles ] = useState([]);

    //Layout para formulario(columnas)
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

    const processPost = async e => {
        if(!blog){
            console.log("Creando Blog")
            if(blogData.descripcion === undefined){
                notification.info({
                    message: 'Ups, algo salio mal',
                    description: 'La descripcion del blog es obligatoria',
                  })
            }else if(files.length === 0){
                notification.info({
                    message: 'Ups, algo salio mal',
                    description: 'La imagen es obligatoria',
                  })
            }else{
                const hide = message.loading('Accion en proceso....', 0);
                setTimeout(hide, 2000);
                const formData = new FormData();
                console.log(blogData.nombre);
                console.log(blogData.administrador);
                console.log(blogData.url);
                console.log(blogData.descripcion);
                console.log(files);
                formData.append('nombre', blogData.nombre);
                formData.append('administrador', blogData.administrador);
                formData.append('url',obtenerUrl(blogData.url));
                formData.append('descripcion', blogData.descripcion);
                formData.append('imagen', files);

                console.log(token);
               
                await clienteAxios.post('/blog/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `bearer ${token}`
                    }
                }).then((res) => {
                    if(!res.data.err){
                        notification.success({
                            message: 'Registro exitoso',
                            description: res.data.message,
                          })
                          setReloadBlog(true);
                          setVisible(false);
                    }else{
                        console.log(res)
                        notification.error({
                            message: 'Error',
                            description: res.data.message,
                          })
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }else{
            console.log("Editando blog")
            console.log(blogData)
        }
    }
    //Funcion que quita los espacios y los remplasa por guiones
    function obtenerUrl(text){
        const urlSinGion = text.replace(" ","-") ;
        return urlSinGion.toLowerCase();
        /* setUrl(urlSinGion); */
    }

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

    //Funcion que escucha la variable que trae la informacion del blog
    useEffect(() => {
        if(blog){
            setBlogData(blog);
            console.log(blogData)
            setImagenUrl(blogData.imagen)
        }else{
            setBlogData({});
        }
    }, [blogData])

    const capturarInfoEditor = (content, editor) => {
        console.log('Content was updated:', content);
        setBlogData({...blogData, descripcion: content})
      }

    return (
        <div className="formulario-blog">
            <Form 
                name="nest-messages"
                {...layout}
                onFinish={processPost}
            >
                <Form.Item label="Titulo del blog: "  onChange={ e => setBlogData({ ...blogData, nombre: e.target.value }) }>
                    <Form.Item rules={[{ required: true, message: 'Titulo obligatorio' }]}  noStyle name="nombre" >
                        <Input value={blogData.nombre} name="nombre" placeholder="Titulo del Blog"  />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Autor: " onChange={ e => setBlogData({ ...blogData, administrador: e.target.value })}>
                    <Form.Item rules={[{ required: true, message: 'Autor obligatorio' }]} noStyle name="administrador">
                        <Input name="administrador" placeholder="Nombre del Autor" />
                    </Form.Item>
                </Form.Item>
                <Form.Item label="Url (Campo unico) " onChange={ e => setBlogData({ ...blogData, url: e.target.value })}>
                    <Form.Item rules={[{ required: true, message: 'La url es obligatoria' }]} noStyle name="url">
                        <Input name="url" placeholder="Url del blog" />
                    </Form.Item>
                </Form.Item>

                
                <Form.Item name="descripcion" label="Contenido del blog">
                    <Editor
                    value={blogData.descripcion ? blogData.descripcion : ""}
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
                        onEditorChange={capturarInfoEditor}
                    />
                </Form.Item>
                <Form.Item label="Imagen principal del Blog:">
                    <Upload {...propss} name="imagen">
                        <Button disabled={upload}>
                            <UploadOutlined /> Subir
                        </Button>
                    </Upload>
                </Form.Item>
                {blog ? (                
                <Form.Item label="Imagen Actual">
                    <img
                        className="d-block img-fluid mt-2"
                        width="200"
                        alt="imagen de base"
                        src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagenUrl}`}
                    />
                </Form.Item>): ""}

                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                    <Button type="primary" htmlType="submit">
                       {blog ? "Actualizar Blog" : "Registrar Blog"} 
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
