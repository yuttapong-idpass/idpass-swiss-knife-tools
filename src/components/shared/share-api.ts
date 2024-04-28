import http from "../shared/http-common";



class sharedService { 
    public getAllProvince(): any { 
        return http.get<any>('/kongvut/thai-province-data/master/api_province.json');    
    }


    public getAllAmphure(): any { 
        return http.get<any>('/kongvut/thai-province-data/master/api_amphure.json');
    }


    public getAllTumbol(): any { 
        return http.get<any>('/kongvut/thai-province-data/master/api_tambon.json');
    }

    public getIpAddress(): any {
        return http.get<any>('https://api.ipify.org?format=json');
    }



}



export default new sharedService();


