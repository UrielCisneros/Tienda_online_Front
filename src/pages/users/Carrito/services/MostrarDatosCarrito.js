import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Link} from 'react-router-dom';
import "./carrito.scss";

import { List, InputNumber, notification, Spin } from 'antd';
import {ShoppingCartOutlined, ExportOutlined, DeleteOutlined} from '@ant-design/icons';


const styles ={fontSize: 25};

export default function MostrarDatosProductos () {

  const [ carrito, setCarrito ] = useState([]);
  const [ cliente, setCliente ] = useState([]);
  const [ contador, setContador ] = useState(0);
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
        
        setContador(res.data.articulos.length);
        setCliente(res.data.cliente);
        setCarrito(res.data);
        setLoading(false);
        console.log(res.data.cliente.nombre);
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
      <h1 className="principal bg-dark">Bievenido {cliente.nombre}</h1>
    <div>

    

      <List className="p-3"
            itemLayout="horizontal"
            size="large"
            dataSource={carrito.articulos}
            renderItem={carrit => 
              <Productos carrito={carrit} />
            }
      />

      <div className="d-flex flex-row-reverse mr-2" >
        <div>
          <h2>MilOchoMil</h2>
          <h2>Gratis</h2>
          <h1>$1001</h1>
          <br/><br/>
        </div>
        <div className="px-5 ">
          <h2>Productos ({contador}) </h2>
          <Link to="/"><h2>Envio a: </h2></Link>
          <h2 className="mt-4">Total: </h2>
        </div>
      </div>
    </div> 
    </Spin>
  )
}


  function Productos (props) {
    const {carrito} = props;

    return(

    <List.Item className="carritoList">
      
      <div className="col-lg-3 d-none d-lg-block ">
        <img
          width={180}
          height={160}
          src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${carrito.idarticulo.imagen}`}
        />
      </div>

      <div className="col-lg-6">
        <div className="d-flex justify-content-lg-center" style={{fontSize: 30}} >
          <List.Item.Meta style={{fontSize: 30}}
            avatar={<img src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${carrito.idarticulo.imagen}`} 
              className="d-block d-sm-block d-lg-none"  height="70" width="70"/>}

            title={<p className="carritoList__titulo">{carrito.idarticulo.nombre}</p>}
          />
        </div>

        {/* <div className="d-flex mt-3">
        {carrito.producto.categoria === 'calzado' ? (
            <p>
            
          </p>
          ): carrito.producto.categoria === 'ropa' ? (
          <p>
          
          </p>
          ) : '' }
        </div> */}

        <div className="mt-3 d-flex">
          <p><Link to="/">
            <ShoppingCartOutlined style={styles}/>Comprar ahora </Link> </p>
          <p><Link to="/" className="px-3">
            <DeleteOutlined style={styles}/>Eliminar producto</Link></p>
          <p><Link  to="/" className="px-3">
            <ExportOutlined style={styles}/>Apartar</Link></p>
          </div>
        </div>
      
        <div className="col-lg-2 mt-4 ">
          <InputNumber size="large" min={1} max={100}/>
          <p>Stock disponibles</p>
        </div>

        <div className="col-lg-1 mt-4">
          <h1>{carrito.idarticulo.precio}</h1>
        </div>  
                  
    </List.Item>

    )

  }