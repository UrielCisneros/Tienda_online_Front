import React from 'react';
import { Card, Col, Row, Pagination } from 'antd';

const { Meta } = Card;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function searchingFor(search) {
	return function(x) {
		return x.user.toLowerCase().includes(search.toLowerCase()) || !search;
	};
}

/* export default function Productos() { */
class Productos extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			search: '',
			fotos: [],
			isFetch: true
		};

		this.onchange = this.onchange.bind(this);
	}

	onchange = (e) => {
		this.setState({ search: e.target.value });
	};

	componentDidMount() {
		fetch('https://pixabay.com/api/?key=16739568-19a03185691a993c835c71d62&per_page=10')
			.then((response) => response.json())
			.then((fotosJson) => this.setState({ fotos: fotosJson.hits, isFetch: false }));
	}

	render() {
		console.log(this.state.fotos);
		const { search } = this.state;
		if (this.state.isFetch) {
			return 'loading...';
		}

		const render = this.state.fotos.filter(searchingFor(this.state.search)).map((foto) => (
			<Col span={32} key={foto.id}>
				<Card.Grid hoverable style={gridStyle}>
					<Card
						hoverable
						style={{ width: 240, height: 250 }}
						cover={<img alt="example" className="img-fluid" src={foto.webformatURL} />}
					>
						<Meta title={foto.user} description="www.instagram.com" />
					</Card>
				</Card.Grid>
			</Col>
		));

		return (
			<div>
				<h3 className="ml-5 mt-4 mb-4">Algunos de nuestros productos...</h3>
				<div className="container w-50 mb-5">
					<h5>Busca un producto en específico</h5>
					<form className="form-inline">
						<input
							className="form-control w-100"
							type="search"
							onChange={this.onchange}
							value={search}
							placeholder="buscar"
						/>
					</form>
				</div>
				<div className="d-flex justify-content-center align-items-center">
					<div className="site-card-wrapper">
						<Row gutter={24} style={{ maxWidth: '90vw' }}>
							{render}
						</Row>
					</div>
				</div>
				<div className="mt-5 mb-5 text-center">
					<Pagination defaultCurrent={1} total={500} />
				</div>
			</div>
		);
	}
}

export default Productos;
