import axios from 'axios';

const {SAGA_TOOL_API_HOST, SAGA_TOOL_API_AUTH_KEY} = process.env;

class ApiRequest{
    protected instance: any;

    constructor(){
        this.instance = axios.create({
            baseURL: SAGA_TOOL_API_HOST,
            timeout: 1000,
            headers: {
                'apiKey': SAGA_TOOL_API_AUTH_KEY,
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        });
    }


    public async get(url:string, param: object){
        return this.instance.get(url, {params:param});
    }
}

export default new ApiRequest();