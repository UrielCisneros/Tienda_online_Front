/* eslint-disable react/jsx-pascal-case */
import React,{useState,useEffect} from 'react'
import Traer_pedido from "./traer_pedido";
import {Button,Spin} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';
import clienteAxios from '../../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCcVisa,faCcMastercard } from '@fortawesome/free-brands-svg-icons'
import { faTruck } from '@fortawesome/free-solid-svg-icons'


import './Confirnacion_Final.scss';

export default function Confirmacion_Final(props) {

    const {datosPedido,idPago,pedidoCompleto,token,history} = props;
    const [direccion, setDireccion] = useState({});
    const [datosEnvio, setDatosEnvio] = useState({});
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setDireccion(pedidoCompleto.cliente.direccion[0]);
        traerCostosEnvio();
        setLoading(true);
    }, [])

    const traerCostosEnvio = async () => {
        await clienteAxios.get('/politicasEnvio/')
        .then((res) => {
            setLoading(false);
            setDatosEnvio(res.data)
            console.log(res.data);
            if(res.data.descuento){
                if(pedidoCompleto.total >= res.data.promocionEnvio){
                    console.log(pedidoCompleto.total);
                    console.log(res.data.costoEnvio);
                    setTotal(parseFloat(pedidoCompleto.total) + parseFloat(res.data.costoEnvio) - parseFloat(res.data.descuento));
                }else{
                    setTotal(parseFloat(pedidoCompleto.total) + parseFloat(res.data.costoEnvio));
                }
            }else{
              setTotal(parseFloat(pedidoCompleto.total) + parseFloat(res.data.costoEnvio));
            }
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    const crearPago = async () => {
        setLoading(true);
        console.log(total);
        const datos = {
            total,
        }
        await clienteAxios.put(`/pedidos/pedido/total/${pedidoCompleto._id}`,datos,{
            headers:{
                 Authorization: `bearer ${token}`
            }
        })
        .then(async (res) => {
            let centavo = 100 * parseFloat(total); 
            const newPedido = pedidoCompleto;
            newPedido.total = total;
            const datosPago = {
                sesionStripe: idPago,
                pedidoCompleto:newPedido,
                amount: centavo,
            };
            console.log(datosPago);
            await clienteAxios.post('/pago/',datosPago,{
                headers: {
                    Authorization: `bearer ${token}`
                }
            })
            .then((res) => {
                setLoading(false);
                console.log(res);
                history.push(`/success/${pedidoCompleto._id}`)
            })
            .catch((error) => {
                setLoading(false);
                console.log(error.response);
                history.push(`/error/${pedidoCompleto._id}/${error.response.data.err.code}`)
            })

        })
        .catch((error) => {
            setLoading(false);
            history.push(`/error/${pedidoCompleto._id}`)
        })

    }

    return (
        <Spin spinning={loading} size="large" >
            <div className="shadow-lg bg-white rounded confirmacion_final" >
                <div className="row">
                    <div className="col-lg-6">
                        <div className="mt-3">
                            <p className="text-center h3">Direccion de envio</p>
                            <div className="row">
                                <div className="col-lg-3 col-sm-none text-lg-right text-center ">
                                    <FontAwesomeIcon className="text-success" icon={faTruck} style={{fontSize:"50px"}} />
                                </div>
                                <div className="col-lg-7 col-sm-12 text-left m-0 m-sm-2 ">
                                    <p className="h6 font-weight-bold">{direccion.calle_numero}, {direccion.entre_calles}, {direccion.colonia}, {direccion.ciudad}, {direccion.estado}, {direccion.pais}, CP {direccion.cp}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center h3 mt-5">Informacion de pago</p>
                        <div className="row my-3">
                            <div className="col-lg-3 col-sm-12 text-lg-right  text-center">
                                <FontAwesomeIcon className={"visa"} icon={idPago.card.brand === "visa" ? faCcVisa : faCcMastercard} style={{fontSize:"50px"}} />
                            </div>
                            <div className="col-lg-7 m-2">
                                {console.log(idPago)}
                                <p className="h6"><span className="font-weight-bold">Tipo tarjeta:</span> {idPago.card.funding} </p>
                                <p className="h6"><span className="font-weight-bold">Tarjeta:</span> *********{idPago.card.last4} </p>
                                <p className="h6"><span className="font-weight-bold">Expira:</span> {idPago.card.exp_month}/{idPago.card.exp_year}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <Traer_pedido setTotal={setTotal} datosEnvio={datosEnvio} datosPedido={datosPedido} pedidoCompleto={pedidoCompleto}  />
                    </div>
                </div>
                <div className="d-flex flex-row-reverse justify-content-center align-items-center text-center pb-3 mr-5" >
                    <Button 
                        size="large" 
                        type="primary" 
                        style={{width: 200, textAlign: "center"}} 
                        onClick={crearPago}
                    > 
                            <ShoppingCartOutlined /> COMPRAR AHORA
                    </Button>
                </div> 
            </div>
        </Spin>
    )
}
