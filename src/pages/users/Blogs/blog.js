import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import { List, Pagination,Spin} from 'antd';
import  ReadMoreReact from 'read-more-react';

import "./vistas.css"




const listData = [];
for (let i = 1; i < 5; i++) {
  listData.push({
    href: 'https://ant.design',
    title: `Mi primer Blog ${i}`,
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.',
  });
}

const Descrip = ({texto}) => (
    <Link>
    <ReadMoreReact 
    text = { (texto)}
    min = { 120 }
    ideal = { 150 }
    max = { 1000 }
    readMoreText ="Ver mas..." />
    </Link>
    );

    
export default function Blog() {
    
    const [loading, setloading] = useState(false)


    async function obtenerDatos(){
        await clienteAxios.get()
    }


    return (
        <Spin >
            <div  id="blog" className="container">
                <h1 className="text-center">Bienvenidos a nuestro Blog!</h1>
                <div className="container-fluid">
                    <div id="cards">
                    <List className="p-3"
                        itemLayout="vertical"
                        size="large"
                        dataSource={listData}
                        renderItem={item => (
                            <Link>
                                <List.Item 
                                    key={item.title}
                                    extra={
                                    <img
                                        width={272}
                                        alt="logo"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    />
                                    }
                                >
                                    <List.Item.Meta
                                    title={<a href={item.href}>{item.title}</a>}
                                    description={ <Descrip texto={item.description}/>}
                                    />
                                </List.Item>
                            </Link>
                        )}
                    />
                    </div>

                    <Pagination size='large' className="p-5 text-center"
                    defaultCurrent={1} total={100} />
                </div>
            </div>
        </Spin>
    )
}
