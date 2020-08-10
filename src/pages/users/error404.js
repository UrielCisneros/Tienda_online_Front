import React from 'react'
import { Result, Button } from 'antd';
import {Link} from 'react-router-dom';

export default function Error404 () {
    return (
        <Result
        status="404"
        title="404"
        subTitle="Ups, Parece que esta pagina no existe."
      />
    )
}