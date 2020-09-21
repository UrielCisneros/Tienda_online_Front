function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

export function obtenerStockCarrito(carrito){
    var nuevo = carrito.articulos.map((res) => {
        if (res.idarticulo.tipoCategoria !== 'otros') {
            if (res.idarticulo.tallas.length !== 0) {
                const cantidad = res.idarticulo.tallas.map((res) => res.cantidad);
                const unique = cantidad.filter(onlyUnique);
                if (unique.length > 1) {
                    return res;
                } else {
                    return [];
                }
            } else if (res.idarticulo.numeros.length !== 0) {
                const cantidad = res.idarticulo.numeros.map((res) => res.cantidad);
                const unique = cantidad.filter(onlyUnique);
                if (unique.length > 1) {
                    return res;
                } else {
                    return [];
                }
            }
        } else {
            if (res.idarticulo.cantidad !== 0) {
                return res;
            } else {
                return [];
            }
        }
        return [];
    });
    return nuevo
}

export function obtenerDisponibilidad(carrito){
    if (carrito.idarticulo.tallas && carrito.idarticulo.tallas.length !== 0) {
        const cantidad = carrito.idarticulo.tallas.map((res) => res.cantidad);
        const unique = cantidad.filter(onlyUnique);
        if (unique.length === 1) {
            return 'disponibilidad-carrito';
        }
    } else if (carrito.idarticulo.numeros && carrito.idarticulo.numeros.length !== 0) {
        const cantidad = carrito.idarticulo.numeros.map((res) => res.cantidad);
        const unique = cantidad.filter(onlyUnique);
        if (unique.length === 1) {
            return 'disponibilidad-carrito';
        }
    } else {
        if (carrito.idarticulo.tipoCategoria === 'otros' && carrito.idarticulo.cantidad <= 0) {
            return 'disponibilidad-carrito';
        }
    }
    return ''
}
