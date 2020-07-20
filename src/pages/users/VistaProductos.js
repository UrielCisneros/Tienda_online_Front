import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './vistas.scss';
import Productos from './productos'

import ImageGallery from 'react-image-gallery';
import { SyncOutlined, CreditCardOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';

import { InputNumber } from 'antd';
import { Button, Radio } from 'antd';


function onChange(value) {
  
}


const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
  ];
   

class VistaProductos extends React.Component {
    render() {
      return(
      
      <div >
        <div className="container" >
          <br/>
          <h1 style={{textAlign: 'center'}}>Cuadros de Paisajes</h1>
        <div className="row">

          <div className="col-lg-9 " >
           <ImageGallery items={images} />
          </div>

          <div className="col-lg-3">
            <h4>Productos 100% mexicanos de Mexico</h4>
            <h5>$ 1,500</h5>
            
            <p style={{ fontSize: 20 }}> Cantidad: <InputNumber size="large" min={1} max={10} defaultValue={0} onChange={onChange} /></p>
            <br/>
            <Button type="primary" size="large"> <TagsOutlined style={{ fontSize: 20 }} />Comprar ahora</Button>
            <br/><br/>
            <Button size="large" > <ShoppingCartOutlined style={{ fontSize: 20 }}/>Agregar al carrito</Button>
            <br/><br/>
            <p style={{color:'green', fontSize: '17px'}}> <SyncOutlined style={{ fontSize: 20 }}/>   Devoluciones Gratis</p> 
            <br/>
            <p style={{color:'green', fontSize: '17px'}}> <CreditCardOutlined style={{ fontSize: 20 }}/>   Formas de Pago</p>
          </div>
        </div>
          <br/>
        <h1>Caracteristicas</h1>
        <br/><br/>
        </div>

        <Productos/>

      </div>
     )
    }
  }

  export default VistaProductos;
