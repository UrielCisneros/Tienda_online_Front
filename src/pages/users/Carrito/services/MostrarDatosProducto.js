import React from 'react'
import { List, InputNumber, Button, Avatar, Spin } from 'antd';
import { Link} from 'react-router-dom';
import {ShoppingCartOutlined, ExportOutlined, DeleteOutlined} from '@ant-design/icons';

const { Meta } = Card;
const styles ={fontSize: 25};

export default function MostrarDatosProductos(props) {


    const {producto} = props;

    return(

        <div>
        <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (

          <List.Item>
            <div className="d-none d-lg-block px-2">
            {<img src="" width="130" height="150" />}
            </div>

            <div>
              <div className="d-flex justify-content-lg-center">
                <List.Item.Meta
                  avatar={<img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" 
                  className="d-block d-sm-block d-lg-none"  height="70" width="70"/>}
                  title={item.title}
                />
              </div>

              <div className="d-flex mt-3">
                  
                <p className="px-3">condicionar tallas </p>
              </div>

              <div className="mt-3 d-flex">
                <p><Link to="/">
                  <ShoppingCartOutlined style={styles}/>Comprar ahora </Link> </p>
                <p><Link to="/" className="px-3">
                  <DeleteOutlined style={styles}/>Eliminar producto</Link></p>
                <p><Link  to="/" className="px-3">
                  <ExportOutlined style={styles}/>Apartar</Link></p>
              </div>
            </div>
    
            <div className="mt-4 align-items-center px-5">
              <InputNumber size="large" min={1} max={100}/>
              <p>Stock disponibles</p>
            </div>

            <div className="mt-4 ">
              <h1>$10000</h1>
            </div>  
                
          </List.Item>

        )}
      />
    </div>

)
}