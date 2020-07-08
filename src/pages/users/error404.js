import React from 'react'
import { FileUnknownOutlined, FrownOutlined } from '@ant-design/icons';

export default function Error404 () {
    return (
        <div className="text-center">
            <FileUnknownOutlined style={{fontSize: "15rem"}} className="mb-5" />
            <h4>Error 404</h4>
            <h2>Lo siento, la pagina no existe</h2>
            <FrownOutlined style={{fontSize: "5rem"}} className="mb-5" />
        </div>
    )
}