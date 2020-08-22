import React from 'react';
import { Link } from 'react-router-dom';

import { Card } from 'antd';

const { Meta } = Card;

const Sugerencia = () => {
	return (
		<div className="row">
			<div className="col-lg-8">
				<p className="my-3 text-center titulos-vista-productos">¡Llevalos juntos!</p>
				<div className="row" style={{ justifyContent: 'center' }}>
					<div className="d-lg-flex d-sm-block px-5">
						<div className="d-sm-block">
							<Card
								className="shadow"
								style={{ width: 250 }}
								cover={
									<div
										className="d-flex justify-content-center align-items-center"
										style={{ height: 200 }}
									>
										<img
											className="imagen-producto-sugerencia"
											alt="producto actual"
											/* src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`} */
											src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
										/>
									</div>
								}
							>
								<Meta title="holi" />
							</Card>
						</div>
						<div className="d-lg-flex justify-content-center align-items-center d-sm-block">
							<p className="display-1 text-center">+</p>
						</div>
						<div className="d-sm-block">
							<Card
								className="shadow"
								style={{ width: 250 }}
								cover={
									<div
										className="d-flex justify-content-center align-items-center"
										style={{ height: 200 }}
									>
										<img
											className="imagen-producto-sugerencia"
											alt="producto actual"
											/* src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`} */
											src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
										/>
									</div>
								}
							>
								<Meta title="holi" />
							</Card>
						</div>
					</div>
					<div className="d-flex justify-content-center align-items-center mt-3">
						<p className="titulos-vista-productos"> Precio total: $10,200</p>
					</div>
				</div>
			</div>
			<div className="col-lg-4">
				<p className="titulos-vista-productos">Publicidades No Pagadas</p>
			</div>
		</div>
	);
};

export default Sugerencia;
