import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api/state' })

const login = async (password) => {
  const {
    data: { msg }
  } = await instance.get('/login', { params: { password } })

  return msg
}

export {login}