import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { AxiosService } from 'App/Services/Axios'
import GetCustValidator from 'App/Validators/Customer/GetCustValidator'
import axios from 'axios'
const { Parser } = require('json2csv');
const fs = require("fs");
export default class GetCustsController {
    public async customerExcel({request, response}:HttpContextContract) {
        let paylaod: any = await request.validate(GetCustValidator)     
        let baseUrl = 'https://dev-cmp-business-1xhp7nh4.nw.gateway.dev'
        const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY2NjE4Njk0OCwiZXhwIjoxNjY2MTkwNTQ4LCJpc3MiOiJjbXAtZGV2LWlkZW50aXR5LXVzZXJAcHJvamVjdC1jbXAtZGV2LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiY21wLWRldi1pZGVudGl0eS11c2VyQHByb2plY3QtY21wLWRldi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6ImNHOGtNVDhPQk1jVWx5OUxqVExxNmFRejlXbDIiLCJjbGFpbXMiOnsibmFtZSI6IkNtcC1ib3QiLCJlbWFpbCI6ImNtcC1ib3RAbmdwd2Vic21hcnQuY29tIiwicm9sZXMiOltdfX0.aprPLcruJWpcopq8WHxyf7h7M2pU9mbgZT0rbJFvgOeb7a8uMLqUMXPoKGWdPSg1FeroMf5VXr5cqsVPZLsmlKBq9opL66vbmjQKhBPbgvIZ59sgmQBNWGj0kZ1jROPvOEIFI9qcTtt9Yeu7hDEgr7kSh1iNjBMIhwA_Smm18S7iOwZF8F8591aBSssT8YF-cVssJnWAItoy--3ks3z2CPbXYw75L5oozxxD4gxTN1pSNKSTOTFVbz0DSM0NyaR2kidqrk7-zDj_XvpdzdZIjT9xNpmzOSvsnWVjJr23zZHB4b_F18-17eOQmygrlOwWsX-zJBig3yJqS1iU7iVleQ'
        const config = {
            headers: { Authorization: `Bearer ${token}` }, 
            params: {}
        };
        const fields = ['id', 'name', 'userCount', 'counts.sitesCount', 'country.name', 'isngpdevice']
        const opts = {fields}
        let data = await axios.get(`${baseUrl}/cmp-bo/api/v1/customers`, config)
        const parser = new Parser(opts)
        const csv = parser.parse(data.data.data)
        // const writeStream = fs.createReadStream(csv) 
        // response.stream(writeStream)
        //return data.data.data
        fs.writeFileSync('data.csv', csv)
        response.attachment('data.csv')
     
        
    }   
}