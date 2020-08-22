import React, { useState, useEffect } from 'react';
import { InputNumber, Button, Form, Badge, Divider } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, BellOutlined } from '@ant-design/icons';

function TallasCantidades(props) {
	const productos = props.producto;
	const [ categoria, setCategoria ] = useState();
	const [ cantidad, setCantidad ] = useState();
	const [ tallas, setTallas ] = useState([]);
	const [ numeros, setNumeros ] = useState([]);
	const [ render, setRender ] = useState([]);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ cantidadFinal, setCantidadFinal ] = useState(1);

	useEffect(
		() => {
			if (productos.categoria === 'calzado') {
				setCategoria('calzado');
				setRender(
					productos.numeros.map((numeros) => {
						return numeros.cantidad > 0 ? (
							<Badge key={numeros._id} count={numeros.cantidad} style={{ backgroundColor: '#1890FF' }}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setNumeros(numeros)}
								>
									{numeros.numero}
								</Button>
							</Badge>
						) : (
							<Badge
								key={numeros._id}
								showZero
								count={numeros.cantidad}
								style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{numeros.numero}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.categoria === 'ropa') {
				setCategoria('ropa');
				setRender(
					productos.tallas.map((tallas) => {
						return tallas.cantidad > 0 ? (
							<Badge key={tallas._id} count={tallas.cantidad} style={{ backgroundColor: '#1890FF' }}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setTallas(tallas)}
								>
									{tallas.talla}
								</Button>
							</Badge>
						) : (
							<Badge
								key={tallas._id}
								count={tallas.cantidad}
								showZero
								style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{tallas.talla}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.categoria === 'otros') {
				setCategoria('otros');
				setCantidad(productos.cantidad);
			}
		},
		[ productos ]
	);

	function obtenerCantidad(cantidad){
		if(cantidad <= 0 || cantidad > productos.cantidad ){
			setValidateStatus('error');
		}else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad)
		}
	}
	function obtenerCantidadNumero(cantidad){
		if(cantidad <= 0 || cantidad > numeros.cantidad ){
			setValidateStatus('error');
		}else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad)
		}
	}
	function obtenerCantidadTalla(cantidad){
		if(cantidad <= 0 || cantidad > tallas.cantidad ){
			setValidateStatus('error');
		}else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad)
		}
	}

	function enviarDatos(){
		console.log(cantidadFinal, numeros.numero)
	}

	return (
		<div className="contenedor-p-seleccion-compra">
			<div className="contenedor-p-seleccion-compra mb-4">
				{categoria !== 'otros' ? <p className="mb-3">Tallas:</p> : <p />}
				<div>{render}</div>
			</div>
			{categoria === 'otros' && productos.cantidad > 0 ? (
				<p className="disponibilidad-p mb-3">{productos.cantidad} articulos disponibles!</p>
			) : categoria === 'otros' && productos.cantidad <= 0 ? (
				<p className="disponibilidad-p mb-3">En este momento no hay articulos disponibles</p>
			) : (
				<p />
			)}

			<Form initialValues={{cantidad: 1}}>
				{categoria !== 'otros' ? (
					<Form.Item
						name="cantidad"
						label="Cantidad"
						validateStatus={validateStatus}
						help={categoria === 'ropa' ? <p>Solo hay {tallas.cantidad} disponibles</p> : <p>Solo hay {numeros.cantidad} disponibles</p>}
					>
						<InputNumber
							size="large"
							min={1}
							max={categoria === 'ropa' ? tallas.cantidad : numeros.cantidad}
							defaultValue={1}
							onChange={categoria === 'ropa' ? obtenerCantidadTalla : obtenerCantidadNumero}
							style={{ width: 130 }}
							disabled={tallas.length !== 0 || numeros.length !== 0 ? false : true}
						/>
					</Form.Item>
				) : (
					<Form.Item
						label="Cantidad"
						validateStatus={validateStatus}
						help={<p>Solo hay {productos.cantidad} disponibles</p>}
					>
						<InputNumber
							size="large"
							min={1}
							max={productos.cantidad}
							defaultValue={1}
							onChange={obtenerCantidad}
							style={{ width: 130 }}
						/>
					</Form.Item>
				)}
			</Form>

			<Divider />
			<div className="d-flex justify-content-center">
				<div>
					<Button className="d-block" type="primary" size="large" style={{ width: 200 }} onClick={() => enviarDatos()}>
						<TagsOutlined style={{ fontSize: 20 }} />
						Comprar ahora
					</Button>
					<Button className="mt-3 d-block" size="large" style={{ width: 200 }}>
						<BellOutlined style={{ fontSize: 20 }} />
						Apartar
					</Button>
					<Button className="mt-3 d-block" size="large" style={{ width: 200 }}>
						<ShoppingCartOutlined style={{ fontSize: 20 }} />
						Agregar al carrito
					</Button>
				</div>
			</div>
		</div>
	);
}
export default TallasCantidades;
