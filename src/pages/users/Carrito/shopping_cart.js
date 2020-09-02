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

        <div className="row mx-auto" style={{background: "white"}}>

          <div>
            <MostrarDatosProductos ></MostrarDatosProductos>
          
            <div className="d-flex flex-row-reverse pb-3 mr-5" >
              <Button size="large" type="primary" style={{width: 250, textAlign: "center"}}> 
                <ShoppingCartOutlined style={styles}/> Comprar ahora
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    )
}
