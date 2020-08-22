import axios from 'axios'

const clienteAxios = axios.create({
    baseURL : 'http://tiendaab.herokuapp.com/api'
})

export default clienteAxios