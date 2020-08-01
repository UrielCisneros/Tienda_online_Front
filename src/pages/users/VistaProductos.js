import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  Scroll  from '../users/subs/scroll';
import  Sugerencia  from '../users/subs/sugerencia';
import  ReadMoreReact from 'read-more-react';
import './vistas.css';


import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-image-gallery/styles/css/image-gallery.css';

import { SyncOutlined, CreditCardOutlined, ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';


import { InputNumber, Button, Radio, Descriptions, Divider, Row, Col, Select} from 'antd';

function onChange(value) {
  
}
const galery = {
  showPlayButton: false
}
const estil = {width: '100%', padding: 0, marginleft: "10%"  }
const { Option } = Select;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

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
      
      <div className="container-fluid">
          
          <h1 className="mt-3" style={{textAlign: 'center'}}>Cuadros de Paisajes</h1>

          <div className="row px-5" >

            <div className="col-lg-8" id="caracteristicas" style={{alignSelf: 'center'}}>
            <br/><ImageGallery items={images} {...galery}/>
            </div>

            <div className="col-lg-3" id="caracteristicas">
              <h4 className="mt-3">Productos 100% mexicanos de Mexico</h4>
              <h5>$ 1,500</h5>
              <p style={{borderTopStyle: 'solid', marginTop: 10}}></p>
              <p className="mt-4" style={{ fontSize: 20}}> 
              Cantidad: <InputNumber size="large" min={1} max={10} defaultValue={0} onChange={onChange} /></p>

              <p className="mt-4" style={{ fontSize: 20 }}>
              Talla:  <Select size="large" style={{ width: 120 }} >
              <Option value="Chica">Chica</Option>
              <Option value="Mediana">Mediana</Option>
              <Option value="Grande">Grande</Option>
              <Option value="X-L">E.- Grande</Option>
              </Select> </p>
              
              <p style={{borderTopStyle: 'solid', marginTop: 10}}></p>
              <Button className="mt-3" type="primary" size="large"> <TagsOutlined style={{ fontSize: 20 }} />
              Comprar ahora</Button>
              
              <Button className="mt-3" size="large" > <ShoppingCartOutlined style={{ fontSize: 20 }}/>
              Agregar al carrito</Button>

              <p className="mt-4" style={{color:'green', fontSize: '17px',  borderTopStyle: 'solid' }}> <SyncOutlined style={{ fontSize: 20 }}/>   
              Devoluciones Gratis</p> 
              
              <p className="mt-4" style={{color:'green', fontSize: '17px', borderTopStyle: 'solid' }}> <CreditCardOutlined style={{ fontSize: 20 }}/>   
              Formas de Pago</p>
             
            </div>
          </div>

          

          <div className="row px-5" >
            <div className="col-lg-8 mt-5"  >
              <h1 >Caracteristicas:</h1>
              <Descriptions >
                <Descriptions.Item label="Empresa" >A&B Soluciones</Descriptions.Item>
                <Descriptions.Item label="Tallas">Xs a Xl</Descriptions.Item>
                <Descriptions.Item label="Marca">American Eagle</Descriptions.Item>
                <Descriptions.Item label="Precio">$250,000</Descriptions.Item>
              </Descriptions>

              <h3 className="mt-5">Descripcion:</h3>
              <ReadMoreReact 
                text = { "Mi esperanza Mi esperanza es agregar un truncamiento más inteligente al agregar un peso a cada signo de puntuación basado en desgloses promedio de oraciones, para descubrir cuándo es mejor cortar un bloque de texto. Un ejemplo de esto sería darle más peso a un punto que a una coma, de modo que un punto cercano a una coma (aunque más alejado del ideal), pueda convertirse en el punto de corte."}
                min = { 80 }
                ideal = { 100 }
                max = { 1000 }
                readMoreText ="Ver mas..." />

            </div>
            
            <div className="col-lg-3 mt-5" >
              <h1>Publicidades No Pagadas</h1>
            </div>
          </div>

          <Row className="px-5">
            <Col span={24} >
            <h1 className="mt-3">Productos sugeridos</h1>
            <Sugerencia/>
            </Col>
          </Row>

          <Row className="px-5">
            <Col span={24}><Scroll/> </Col>
          </Row>

      </div>
     )
    }
  }

  export default VistaProductos;
