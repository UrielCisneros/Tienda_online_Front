/* eslint-disable react/jsx-pascal-case */
import React,{useState,useEffect} from 'react'
import Traer_pedido from "./traer_pedido";
import {Button} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';

import './Confirnacion_Final.scss';

export default function Confirmacion_Final(props) {

    const {datosPedido,idPago,pedidoCompleto,token} = props;
    const [direccion, setDireccion] = useState({});

    console.log(pedidoCompleto);

    useEffect(() => {
        setDireccion(pedidoCompleto.cliente.direccion[0]);
    }, [])

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
                    <div className="mt-3">
                        <p className="text-center h3">Direccion de envio</p>
                        <div className="text-center row">
                            <div>
                                
                            </div>
                            <p> {direccion.calle_numero}, {direccion.entre_calles}, {direccion.colonia}  </p>
                        </div>
                        
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
