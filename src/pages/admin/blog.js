import React, {useState,useEffect } from 'react';
import {Button,notification,Drawer} from 'antd';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {PlusCircleOutlined } from '@ant-design/icons';
import './blog.scss';
import queryString from 'query-string';
import clienteAxios from '../../config/axios';
import Spin from '../../components/Spin';
import BlogsList from '../../components/Blog/blogList';
import Pagination from '../../components/Pagination/pagination';


function BlogAdmin(props) {

    //Tomar la paginacion actual
    const {location,history} = props;
    const {page = 1} = queryString.parse(location.search);
    
    //Uses
    const [ loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [blogs,setBlogs] = useState([]);
    const [reloadBlog, setReloadBlog] = useState(false);

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

    //Traer todos los blogs
    function getBlogsApi(limit,page){
        setLoading(true);
        clienteAxios.get(`/blog?limit=${limit}&page=${page}`)
            .then((res) => {
                console.log(res.data.posts)
                setBlogs(res.data.posts);
                setLoading(false);
        })
        .catch((err) => {
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
            console.log(err);
        });
    }
    //Ejecutar funcion traer blogs
    useEffect(() => {
        getBlogsApi(10,page);
        setReloadBlog(false);
	}, [page,reloadBlog]);

    //Verificar el JWT
    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }
    
    //Fuciones para abrir y cerrar el Drawer
    const showDrawer = () => {
      setVisible(true);
    };
    const drawnerClose = () => {
        setVisible(false);
      };

    //Mostrar el Spin
    if (loading) {
        return <Spin/>;
    }
    
    if(!blogs){
        return null;
    }

    return (
        <div className="blog">
            <Drawer
				title={'This drawer'}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={drawnerClose} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
            </Drawer>
            
            <div className="blog__add-post">
                <Button 
                    type="primary"
                    size="large"
                    onClick={showDrawer}
                    className="ml-3"
                    icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}>
                        Agregar Blog
                </Button>
            </div>
            <BlogsList blogs={blogs} setReloadBlog={setReloadBlog}/>
            <Pagination blogs={blogs} location={location}  history={history}/>
        </div>
    )
}
export default withRouter(BlogAdmin);