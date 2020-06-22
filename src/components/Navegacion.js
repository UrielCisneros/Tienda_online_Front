import React from 'react';
import { Layout, Menu, Button, Input} from 'antd';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

const { Search } = Input;
const { Header } = Layout;

const Navegacion = () => {

	const token = localStorage.getItem('token')

	return (
		<Layout className="layout">
			<Header>
				<Menu className="float-right" theme="dark" mode="horizontal" defaultSelectedKeys={[ '' ]}>
					<Search
						placeholder="input search text"
						onSearch={value => console.log(value)}
						style={{ width: 350 }}
					/>
					<Menu.Item>
						Home<Link to="/" />
					</Menu.Item>
					<Menu.Item>
						Productos<Link to="/productos" />
					</Menu.Item>
					<Menu.Item>
						Ofertas<Link to="/ofertas" />
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

					{ token === '' || token === null ?

					<Menu.Item>
						Entrar<Link to="/entrar" />
					</Menu.Item>
					:
										
					<Button type="primary" onClick={() =>{
						localStorage.removeItem('token')
						firebase.auth().signOut()
						window.location.reload()
						}
					} danger>Cerrar Sesión</Button>
					}
				</Menu>
			</Header>
		</Layout>
	);
};

export default Navegacion;
