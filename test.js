import axios from 'axios'

import dns from "dns";

// axios.request({
//     url:"http://[2407:3740:0:301::c]/"
// }).then(res=>{
//     console.log(res)
// })
//
// dns.resolve("api.cloudflare.com", (err, address) => {
//     console.log(address);
// })

import {http} from '@certd/basic'
http.request({
    url:"https://api.cloudflare.com"
}).then(res=>{
    console.log(res)
})
