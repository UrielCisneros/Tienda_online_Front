import React from 'react'
import {Helmet} from "react-helmet";


export default function Admin() {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Panel Principal</title>
            </Helmet>
            <h1>Estamos en admin home</h1>
        </div>
    )
}
