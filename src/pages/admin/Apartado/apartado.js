import React,{useEffect,useState} from 'react'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../config/axios';
import {notification,Col,Spin,Result,Row,Modal,Input } from 'antd'
import queryString from 'query-string';
import MostrarDatosTargeta from './services/MostrarDatosTargeta'
import DetalleApartado from './services/DetalleApartado';
import Pagination from '../../../components/Pagination/pagination'
import './apartado.scss';

const { Search } = Input;

function SistemaApartado(props) {

	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);


    const [ loading, setLoading ] = useState(false);
    const [ apartados, setApartados ] = useState([]);
	const [ detalleApartado, setDetalleApartado ] = useState([]);
	const [apartadoPaginacion, setApartadoPaginacion] = useState([]);

    const [filter, setFilter] = useState('')

    const [ visible, setVisible ] = useState(false);
	const [ estado, setEstado ] = useState(false);

    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
	
	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}
	
	function obtenerProductosFiltrados(filter){
		setLoading(true);
		clienteAxios.get(`/apartado/filtroCliente/${filter}`,{
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})
        .then((res) => {
			setLoading(false);
			console.log(res);
			setApartados(res.data)
        }).catch((err) => {
			setLoading(false);
			console.log(err.response);
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
	}

	
    
    function obtenerDatos(limit,page){
		setLoading(true);
        clienteAxios.get(`/apartado/?limit=${limit}&page=${page}`,{
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})
        .then((res) => {
			setLoading(false);
            console.log(res);
			setApartados(res.data.posts.docs)
			setApartadoPaginacion(res.data.posts)
        }).catch((err) => {
			setLoading(false);
			console.log(err.response);
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
    }

    useEffect(() => {
		obtenerDatos(24,page);
		setLoading(true);
		setEstado(false)
	}, [page,filter,estado])
	

    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }
    const showModal = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
    };

    return (
       <div>
			<Spin size="large" spinning={loading}>
				<div>
					<p className="text-center font-weight-bold" style={{ fontSize: 20 }}>
						SISTEMA DE CONTROL DE APARTADO
					</p>
					<Row justify="center mt-5">
							<Search
								placeholder="Buscar apartados"
								onSearch={(value) => {
									if(value === ""){
										obtenerDatos(10,page,filter)
									}else{
										obtenerProductosFiltrados(value)
									}
								}}
								style={{ height: 40, marginBottom: 10 }}
								className="search-width"
								enterButton="Buscar"
								size="large"
							/>
					</Row>
					<div className="mt-4">
						{apartados.length === 0 ? (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="No hay resultados" />
							</div>
						) : (
							<Row gutter={16}>
								{
								apartados.map((apartado) => (							
									<MostrarDatosTargeta 
										key={apartado._id}
										setDetalleApartado={setDetalleApartado} 
										showModal={showModal} 
										apartado={apartado} 
										setEstado={setEstado}
										token={token}
									/>
								))
								}
							</Row>
						)}
					</div>
				</div>
				<Modal
					key="detalle"
					width={600}
					style={{ top: 0 }}
					title="Detalles de este pedido"
					visible={visible}
					onCancel={handleCancel}
					footer={[
						''
					]}
				>
					<DetalleApartado detalleApartado={detalleApartado} setEstado={setEstado} setFilter={setFilter} />
				</Modal>
				<Pagination blogs={apartadoPaginacion} location={location} history={history} limite={24}/>
			</Spin>
       </div>
    )
}

export default withRouter(SistemaApartado);
