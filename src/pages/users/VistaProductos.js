import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './vistas.css';

import ImageScroller from 'react-image-scroller';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';

import { SyncOutlined, CreditCardOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';


import { InputNumber } from 'antd';
import { Button, Radio } from 'antd';
import { Descriptions } from 'antd';
import { Card } from 'antd';

const { Meta } = Card;
function onChange(value) {
  
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
      
      <div >
        <div className="container" >
          <br/>
          <h1 style={{textAlign: 'center'}}>Cuadros de Paisajes</h1>
        <div className="row">

          <div className="col-lg-8 " id="caracteristicas">
          <br/><ImageGallery items={images} />
          </div>

          <div className="col-lg-3" id="caracteristicas">
            <br/>
            <h4>Productos 100% mexicanos de Mexico</h4>
            <h5>$ 1,500</h5>
            
            <p style={{ fontSize: 20 }}> 
            Cantidad: <InputNumber size="large" min={1} max={10} defaultValue={0} onChange={onChange} /></p>
            <br/>
            <Button type="primary" size="large"> <TagsOutlined style={{ fontSize: 20 }} />
            Comprar ahora</Button>
            <br/><br/>
            <Button size="large" > <ShoppingCartOutlined style={{ fontSize: 20 }}/>
            Agregar al carrito</Button>
            <br/><br/>
            <p style={{color:'green', fontSize: '17px'}}> <SyncOutlined style={{ fontSize: 20 }}/>   
            Devoluciones Gratis</p> 
            <br/>
            <p style={{color:'green', fontSize: '17px'}}> <CreditCardOutlined style={{ fontSize: 20 }}/>   
            Formas de Pago</p>
            
          </div>
        </div>
        <br/><br/><br/>
        <div className="row">
          <div className="col-lg-8">
            <h1 >Caracteristicas:</h1>
            <Descriptions >
              <Descriptions.Item label="Empresa" >A&B Soluciones</Descriptions.Item>
              <Descriptions.Item label="Tallas">Xs a Xl</Descriptions.Item>
              <Descriptions.Item label="Marca">American Eagle</Descriptions.Item>
              <Descriptions.Item label="Precio">$250,000</Descriptions.Item>
            </Descriptions>
            
            <h3>Descripcion:</h3>
            <p style={{ fontSize: 18 }}>¿Por qué elegir este producto?
              Controlada por Smartphone APP, no se requiere configuración o administración de red. No necesita una estación base o conexión a internet. aplicación disponible para iPhone, iPad, iWatch, Android y Tablets.Music Sync & Mic Sync: las luces inteligentes se sincronizarán con la música de su teléfono o la música capturada de fuentes externas.

              La distancia de control es más lejana y más sensible que el control remoto normal.La distancia de recepción efectiva es de 8~10m.

              Fácil de instalar
              - Parte posterior autoadhesiva con cinta adhesiva para un uso seguro y fácil. - Todo en un solo kit, tiras de LED RGB, USB adaptador de corriente. No se necesitan más accesorios.- En comparación con la iluminación tradicional, la iluminación led tiene un menor consumo de energía, más ahorro de energía y protección del medio ambiente. Sin batería. Sin plomo ni mercurio. Sin radiación UV o IR.
            </p>
          </div>

          <div className="col-lg-3">
            <h1>Publicidades No Pagadas</h1>
          </div>
        </div>

        <div>
          <h1>Productos que te pueden interesar:</h1>
        <ImageScroller>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        </ImageScroller>
        </div>

        </div>
      </div>
     )
    }
  }

  export default VistaProductos;
