import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Link} from 'react-router-dom';

import { List, InputNumber, notification, Spin } from 'antd';
import {ShoppingCartOutlined, ExportOutlined, DeleteOutlined} from '@ant-design/icons';


const styles ={fontSize: 25};

export default function MostrarDatosProductos () {

  const [ carrito, setCarrito ] = useState([]);
  const [ loading, setLoading ] = useState(false);

    //toma del token para el usuario
  const token = localStorage.getItem('token');
  var decoded = Jwt(token);
  
  function Jwt(token) {
  try {
    return jwt_decode(token);
  } catch (e) {
    return null;
  }
}


async function obtenerDatosCarrito(){
    setLoading(true);
      await clienteAxios
        .get(`/carrito/${decoded._id}`,{
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `bearer ${token}`
          }
      })

        .then((res) => {
          if(decoded._id===null){
              console.log("no hay codigo");
          }
            setCarrito(res.data.articulos);
            setLoading(false);
            //  if (setCarrito() === undefined) {
              //  console.log("No hay productos");
              //}

           // console.log(decoded);
            console.log(res.data.articulos);
        })

        .catch((err) => {
          console.log(err);
          console.log(err.response);
      });
  }



    useEffect(() => {
      obtenerDatosCarrito();
      setLoading(true);
    }, []);
 
    return(
      <Spin  size="large" spinning={loading} >
        <div>
        <List className="p-3"
                itemLayout="horizontal"
                size="large"
                dataSource={carrito.articulos}
                renderItem={carrit => 
                    <Productos carrito={carrit} />
                }
            />
        </div>
      </Spin>
)
}

// function carritoList (props) {
//   const {carrito} = props;

//   return (
//     <div>
//         <List className="p-3"
//                 itemLayout="horizontal"
//                 size="large"
//                 dataSource={carrito}
//                 renderItem={carrito => 
//                     <Productos carrito={carrito} />
//                 }
//             />
//     </div>
// )
// }

function Productos (props) {
  const {carrito} = props;

  return(

  <List.Item>
    <div className="d-none d-lg-block px-2">
      <img
        width={272}
        src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${carrito.idarticulo[0].imagen}`}
      />
    </div>

    <div>
      <div className="d-flex justify-content-lg-center">
        <List.Item.Meta
          avatar={<img src={carrito.idarticulo[0].imagen} 
          className="d-block d-sm-block d-lg-none"  height="70" width="70"/>}
          title={carrito.idarticulo[0].nombre}
        />
      </div>

      <div className="d-flex mt-3">
      {carrito.producto.categoria === 'calzado' ? (
          <p>
          
        </p>
        ): carrito.producto.categoria === 'ropa' ? (
        <p>
        
        </p>
        ) : '' }
      </div>

      <div className="mt-3 d-flex">
        <p><Link to="/">
          <ShoppingCartOutlined style={styles}/>Comprar ahora </Link> </p>
        <p><Link to="/" className="px-3">
          <DeleteOutlined style={styles}/>Eliminar producto</Link></p>
        <p><Link  to="/" className="px-3">
          <ExportOutlined style={styles}/>Apartar</Link></p>
        </div>
      </div>
    
      <div className="mt-4 align-items-center px-5">
        <InputNumber size="large" min={1} max={100}/>
        <p>Stock disponibles</p>
      </div>

      <div className="mt-4 ">
        <h1>$10000</h1>
      </div>  
                
  </List.Item>

  )
}