import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  Scroll  from '../users/subs/scroll';
import  Sugerencia  from '../users/subs/sugerencia';
import './vistas.css';


import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';

import { SyncOutlined, CreditCardOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';


import { InputNumber, Button, Radio, Descriptions, Divider, Row, Col} from 'antd';

function onChange(value) {
  
}
const galery = {
  showPlayButton: false
}

const images = [
    {
      
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/1000/600/',
    },
    {
      original: 'https://picsum.photos/id/1015/250/150/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    }
  ];
   

class VistaProductos extends React.Component {
    render() {
      return(
      
      <div className="container">
          
          <h1 className="mt-3" style={{textAlign: 'center'}}>Cuadros de Paisajes</h1>
          <div className="row">

            <div className="col-lg-8 "  id="caracteristicas">
            <br/><ImageGallery items={images} {...galery}/>
            </div>

            <div className="col-lg-3" id="caracteristicas">
              
              <h4 className="mt-3">Productos 100% mexicanos de Mexico</h4>
              <h5>$ 1,500</h5>
              <Divider />
              <p  style={{ fontSize: 20 }}> 
              Cantidad: <InputNumber size="large" min={1} max={10} defaultValue={0} onChange={onChange} /></p>
              <Divider />
              <Button type="primary" size="large"> <TagsOutlined style={{ fontSize: 20 }} />
              Comprar ahora</Button>
              
              <Button className="mt-3" size="large" > <ShoppingCartOutlined style={{ fontSize: 20 }}/>
              Agregar al carrito</Button>
              <Divider />
              <p  style={{color:'green', fontSize: '17px'}}> <SyncOutlined style={{ fontSize: 20 }}/>   
              Devoluciones Gratis</p> 
              <Divider />
              <p  style={{color:'green', fontSize: '17px'}}> <CreditCardOutlined style={{ fontSize: 20 }}/>   
              Formas de Pago</p>
             
            </div>
          </div>

          

          <div className="row">
            <div className="col-lg-8">
              <h1 className="mt-5">Caracteristicas:</h1>
              <Descriptions >
                <Descriptions.Item label="Empresa" >A&B Soluciones</Descriptions.Item>
                <Descriptions.Item label="Tallas">Xs a Xl</Descriptions.Item>
                <Descriptions.Item label="Marca">American Eagle</Descriptions.Item>
                <Descriptions.Item label="Precio">$250,000</Descriptions.Item>
              </Descriptions>
              <h3 className="mt-5">Descripcion:</h3>
              <p style={{ fontSize: 18 }}>¿Por qué elegir este producto?
                Controlada por Smartphone APP, no se requiere configuración o administración de red. No necesita una estación base o conexión a internet. aplicación disponible para iPhone, iPad, iWatch, Android y Tablets.Music Sync & Mic Sync: las luces inteligentes se sincronizarán con la música de su teléfono o la música capturada de fuentes externas.
              </p>
            </div>

            <div className="col-lg-3">
              <h1>Publicidades No Pagadas</h1>
            </div>
          </div>

          <div>
            <h1>Productos sugeridos</h1>
            {/* <Sugerencia/> */}
          </div>

          <div>
            <Scroll/>
          </div>

      </div>
     )
    }
  }

  export default VistaProductos;
