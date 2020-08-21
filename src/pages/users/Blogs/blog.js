import React,{useState,useEffect} from 'react'
import clienteAxios from '../../../config/axios';
import {Spin,notification} from 'antd';
import queryString from 'query-string';
import Pagination from '../../../components/Pagination/pagination';
import BlogsList from'./services/BlogList';




const listData = [];
for (let i = 1; i <= 10; i++) {
  listData.push({
    href: 'https://ant.design',
    title: `Mi primer Blog ${i}`,
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.',
  });
}

    
export default function Blog(props) {

    const {location,history} = props;
    const {page = 1} = queryString.parse(location.search);
    
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState([])


    function getBlogsApi(limit,page){
        setLoading(true);
        clienteAxios.get(`/blog?limit=${limit}&page=${page}`)
        .then((res) => {
            console.log(res)
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

    useEffect(() => {
        setLoading(true);
        getBlogsApi(10,page)
    }, [page])


    return (
        <Spin size="large" spinning={loading} >
            <div  id="blog" className="container">
                <h1 className="text-center">Bienvenidos a nuestro Blog!</h1>
                <div className="container-fluid">
                    <div id="cards">
                        <BlogsList 
                            blogs={blogs} 
                            setLoading={setLoading}
                        />
                    </div>

                    <Pagination 
                        blogs={blogs} 
                        location={location}  
                        history={history}
                    />
                </div>
            </div>
        </Spin>
    )
}
