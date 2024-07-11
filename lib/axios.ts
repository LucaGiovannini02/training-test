import axios from "axios";

const API = axios.create({
    url: "http://localhost:3000"
})

export default API