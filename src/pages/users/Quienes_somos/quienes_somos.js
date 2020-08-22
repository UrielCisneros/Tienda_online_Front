import React,{useState,useEffect} from 'react'
import clienteAxios from '../../../config/axios';
import { Spin } from 'antd';


export default function QuienesSomos() {

    const [ loading, setLoading ] = useState(false);
    const [imagenCorp, setImagenCorp] = useState([]);

    function peticionImagenCoorporativa(){
        clienteAxios.get('/tienda/')
            .then((res) => {
                console.log(res)
                setLoading(false)
                if (res.data[0].politicas !== "") {
                    console.log("Si hay datos")
                    setImagenCorp(res.data[0].imagenCorp)
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
        peticionImagenCoorporativa();
        setLoading(true)
    }, [])

    return (
        <Spin size="large" spinning={loading}>
            <div className="container">
                <div style={{lineHeight: "35px",color:"black"}} dangerouslySetInnerHTML={{__html: imagenCorp}} className='mt-5 px-4' />
            </div>
        </Spin>
    )
}
