import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    AppstoreOutlined ,
    PlusCircleOutlined,
    FormOutlined,
    CloseOutlined,
    TagOutlined,
    ShoppingCartOutlined,
    NotificationOutlined ,
	EditOutlined
} from '@ant-design/icons';

const { Sider} = Layout;

const Sidebar = () => {
	return (
        <Sider 
            style={{height: "100vh"}} 
			breakpoint="lg"
			collapsedWidth="0"
			onBreakpoint={(broken) => {
				console.log(broken);
			}}
			onCollapse={(collapsed, type) => {
				console.log(collapsed, type);
			}}
		>
			<div className="row" style={{maxWidth: "200px"}}>
                <div className="col-lg-4 col-4 mt-3 ml-2" style={{paddingLeft: "10px", paddingRight: "0"}}>
                    <img 
                        className="img-fluid rounded-circle"
                        src="https://scontent.fgdl5-3.fna.fbcdn.net/v/t31.0-8/20615952_1775944269085883_2653025582628636603_o.jpg?_nc_cat=105&_nc_sid=174925&_nc_ohc=51VICr9fwkIAX-VF395&_nc_ht=scontent.fgdl5-3.fna&oh=d2da667bd1182d1d384de578d6797f49&oe=5EEA8BC6" 
                        alt="Girl in a jacket"
                    />
                </div>
                <div className="col-lg-7 col-7" style={{paddingLeft: "10px", paddingRight: "0"}}>
                    <h6 className="text-white">Bienvenido</h6>
                    <h5 className="text-white">Nombre administrador</h5>
                </div>
            </div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={[ '' ]}>
				<Menu.Item key="1" icon={<AppstoreOutlined />}>
                    Panel principal<Link to="/admin" />
				</Menu.Item>
				<Menu.Item key="2" icon={<PlusCircleOutlined />}>
					Registrar Productos<Link to="/admin/registrar_productos" />
				</Menu.Item>
				<Menu.Item key="3" icon={<FormOutlined />}>
					Inventario<Link to="/admin/inventario" />
				</Menu.Item>
				<Menu.Item key="4" icon={<TagOutlined />}>
					Sistema de Apartado<Link to="/admin/sistema_apartado" />
				</Menu.Item>
                <Menu.Item key="5" icon={<ShoppingCartOutlined />}>
					Pedidos Pendientes<Link to="/admin/pedidos" />
				</Menu.Item>
                <Menu.Item key="6" icon={<NotificationOutlined />}>
					Promociones y sugerencias de compra<Link to="/admin/promociones" />
				</Menu.Item>
                <Menu.Item key="7" icon={<EditOutlined />}>
					Blog<Link to="/admin/blog" />
				</Menu.Item>
                <Menu.Item key="8" icon={<CloseOutlined />}>
					Salir<Link to="/" />
				</Menu.Item>
                
                
			</Menu>
		</Sider>
	);
};

export default Sidebar;
