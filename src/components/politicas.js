import React, { useState, useEffect , Component} from 'react'
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

const style = { background: '#8e9eab',
    background: '-webkit-linear-gradient(to right, #eef2f3, #8e9eab)',
    background: 'linear-gradient(to right, #eef2f3, #8e9eab)'};


function Politicas() {

    const [ loading, setLoading ] = useState(false);
    const [politicas, setPoliticas] = useState([]);

    useEffect(() => {
        setLoading(true);
		clienteAxios
			.get('/tienda')
			.then((res) => {
                console.log(res);
                setPoliticas(res.data[0].politicas);
                setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

    return(
       <div > 
           <h1 className="text-center mt-4">Politicas de Privacidad</h1>
           
            <h3 className="text-center mt-4">
               Para poder brindarte una mayor experiencia de compra, te invitamos a leer nuestras politicas de privacidad.
            </h3>
            <div style={{width: 1140, height: "100%"}}>

            </div>
            <h2 className='mt-5 px-4 text-center'>
            {politicas}
            </h2>
            
        </div> 
    )


}

export default Politicas;