import React,{useState,useEffect} from 'react'
import clienteAxios from '../../../../config/axios';
import {Spin,notification} from 'antd';
import queryString from 'query-string';
import Pagination from '../../../../components/Pagination/pagination';


import {List} from 'antd'
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify'
import './BlogList.scss';


export default function BlogList(props) {

    const {location,history} = props;
    const {page = 1} = queryString.parse(location.search);
    
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState([])


    function getBlogsApi(limit,page){
        setLoading(true);
        clienteAxios.get(`/blog?limit=${limit}&page=${page}`)
        .then((res) => {
            console.log(res)
                setBlogs(res.data.posts);
                setLoading(false);
        })
        .catch((err) => {
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
            console.log(err);
        });
    }

    useEffect(() => {
        setLoading(true);
        getBlogsApi(10,page)
    }, [page])


    return (
        <Spin size="large" spinning={loading} >
            <div  id="blog" className="container">
                <h1 className="text-center">Bienvenidos a nuestro Blog!</h1>
                <div className="container-fluid">
                    <div id="cards">
                        <BlogsList2 
                            blogs={blogs} 
                            setLoading={setLoading}
                        />
                    </div>

                    <Pagination 
                        blogs={blogs} 
                        location={location}  
                        history={history}
                    />
                </div>
            </div>
        </Spin>
    )

}

function BlogsList2 (props){
    const {blogs} = props;


    return (
        <div>
            <List className="p-3"
                    itemLayout="vertical"
                    size="large"
                    dataSource={blogs.docs}
                    renderItem={blog => 
                        <Blog blog={blog} />
                    }
                />
        </div>
    )
}

function Blog(props){

    const {blog} = props;

    return(
        <Link to={`/blog/${blog.url}`} className="blogList">
            <List.Item 
                className="blogList__lista m-3"
                key={blog.nombre}
                extra={
                <img
                    width={272}
                    alt={blog.nombre}
                    src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${blog.imagen}`}
                />
                }
            >
                <List.Item.Meta title={<p className="blogList__title">{blog.nombre}</p>} description={<p className="blogList__author">Autor: {blog.administrador}</p>}/>
                    {
                        <div>
                            <div
                                className={'blogList__content-description m-0'}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.descripcion) }}
                            />
                            <p>Leer mas</p>
                        </div>

                    }
            </List.Item>
        </Link>
    )
}

