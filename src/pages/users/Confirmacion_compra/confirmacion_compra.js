import React from 'react'
import traer_pedido from "./services/traer_pedido"
import traer_datos from "./services/traer_datos"

import "./confirmacion.scss";

export default function confirmacion_compra() {
    return (
        <div>
        <h1 className="text-center mt-4" >Termina de realizar tu compra:</h1>
        <div className="container prinpales">
            <div className="row">
                <div className="col-lg-6">
                    <h2 className="__titulos">Verifica que tus datos esten correctos:</h2>
                    <traer_datos></traer_datos>
                </div>

                <div className="col-lg-6">
                    <h2 className="__titulos">Tu pedido:</h2>
                    <traer_pedido></traer_pedido>
                </div>
            </div>
        </div>
        </div>
    )
}
