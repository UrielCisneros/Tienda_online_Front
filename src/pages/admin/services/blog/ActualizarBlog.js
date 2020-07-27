import React,{ useContext } from 'react'
import { BlogContext } from '../../contexts/BlogContext';

export default function ActualizarBlog() {

     const blogContext = useContext(BlogContext); 
    console.log(blogContext._id);
    return (
        <div>
            <h1>Editar Blog.......</h1>
            <h2>{blogContext.nombre}</h2>
        </div>
    )
}
