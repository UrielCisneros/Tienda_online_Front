import React from 'react';
import { Card, Col, Row, Pagination } from 'antd';
import Ofertas from './ofertas';

const { Meta } = Card;

export default function Productos() {
	return (
		<div>
            <h3 className="mt-4 mb-2">Algunos de nuestros productos...</h3>
			<div className="d-flex justify-content-center align-items-center">
                <div className="site-card-wrapper">
                    <Row gutter={24}>
                        <Col span={32}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={
                                    <img
                                        alt="example"
                                        className="img-fluid"
                                        src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/db508dc5-5701-43b8-8579-4f522213584d_1.acc19e11e0cb8ef13757038ca2e30ed2.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"
                                    />
                                }
                            >
                                <Meta title="Europe Street beat" description="www.instagram.com" />
                            </Card>
                        </Col>
                        <Col span={32}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/1p/images/product-images/img_large/00085369967893l.jpg"
                                    />
                                }
                            >
                                <Meta title="Europe Street beat" description="www.instagram.com" />
                            </Card>
                        </Col>
                        <Col span={32}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/c9362d35-d6e1-43ba-97ea-f2fb668d5d4b_1.ee1922b090f811fc32adc8223e4454fd.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"
                                    />
                                }
                            >
                                <Meta title="Europe Street beat" description="www.instagram.com" />
                            </Card>
                        </Col>
                        <Col span={32}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/0519c732-977f-48d5-b8d5-08d27d41301d_1.9715121c2e9b6facb51307344dd0140d.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"
                                    />
                                }
                            >
                                <Meta title="Europe Street beat" description="www.instagram.com" />
                            </Card>
                        </Col>
                        <Col span={32}>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={
                                    <img
                                        alt="example"
                                        src="https://res.cloudinary.com/walmart-labs/image/upload/w_960,dpr_auto,f_auto,q_auto:best/mg/gm/3pp/asr/0519c732-977f-48d5-b8d5-08d27d41301d_1.9715121c2e9b6facb51307344dd0140d.jpeg?odnHeight=2000&odnWidth=2000&odnBg=ffffff"
                                    />
                                }
                            >
                                <Meta title="Europe Street beat" description="www.instagram.com" />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="mt-5 mb-5 text-center">
                <Pagination defaultCurrent={6} total={500} />
            </div>
		</div>
	);
}
