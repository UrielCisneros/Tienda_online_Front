import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';

import { List, InputNumber, Button, Avatar, Spin } from 'antd';
import {ShoppingCartOutlined, ExportOutlined, DeleteOutlined} from '@ant-design/icons';

const styles ={fontSize: 25};
const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    
  ];

export default function ShoppingCart() {


    const token = localStorage.getItem('token');
    var decoded = Jwt(token);
    
    function Jwt(token) {
    try {
      return jwt_decode(token);
    } catch (e) {
      return null;
    }
  }


  const [ carrito, setCarrito ] = useState([]);
  const [ loading, setLoading ] = useState(false);

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
                    console.log(res.data);
                    console.log(decoded);
                    setLoading(false);
        })
        .catch((err) => {
                    setCarrito([]);
                    console.log(err.response);
                    console.log("No hay datos");
                    setLoading(false);
      });
  }

  useEffect(() => {
    obtenerDatosCarrito();
    setLoading(true);
  }, []);
   

    return (
      <div className="container" >
        <Spin size="large" spinning={loading}>
        <h1 className="text-center">Tu carrito de compras</h1>

        <div  className="row mx-auto" style={{background: "white"}}>
          <div className="col-lg-12 ">
            
          <h2>Lista o mapeo</h2>


            <div className="d-flex flex-row-reverse mt-22" >
              <div>
                <h2>MilOchoMil</h2>
                <h2>Gratis</h2>
                <h1>$1001</h1>
                <br/><br/>
              </div>
              <div className="px-5 ">
                <h2>Productos () </h2>
                <Link to="/"><h2>Envio a: </h2></Link>
                <h2 className="mt-4">Total: </h2>
              </div>

            </div>

            <div className="d-flex flex-row-reverse pb-3" >
              <Button size="large" type="primary" style={{width: 250, textAlign: "center"}}> 
                <ShoppingCartOutlined style={styles}/> Comprar ahora
              </Button>
            </div>

          </div>

        </div>

        
        </Spin>     
      </div>
    )
}
