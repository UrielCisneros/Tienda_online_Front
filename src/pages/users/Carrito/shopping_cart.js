import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import MostrarDatosProductos from './services/MostrarDatosCarrito'

import {Button} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';

const styles ={fontSize: 25};


export default function ShoppingCart() {


    return (
      <div className="container" >
        <h1 className="text-center">Tu carrito de compras</h1>

        <div  className="row mx-auto" style={{background: "white"}}>
          <div className="col-lg-12 ">
            
          <MostrarDatosProductos ></MostrarDatosProductos>


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
      </div>
    )
}
