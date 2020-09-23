/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import Traer_pedido from "./traer_pedido";
import {Button} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';

export default function Confirmacion_Final(props) {

    const {datosPedido,idPago,pedidoCompleto,token} = props;

    console.log(idPago);

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
            console.log(error);
        })

    }

    return (
        <div>
            <h3>Confirmacion final..</h3>
            <Traer_pedido datosPedido={datosPedido} pedidoCompleto={pedidoCompleto}  />

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
