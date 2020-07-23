import React, {useState,useEffect } from 'react';
import {Button,notification,Drawer,Spin} from 'antd';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {PlusCircleOutlined } from '@ant-design/icons';
import './blog.scss';
import queryString from 'query-string';
import clienteAxios from '../../config/axios';


function BlogAdmin(props) {

    console.log(props)
    //Import de use
    const [ loading, setLoading ] = useState(false);
    const [visible, setVisible] = useState(false);
    const [blogs,setBlogs] = useState([]);

    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
	
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
        const url = clienteAxios.get(`/blog?limit=${limit}&page=${page}`)
            .then((res) => {
                console.log(res.data.posts.docs)
                setBlogs(res.data.posts.docs);
                setLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    //Ejecutar funcion traer blogs
    useEffect(() => {
		getBlogsApi(10,1);
	}, []);

    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }
    
    const showDrawer = () => {
      setVisible(true);
    };

    const drawnerClose = () => {
        setVisible(false);
      };

    if (loading) {
        return <Spin size="large" />;
	}

    return (
        <div className="blog">
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

            <h1>PostList.....</h1>
            <h2>Pagination.....</h2>

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
        </div>
    )
}
export default withRouter(BlogAdmin);