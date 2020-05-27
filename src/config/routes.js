//layout
import LayoutAdmin from '../components/LayoutAdmin'
import LayoutBasic from '../components/Layout'

//Admin pages
import AdminHome from '../pages/admin'
import RegistrarProductos from '../pages/admin/registrar_productos'
import Pedidos from '../pages/admin/pedidos'
import Promociones from '../pages/admin/promociones'
import SistemaApartado from '../pages/admin/sistema_apartado'
import Inventario from '../pages/admin/inventario'
import BlogAdmin from '../pages/admin/blog'

//pages
import Home from '../pages/home'
import Entrar from '../pages/entrar'
import QuienesSomos from '../pages/quienes_somos'
import ShoppingCart from '../pages/shopping_cart'
import Productos from '../pages/productos'
import Blog from '../pages/blog'
import PedidosUsuario from '../pages/pedidos'
import Ofertas from '../pages/ofertas'

//other
import Error404 from '../pages/error404'

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
				path: '/admin/registrar_productos',
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
				path: '/productos?:user',
				component: Productos,
				exact: true
			},
			{
				component: Error404
			}
		]
	}
];

export default routes;
