import React from 'react';
import { Layout, Menu, Input } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

const Navegacion = () => {
	return (
        
		<Layout className="layout">
			<Header>
				<Menu className="float-right" theme="dark" mode="horizontal" defaultSelectedKeys={[ '' ]}>
                    <Menu.Item>
                        <div>
                            <Search className="mt-3" placeholder="input search text" onSearch={(value) => console.log(value)} enterButton />
                        </div>					
					</Menu.Item>
					<Menu.Item key="1">
						Home<Link to="/" />
					</Menu.Item>
					<Menu.Item>
						Productos<Link to="/productos" />
					</Menu.Item>
                    <Menu.Item>
						Ofertas<Link to="/anclaCarousel" />
					</Menu.Item>
					<Menu.Item>
						Blog<Link to="/blog" />
					</Menu.Item>
					<Menu.Item>
						Quiénes somos<Link to="/quienes_somos" />
					</Menu.Item>
                    <Menu.Item>
						Pedidos<Link to="/pedidos" />
					</Menu.Item>
					<Menu.Item>
						Carrito<Link to="/shopping_cart" />
					</Menu.Item>
					<Menu.Item>
						Entrar<Link to="/entrar" />
					</Menu.Item>
				</Menu>
			</Header>
		</Layout>
	);
};

export default Navegacion;
