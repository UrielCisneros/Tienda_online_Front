import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';

import { List, InputNumber, Button, Avatar } from 'antd';
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

  console.log(decoded);

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
                    // setCarrito(res.data.articulos);
                    console.log(res.data);
                    console.log(decoded);
        })
        .catch((err) => {
                    //  setCarrito([]);
                    console.log(err.response);
                    console.log("No hay datos");
      });
  }

  useEffect(() => {
  //  obtenerDatosCarrito();
  }, []);
   

    return (
      <div className="px-5" >

        <h1 className="text-center">Tu carrito de compras</h1>

        <div  className="row mx-auto" style={{background: "white"}}>
          <div className="col-xl-11 col-lg-11 justify-content-lg-center">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (

                <List.Item>
                  <div className="d-none d-lg-block px-5">
                  {<img src="" width="130" height="150" />}
                  </div>

                  <div>
                    <div className="d-flex justify-content-lg-center">
                      <List.Item.Meta
                        avatar={<img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" 
                        className="d-block d-sm-block d-lg-none"  height="70" width="70"/>}
                        title={item.title}
                      />
                    </div>

                    <div className="d-flex mt-3">
                      <p>Color: </p>
                      <p className="px-3">Talla: </p>
                      <p className="px-3">Talla: </p>
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

              )}
            />

            <div className="d-flex flex-row-reverse mt-4" >
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
      </div>
    )
}
