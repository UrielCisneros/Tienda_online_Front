import React, { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import { List, InputNumber } from 'antd';



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
          .get(`/carrito/${decoded._id}`)
          .then((res) => {
                      // setCarrito(res.data.articulos);
                      console.log(res);
                      console.log(decoded);
          })
          .catch((res) => {
                      // setCarrito([]);
                      console.log("No hay datos");
        });
    }

    useEffect(() => {
      obtenerDatosCarrito();
    }, []);
    
   

    return (
        <div className="container-fluid px-5">
        {/* <h1 className="text-center">Tu carrito de compras</h1>
        <div className="col-lg-12 d-flex justify-content-lg-center">
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
            <List.Item>
                 <div className="d-none d-lg-block px-5">
                   {<img src="" width="130" height="150" />}
                 </div>
                
                <div>
                    <List.Item.Meta
                    title={<a href="https://ant.design">{item.title}</a>}
                    description={"Ant Design, a design language for background applications, is refined by Ant UED Team"}
                    />

                    <div className="mt-3 ">
                    <a href="https://ant.design">Comprar ahora </a> 
                    <a className="px-5" href="https://ant.design">Eliminar producto</a>
                    </div>
                </div>
 
                <div className="mt-4 align-items-center px-5">
                    <InputNumber size="large" min={1} max={100}/>
                    <p >Stock disponibles</p>
                </div>

                <div className="mt-4 ">
                   <h1>$10000</h1>
                </div>  
               
            </List.Item>
            
            )}
            
        />
        </div>
        <div className="d-flex justify-content-lg-center" >
            <h3>Total:</h3>
            
        </div> */}
            
        </div>
    )
}
