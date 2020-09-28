/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import Traer_pedido from "./traer_pedido";
import {Button} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';

import './Confirnacion_Final.scss';

export default function Confirmacion_Final(props) {

    const {datosPedido,idPago,pedidoCompleto,token} = props;

    console.log(pedidoCompleto);

    const crearPago = () => {

        let centavo = 100 * parseFloat(pedidoCompleto.total); 

        const datosPago = {
            sesionStripe: idPago,
            pedidoCompleto:pedidoCompleto,
            amount: centavo,
        };

        console.log(datosPago);

        clienteAxios.post('/pago/',datosPago,{
            headers: {
                Authorization: `bearer ${token}`
            }
        }).then((res) => {
            console.log(res);
        }).catch((error) => {
            console.log(error.response);
        })

    }

    return (
        <div className="confirmacion_final" >
            <div className="row">
                <div className="col-lg-6">
                    <div>
                        <p>Datos del usuario</p>
                    </div>
                    <div>
                        <p>Datos de la tarjeta</p>
                    </div>
                </div>
                <div className="col-lg-6">
                    <Traer_pedido datosPedido={datosPedido} pedidoCompleto={pedidoCompleto}  />
                </div>
            </div>
           

            <div className="d-flex flex-row-reverse pb-3 mr-5" >
              <Button 
                size="large" 
                type="primary" 
                style={{width: 200, textAlign: "center"}} 
                onClick={crearPago}
            > 
                    <ShoppingCartOutlined /> Comprar
              </Button>
            </div> 
        </div>
    )
}
