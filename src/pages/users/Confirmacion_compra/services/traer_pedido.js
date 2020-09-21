import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../../config/axios';

import {List, InputNumber, Button} from 'antd'
import {ShoppingCartOutlined} from '@ant-design/icons';

import "../confirmacion.scss";


export default function Traer_pedido(props) {
    const {datosPedido,idPago} = props;
    console.log(idPago);

    return (
        <div>
            <h1 className="text-center">Tu pedido:</h1>
            <div>
            <List 
                className="p-3"
                itemLayout="horizontal"
                size="large"
                dataSource={datosPedido}
                renderItem={producto => 
                <Productos pedido={producto}/> 
                }
            />
            </div>
            <div className="d-flex flex-row-reverse px-4 mr-2 mt-3" >
            <div className="__cargos">
              <p>MilOchoMil</p>
              <p>Docientos</p>
              <p className="mt-4">$1001</p>
              <br/><br/>
            </div>
            <div className="px-5 __subs">
              <p>Productos ({datosPedido.length})</p>
              <p>Costo envio</p>
              <p className="mt-4">Total: </p>
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
    console.log(pedido);
    return(

    <List.Item >
    <div className="">
      <div className="row">

        <div className="col-lg-8 d-flex justify-content-lg-center">
          <List.Item.Meta 
            avatar={<img src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${pedido.producto.imagen}`} 
            height="80" width="80"/>}
            title={<p className="__nombres">{pedido.producto.nombre}</p>}
            description={<p className="__categ">{pedido.producto.categoria}</p>}
          />
        </div>
      
        <div className=" col-lg-3 mt-2 ">
          <p className="__tupedido mt-3">Cantidad:  {pedido.cantidad}</p> 

          {pedido.producto.tipoCategoria === 'calzado' ? (
            <div>
            <p className="__tupedido">Numero: {pedido.numero}</p>
            <p className="__tupedido">Color: {pedido.producto.color}</p>
            </div>
            ): ""}

          {pedido.producto.tipoCategoria === 'ropa' ? (
            <div>
            <p className="__tupedido">Talla:  {pedido.talla}</p>
            <p className="__tupedido">Color: {pedido.producto.color}</p>
            </div>
            ): ""}

          {/* {pedido.producto.tipoCategoria === 'otros' ? (
            <div>
            <p className="__tupedido">{pedido.pedido.categoria}</p>
            </div>
            ): ""} */}
          
        </div>

      </div>
    </div> 

    <div className="d-flex flex-row-reverse mr-2" >
      <p style={{fontSize: 28, fontWeight: "bold"}}>{pedido.cantidad * pedido.producto.precio}</p>
    </div>
    
    </List.Item>

    )
      
  }



