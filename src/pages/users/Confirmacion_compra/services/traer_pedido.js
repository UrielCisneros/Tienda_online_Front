import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../../config/axios';

import {List, InputNumber, Button} from 'antd'
import {ShoppingCartOutlined} from '@ant-design/icons';

import "../confirmacion.scss";

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
    {
      title: 'Ant Design Title 4',
    },
  ];

export default function Traer_pedido() {

    const [pedido, setPedido] = useState([])

    return (
        <div>
            <h1 className="text-center">Tu pedido:</h1>
            <div>
            <List 
                className="p-3"
                itemLayout="horizontal"
                size="large"
                dataSource={data}
                renderItem={product => 
                <Productos pedido={product}/> 
                }
            />
            </div>
            <div className="d-flex flex-row-reverse mr-2" >
            <div>
              <h4>MilOchoMil</h4>
              <h4>Docientos</h4>
              <h4 className="mt-4">$1001</h4>
              <br/><br/>
            </div>
            <div className="px-5 ">
              <h4>Productos</h4>
              <h4>Costo envio</h4>
              <h4 className="mt-4">Total: </h4>
            </div>
            </div>
            <div className="d-flex flex-row-reverse pb-3 mr-5" >
              <Button size="large" type="primary" style={{width: 200, textAlign: "center"}}> 
                <ShoppingCartOutlined /> Comprar
              </Button>
              
            </div>
    
        </div>
    )
}

function Productos (props) {
    const {pedido} = props;

    return(

    <List.Item >
    <div className="container">
      <div className="row">

        <div className="col-lg-8 d-flex justify-content-lg-center" style={{fontSize: 18}} >
          <List.Item.Meta style={{fontSize: 20}}
            avatar={<img src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/`} 
            height="80" width="80"/>}
            title={<p className="__subs">Playera de algodon</p>}
            description={<p>Esta es una playera de algodon de poliester</p>}
          />
        </div>
      
        <div className=" col-lg-3 mt-2 __tupedido">
          <p>Cantidad: </p> 
          <p>Talla:</p>
          <p>Color:</p>
        </div>

      </div>
    </div> 

    <div className="d-flex flex-row-reverse mr-2" >
      <p style={{fontSize: 25, fontWeight: "bold"}}>Precio</p>
    </div>
    
    </List.Item>

    )
      
  }



