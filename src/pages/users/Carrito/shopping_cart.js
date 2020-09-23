import React from 'react';
import MostrarDatosProductos from './MostrarDatosCarrito';
import { CarritoProvider } from './context_carrito/context-carrito';


export default function ShoppingCart() {
	return (
		<div className="container shadow">
			<div style={{ background: 'white' }}>
        <CarritoProvider>
          <MostrarDatosProductos />
        </CarritoProvider>
			</div>
		</div>
	);
}
