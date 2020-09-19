/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../config/axios';

import {useParams} from 'react-router-dom'
import {Spin,Steps, Button, message,notification} from 'antd';

import Traer_pedido from "./services/traer_pedido";
import Traer_datos from "./services/traer_datos";
import Verificacion_tarjeta from "./services/Verificacion_Tarjeta";


import "./confirmacion.scss";

const { Step } = Steps;

export default function Confirmacion_compra(pros) {

    const {url} = useParams();
    const [datosUser, setDatosUser] = useState(null);
    const [ disabled, setDisabled ] = useState(true);
    const [datosPedido, setPedido] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accion, setAccion] = useState(false);
    const [idPago, setIdPago] = useState([])
    const [ disabledPrev, setDisabledPrev ] = useState(false);

    	/// Declaracion de variables para los pasos
	const [ current, setCurrent ] = useState(0);

    
    //Obtener token de localStorage
    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 

    //Decodificar el JWT
	function Jwt(token) {
		try {
            return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }

    const next = () => {
        if(current + 1 === 2){
            
        }
        setCurrent(current + 1);
	};

    const prev = () => {
        setCurrent(current - 1);
        
	};

    async function obtenerDatosUser() {
        if(token === null){
                return null
            }
            await clienteAxios.get(`/pedidos/pedido/${url}`,{
                headers:{
                        Authorization: `bearer ${token}`
                }
            })
            .then((res) => {
                setDatosUser(res.data.cliente);
            })
            .catch((err) => {
                console.log(err);
            })
            setLoading(false)
        }

        async function obtenerPedido() {
        if(token === null){
            return null
        }
        await clienteAxios.get(`/pedidos/pedido/${url}`,{
            headers:{
                    Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            setPedido(res.data.pedido);
        })
        .catch((err) => {
            console.log(err);
        })
        setLoading(false)
    }

    const steps = [
        {
        title: 'Datos de envio',
        content: (
            <div className="">
                <Traer_datos datosUser={datosUser} decoded={decoded} setCurrent={setCurrent} current={current} />
            </div>
        ),
        },
        {
        title: 'Datos de compra',
        content: (
            <div>
                <Verificacion_tarjeta setIdPago={setIdPago} prev={prev} setCurrent={setCurrent} current={current}  />
            </div>
        ),
        },
        {
        title: 'Comprar',
        content: (
            <div className="col-lg-7 mt-4">
                <Traer_pedido datosPedido={datosPedido} />
            </div>
        ),
        },
    ];


       
    useEffect(() => {
        setLoading(true)
        obtenerDatosUser();
        obtenerPedido();
        setAccion(false);
        setDisabled(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [accion])


    return (
        <div className="" >
            <div className="container prinpales p-3 mt-5" >
                <div>
                    <div className="d-flex justify-content-center m-3">
                        <div style={{ width: '80%' }}>
                            <Steps current={current}>{steps.map((item) => <Step key={item.title} title={item.title} />)}</Steps>
                        </div>
                    </div>
                    <div className="steps-content">
                        <Spin size="large" spinning={loading}>
                            {steps[current].content}
                        </Spin>
                    </div>
{/*                     <div className="steps-action d-flex justify-content-center align-items-center">
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={prev} disabled={disabledPrev}>
                                Atras
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    notification.success({
                                        message: 'su producto ha sido creado!',
                                        duration: 2
                                    });
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                }}
                            >
                                Comprar
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next} disabled={disabled}>
                                Siguiente 
                            </Button>
                        )}
                    </div> */}
                </div>  
            </div>
        </div>
    )
    
}
