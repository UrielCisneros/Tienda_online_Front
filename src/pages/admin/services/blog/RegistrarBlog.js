import React,{useState,useEffect} from 'react'
import {Row,Col,Form,Input,Button,DatePicker,notification,Upload} from 'antd'
import moment from 'moment';
import {Editor} from '@tinymce/tinymce-react';
import { UploadOutlined } from '@ant-design/icons';


export default function RegistrarBlog(props) {
    const {setReloadBlog} = props;

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


    return (
        <div className="formulario-blog">
        <Form name="nest-messages" onFinish={''} form={''}>
            <Form.Item name="nombre" label="Titulo del Blog" onChange={''}>
                <Input name="nombre" placeholder="Titulo del Blog" />
            </Form.Item>
            <Form.Item name="administrador" label="Nombre del autor" onChange={''}>
                <Input name="administrador" placeholder="Nombre del Autor" />
            </Form.Item>
            <Form.Item name="descripcion" label="Descripcion del blog">
                <Editor
                    init={{
                        height: 300,
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
                    onEditorChange={''}
                />
            </Form.Item>

            <Form.Item label="Imagen principal">
                <Upload {...propss} name="imagen">
                    <Button>
                        <UploadOutlined /> Subir
                    </Button>
                </Upload>
            </Form.Item>
            <Form.Item label="Imagen Actual">

            </Form.Item>
            <Form.Item className="d-flex justify-content-center align-items-center text-center">
                <Button type="primary" htmlType="submit">
                    Actualizar
                </Button>
            </Form.Item>
        </Form>
        </div>
    )
}
