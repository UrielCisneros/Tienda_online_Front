import React, { useState, useEffect } from 'react';
import { InputNumber, Button, Form } from 'antd';

function TallasCantidades(props) {
	const productos = props.producto;
	const [ categoria, setCategoria ] = useState();
	const [ cantidad, setCantidad ] = useState();
	const [ tallas, setTallas ] = useState();
	const [ numeros, setNumeros ] = useState();
	const [ render, setRender ] = useState([]);

	useEffect(
		() => {
			if (productos.categoria === 'calzado') {
				setCategoria('calzado');
				setNumeros(productos.numeros);
				setRender(
					productos.numeros.map((numeros) => {
						return numeros.cantidad > 0 ? (
							<Button key={numeros._id} type="dashed" className="talla-vista-producto d-inline-block">
								{numeros.numero}
							</Button>
						) : (
							<Button
								key={numeros._id}
								type="dashed"
								disabled
								className="talla-vista-producto d-inline-block"
							>
								{numeros.numero}
							</Button>
						);
					})
				);
			} else if (productos.categoria === 'ropa') {
				setCategoria('ropa');
				setTallas(productos.tallas);
				setRender(
					productos.tallas.map((tallas) => {
						return tallas.cantidad > 0 ? (
							<Button key={tallas._id} type="dashed" className="talla-vista-producto d-inline-block">
								{tallas.talla}
							</Button>
						) : (
							<Button
								key={tallas._id}
								type="dashed"
								disabled
								className="talla-vista-producto d-inline-block"
							>
								{tallas.talla}
							</Button>
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

	return (
		<div>
			<Form>
				<Form.Item label="Cantidad">
					<InputNumber
						size="large"
						min={1}
						max={10}
						defaultValue={0}
						/* onChange={onChange} */
						style={{ width: 130 }}
					/>
				</Form.Item>
			</Form>
			<div>
				{categoria !== 'otros' ? <p className="mt-3">Tallas:</p> : <p />}
				<div>{render}</div>
			</div>
		</div>
	);
}
export default TallasCantidades;
