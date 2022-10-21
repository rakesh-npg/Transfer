// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetCustValidator from 'App/Validators/Customer/GetCustValidator'
import { CustomersRepo } from 'App/Repositories';
const { Parser } = require('json2csv');
const fs = require("fs");


export default class CustomersController {
    public async customerExcel({request, response}:HttpContextContract) {
        let baseUrl = "https://dev-cmp-business-1xhp7nh4.nw.gateway.dev/"
        let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY2NjM1ODAyNCwiZXhwIjoxNjY2MzYxNjI0LCJpc3MiOiJjbXAtZGV2LWlkZW50aXR5LXVzZXJAcHJvamVjdC1jbXAtZGV2LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiY21wLWRldi1pZGVudGl0eS11c2VyQHByb2plY3QtY21wLWRldi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6ImNHOGtNVDhPQk1jVWx5OUxqVExxNmFRejlXbDIiLCJjbGFpbXMiOnsibmFtZSI6IkNtcC1ib3QiLCJlbWFpbCI6ImNtcC1ib3RAbmdwd2Vic21hcnQuY29tIiwicm9sZXMiOltdfX0.E8cEAmzTg66whtiYxGFromc3tvmHhLB4vkUyBUBGo2IgvmrAy4Wzyls8Nmun2QvNHDNC314dkAQFMYAVvrDKeNjgFuVf85yaoFqFYVHrHavr-vdBr-9VHC28xj8_qUhJBlvKzzuvvKknWkS-MJKXs6VAmrx9edZJse_fhgu0DXQXAOn1is1jYQWsDTWWYwwcMdBXE2ue0yNtjTEDe7uVqARRkvFt-mh3QYBbvdRw-3grn20btJ8N95fhPWrO-5APb8EJOmlYak5mtpeG560h7n3T8r5M4eHDyjsHDMIV_iTk_s6e4K6MdT7hRj6Tyl7Ue0SVANk3CcqZS3QpKVCVlg"
        let payload = await request.validate(GetCustValidator)
        let data = await CustomersRepo.getCustomerData(baseUrl, token, payload)

        if(data.data.data.length != 0 && data.data.success)  {
            data = data.data
            const fields = [    
                {label:'id',value:'id'},
                {label:'name', value: 'name'}, 
                {label:'userCount', value:'usersCount'}, 
                {label:'sitesCount', value:'counts.sitesCount'}, 
                {label:'name', value:'country.name'}, 
                {label:'isngpdevice', value:'isngpdevice'} 
            ]
            const opts = {fields}
            const parser = new Parser(opts)
            const csv = parser.parse(data.data)
            fs.writeFileSync('customerExcel.csv', csv)
            response.attachment('customerExcel.csv')
        }
        else{
            return data

        }
    }

}
