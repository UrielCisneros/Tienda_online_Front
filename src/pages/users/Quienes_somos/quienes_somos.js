import React,{useState,useEffect} from 'react'
import clienteAxios from '../../../config/axios';
import { Spin } from 'antd';


export default function QuienesSomos() {

    const [ loading, setLoading ] = useState(false);
    const [imagenCorp, setImagenCorp] = useState([]);

    function peticionImagenCoorporativa(){
        clienteAxios.get('/tienda/')
            .then((res) => {
                setLoading(false)
                if (res.data[0].politicas !== "") {
                    setImagenCorp(res.data[0].imagenCorp)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    
    useEffect(() => {
        peticionImagenCoorporativa();
        setLoading(true)
    }, [])

    return (
        <Spin size="large" spinning={loading}>
            <div className="container bg-white shadow mb-5">
                <div style={{lineHeight: "35px",color:"black"}} dangerouslySetInnerHTML={{__html: imagenCorp}} className='mt-5 px-4' />
            </div>
        </Spin>
    )
}
