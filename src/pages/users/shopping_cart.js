import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import { List, InputNumber, Button, Avatar } from 'antd';


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

    useEffect(() => {
        setLoading(true);
        const obtenerCarrito = async () => {
			await clienteAxios
				.get(`/carrito/${decoded._id}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
                    // setCarrito(res.data.articulos.length);
                    console.log(res);
				})
				.catch((res) => {
					// setCarrito();
                    console.log("Nohay datos");
                });
		};
    }, []);
    
   

    return (
        <div className="px-5" >

        <h1 className="text-center">Tu carrito de compras</h1>

        <div  className="row" style={{background: "white"}}>
        
            <div className="col-lg-11 justify-content-lg-center">
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                    <List.Item>
                        <div className="d-none d-lg-block px-5">
                        {<img src="" width="130" height="150" />}
                        </div>
                        

                        <div >
                            <div className="d-flex justify-content-lg-center">
                                <List.Item.Meta
                                    avatar={<img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" 
                                    className="d-block d-sm-block d-lg-none"  height="70" width="70"/>}

                                    title={<h2 className="mt-3">{item.title}</h2>}
                                />
                            </div>
                            <div className="d-flex mt-3">
                                <p>Color: </p>
                                <p className="px-3">Talla: </p>
                                <p className="px-3">Talla: </p>
                            </div>
                            <div className="mt-3">
                                <Link href="https://ant.design">Comprar ahora </Link> 
                                <Link className="px-3" href="https://ant.design">Eliminar producto</Link>
                                <Link className="px-3" href="https://ant.design">Apartar</Link>
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
            <div className="col-lg-11 d-flex flex-row-reverse mt-4" >
                <div>
                    <h2>MilOchoMil</h2>
                    <h2>Gratis</h2>
                    <h1>$1020121</h1>
                    <Button size="large" className="px-5 align-self-center" type="primary">Comprar ahora</Button>
                </div>
                <div className="px-5 ">
                    <h2>Productos () </h2>
                    <Link><h2 >Envio a: </h2></Link>
                    <h2>Total: </h2>
                </div>
               
            </div>
        </div>     
        </div>
    )
}
