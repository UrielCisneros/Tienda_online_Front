import React from 'react'
import {List} from 'antd'
import { Link } from 'react-router-dom';
import  ReadMoreReact from 'read-more-react';

export default function BlogList(props) {

    const {blogs} = props;

    const Descrip = ({texto}) => (
        <Link>
            <ReadMoreReact 
                text = { <div className="content" dangerouslySetInnerHTML={{__html: texto }}></div>}
                min = { 120 }
                ideal = { 150 }
                max = { 1000 }
                readMoreText ="Ver mas..." 
            />
        </Link>
        );
    


    return (
        <div>
            <List className="p-3"
                    itemLayout="vertical"
                    size="large"
                    dataSource={blogs.docs}
                    renderItem={blog => 
                        <Blog blog={blog} Descrip={Descrip} />
                    }
                />
        </div>
    )
}

function Blog(props){

    const {blog,Descrip} = props;

    return(
        <Link to="">
            <List.Item 
                key={blog.nombre}
                extra={
                <img
                    width={272}
                    alt={blog.nombre}
                    src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${blog.imagen}`}
                />
                }
            >
                <List.Item.Meta
                title={blog.nombre}
                description={blog.administrador}
                />
                {<Descrip texto={blog.descripcion}/>}
            </List.Item>
        </Link>
    )
}
