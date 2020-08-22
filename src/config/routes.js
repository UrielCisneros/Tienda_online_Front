//layout
import LayoutAdmin from '../components/LayoutAdmin'
import LayoutBasic from '../components/Layout'

//Admin pages
import AdminHome from '../pages/admin/Principal/principal'
import RegistrarProductos from '../pages/admin/Productos/productos'
import Pedidos from '../pages/admin/Pedidos/pedidos'
import Promociones from '../pages/admin/Promociones/promociones'
import SistemaApartado from '../pages/admin/Apartado/apartado'
import Inventario from '../pages/admin/Inventario/inventario'
import Sugerencias from '../pages/admin/Sugerencias/sugerencias'
import Carousel from '../pages/admin/Carousel/carousel'
import BlogAdmin from '../pages/admin/Blog/blog'

//Users pages
import Home from '../pages/users/home'
import Entrar from '../pages/users/entrar'
import QuienesSomos from '../pages/users/quienes_somos'
import ShoppingCart from '../pages/users/shopping_cart'
import Productos from '../pages/users/Productos/productos'
import Blog from '../pages/users/Blogs/blog';
import PedidosUsuario from '../pages/users/pedidos'
import Ofertas from '../pages/users/Carusel_ofertas/ofertas'
import Articulo from '../pages/users/articulo'
import ResultadoBusqueda from '../pages/users/Resultado_Busqueda/resultado_busqueda'

import Politicas from '../components/politicas'
//Secondary Component
import VistaProducto from '../pages/users/Vista_Producto/vista_producto'

//other
import Error404 from '../pages/users/error404'
import Search404 from '../pages/users/Resultado_Busqueda/404'

const routes = [
	{
		path: '/admin',
		component: LayoutAdmin,
		exact: false,
		routes: [
			{
				path: '/admin',
				component: AdminHome,
				exact: true,
			},
			{
				path: '/admin/productos',
				component: RegistrarProductos,
				exact: true
			},
			{
				path: '/admin/pedidos',
				component: Pedidos,
				exact: true
			},
			{
				path: '/admin/promociones',
				component: Promociones,
				exact: true
			},
			{
				path: '/admin/sistema_apartado',
				component: SistemaApartado,
				exact: true
			},
			{
				path: '/admin/inventario',
				component: Inventario,
				exact: true
			},
			{
				path: '/admin/blog',
				component: BlogAdmin,
				exact: true
			},
			{
				path: '/admin/sugerencias',
				component: Sugerencias,
				exact: true
			},
			{
				path: '/admin/carousel',
				component: Carousel,
				exact: true
			},
			{
				component: Error404
			}
		]
	},
	{
		path: '/',
		component: LayoutBasic,
		exact: false,
		routes: [
			{
				path: '/',
				component: Home,
				exact: true
			},
			{
				path: '/entrar',
				component: Entrar,
				exact: true
			},
			{
				path: '/quienes_somos',
				component: QuienesSomos,
				exact: true
			},
			{
				path: '/shopping_cart',
				component: ShoppingCart,
				exact: true
			},
			{
				path: '/productos',
				component: Productos,
				exact: true
			},
			{
				path: '/blog',
				component: Blog,
				exact: true
			},
			{
				path: '/blog/:url',
				component: Blog,
				exact: true
            },
            {
				path: '/pedidos',
				component: PedidosUsuario,
				exact: true
			},
			{
				path: '/ofertas',
				component: Ofertas,
				exact: true
			},
			{
				path: '/productos',
				component: Productos,
				exact: true
			},
			{
				path: '/articulo',
				component: Articulo,
				exact: true
			},
			{
				path: '/vista_producto/:url',
				component: VistaProducto,
				exact: true
			},
			{
				path: '/politicas',
				component: Politicas,
				exact: true
			},
			{
				path: '/searching/:url',
				component: ResultadoBusqueda,
				exact: true
			},
			{
				path: '/searching/',
				component: Search404,
				exact: true
			},
			{
				component: Error404
			}
		]
	}
];

export default routes;
