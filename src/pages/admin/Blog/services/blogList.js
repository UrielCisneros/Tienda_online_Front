import React from 'react'
import {List,Button,Modal,notification,Avatar } from 'antd';
import { EyeOutlined,EditOutlined,DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import './blogList.scss'


const {confirm} = Modal;

export default function blogList(props) {
    
    const {blogs,setReloadBlog,showDrawer,setAccion,setInfoBlog} = props;
    const token = localStorage.getItem('token');

    const deleteBlog = blog => {
        console.log(blog)
        confirm({
            title:"Eliminando Blog",
            icon: <ExclamationCircleOutlined />,
            content: `Estas seguro que deseas eliminar el blog: ${blog.nombre}`,
            okText: "Eliminar Blog",
            okType:"danger",
            cancelText:"Cancelar",
            onOk(){
                clienteAxios.delete(`/blog/${blog._id}`,{
                    headers: {
                        'Content-Type': 'aplication/json',
                        Authorization: `bearer ${token}`
                    }
                })
                .then((res) => {
                    console.log(res);
                    notification.success({
                        message: 'Blog Eliminado',
                        description:
                        res.data.message,
                    });
                    setReloadBlog(true);
                })
                .catch((err) => {
                    console.log(err)
                    notification.error({
                        message: 'Error del servidor',
                        description:
                        'Paso algo en el servidor, al parecer la conexion esta fallando.',
                    });
                });
            }
        })
    }

    return (
        <div className="blogs-list">
            <List
                itemLayout="horizontal"
                dataSource={blogs.docs}
                renderItem={blog => <Blog blog={blog} deleteBlog={deleteBlog} showDrawer={showDrawer} setAccion={setAccion} setInfoBlog={setInfoBlog} />}
            />
        </div>
    )
}


function Blog(props){
    const {blog,deleteBlog,showDrawer,setAccion,setInfoBlog} = props;

    return(
        <List.Item
            actions={[
                <Link to={`/blog/${blog.url}`} target="_blank">
                    <Button type="dashed">
                        <EyeOutlined /> Ver
                    </Button>
                </Link>,
                <Button type="dashed" onClick={() => {
                    setInfoBlog(blog);
                    setAccion(true);
                    showDrawer();
                }}>
                    <EditOutlined /> Editar
                </Button>,
                <Button type="dashed" danger onClick={() => deleteBlog(blog)}>
                    <DeleteOutlined /> Eliminar
                </Button>,
            ]}
            
        >
            <List.Item.Meta 
            avatar={<Avatar src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${blog.imagen}`} />}
            title={blog.nombre} 
            description={blog.administrador}
            />
        </List.Item>
    )
}
