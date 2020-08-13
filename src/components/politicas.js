import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

const style = { background: '#8e9eab',
    background: '-webkit-linear-gradient(to right, #eef2f3, #8e9eab)',
    background: 'linear-gradient(to right, #eef2f3, #8e9eab)'};


function Politicas() {

    const [ loading, setLoading ] = useState(false);
    const [politicas, setPoliticas] = useState([]);

    function peticionPoliticas(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                console.log(res)
                
                    if (res.data[0].politicas !== "") {
                        console.log("Si hay datos")
                        setPoliticas(res.data[0].politicas)
                    }else{
                        console.log("No hay datos")
                        
                    }
			})
			.catch((err) => {
                console.log(err);
                console.log("No funciona");
			});
    }

    useEffect(() => {
        peticionPoliticas();
    }, []);
    


    return(
       <div > 
           <h1 className="text-center mt-4">Politicas de Privacidad</h1>
           
            <h3 className="text-center mt-4">
               Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de privacidad.
            </h3>
            
            <h2 dangerouslySetInnerHTML={{__html: politicas}} className='mt-5 px-4'></h2>
            
        </div> 
    )


}

export default Politicas;