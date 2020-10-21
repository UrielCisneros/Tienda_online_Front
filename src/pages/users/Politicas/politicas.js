import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/axios';
import {Spin} from 'antd'


function Politicas() {

    const [ loading, setLoading ] = useState(false);
    const [politicas, setPoliticas] = useState([]);

    function peticionPoliticas(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                setLoading(false);
                if (res.data[0].politicas !== "") {
                    setPoliticas(res.data[0].politicas)
                }
			})
			.catch((err) => {
                console.log(err);
			});
    }

    useEffect(() => {
        setLoading(true);
        peticionPoliticas();
    }, []);
    


    return(
        <Spin size="large" spinning={loading} >
            <div className="container">
                <div className="m-5">
                        <h1 className="text-center mt-4">Politicas de Privacidad</h1>
                        <h3 className="text-center mt-4">
                            Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de privacidad.
                        </h3>
                        
                        <div style={{lineHeight: "35px"}} dangerouslySetInnerHTML={{__html: politicas}} className='mt-5 px-4 ' />
                    </div>             
                </div> 
        </Spin>
    )


}

export default Politicas;