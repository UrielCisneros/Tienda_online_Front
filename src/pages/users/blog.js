import React from 'react'
import { Link } from 'react-router-dom';
import "./vistas.css"

import { List, Pagination} from 'antd';
import  ReadMoreReact from 'read-more-react';


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
    return (
        <div  id="blog">
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
    )
}
