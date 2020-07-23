import React, { Component } from 'react';
import { Spin as Spinner } from 'antd';
import './spin.scss';

export default class Spin extends Component {
    render() {
        return (
                <div className="spin">
                    <div>
                        <Spinner size="large" tip="Loading..." className="spin__verticalCenter"/>
                    </div>
                </div>
        )
    }
}
