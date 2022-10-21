import { CmpBo } from 'App/Services'

class Customers{
    public async getSitesData(url: string, token: string, payload){
        const config = {
                headers: { Authorization: `Bearer ${token}`} , 
                params: {"customerId[]": payload.customerId,
                'userId[]': payload.userId,  
                'offset':  payload.offset, 
                'limit': payload.limit,
                'regex': payload.regex,
                'filter': payload.filter,  
                'orderbyColumn': payload.orderbyColumn, 
                'orderbyValue': payload.orderbyValue,
            }
        }
         let maybeData = await CmpBo.SitesAxios.getData(url, config)
         return maybeData
    }
}
export default new Customers() 