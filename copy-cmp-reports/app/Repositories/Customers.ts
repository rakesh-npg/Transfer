import { CmpBo } from 'App/Services'

class Customers{
    public async getCustomerData(baseUrl:string, token: string,payload){
        const config = {
                headers: { Authorization: `Bearer ${token}`} , 
                params: {"customerIds[]": payload.id, 
                'offset':  payload.offset, 
                'limit': payload.limit,
                'regex': payload.regex,
                'filter': payload.filter,  
                'orderbyColumn': payload.orderbyColumn, 
                'orderbyValue': payload.orderbyValue,
            }
        }
         let maybeData = await CmpBo.CustomerAxios.getData(baseUrl, config)
         return maybeData
    }
}
export default new Customers() 