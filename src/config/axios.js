import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : "https://tienda-prueba-back.herokuapp.com/api"
})

export default clienteAxios