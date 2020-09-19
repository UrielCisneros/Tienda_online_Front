import React from 'react'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { Button,Form } from 'antd';

import {CardElement,useStripe,useElements} from '@stripe/react-stripe-js';

export default function Verificacion_Tarjeta(props) {

    const {setIdPago,prev,setCurrent,current} = props;
    const stripePromise = loadStripe('pk_test_51HSsW6EfBIdXK7zjZWtgTBxFdNPEFBGjLuEyDzXOV0ioU2ioEroyct2vkAbTvLjJhiSfgCLrc374gjqp1xEO7yCq00bq3GftdJ');

    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutForm prev={prev} setCurrent={setCurrent} current={current} />
            </Elements>
        </div>
    )
}

const CheckoutForm  = (props) => {

    const {prev,setCurrent,current} = props;
    const stripe = useStripe();
    const elements = useElements();

    const handlerSubmit = async (e) => {
        e.preventDefault();
    
        const {error,paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        
    }

    return(
        <div>
            <form onSubmit={handlerSubmit} className="p-3" style={{width:"600px",margin:"0 auto"}}>
                <CardElement />
                <div className="steps-action d-flex justify-content-center align-items-center">
                    <button style={{ margin: '0 8px' }} onClick={prev} className="btn btn-primary">
                        Atras
                    </button>
                    <button type="submit" className="btn btn-primary" onClick={() => {
                        setCurrent(current + 1);
                    }} >
                        Siguiente
                    </button>
                </div>
            </form>
        </div>
    )
}
