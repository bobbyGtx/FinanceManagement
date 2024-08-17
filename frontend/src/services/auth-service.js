import {HttpUtils} from "../utils/http-utils";
import {config} from "../config/config";
import {AuthUtils} from "../utils/auth-utils";
//В сервисах формируем запросы и обработку ошибок. Отправляем новый объект содержащий метку наличия ошибки, сообщение об ошибке, редирект и данные ответа от сервера

export class AuthService {

    static async login(data) {
        let returnObject = {
            error:false,
            errorMessage: null,
            response: null
        };
        if (!data || Object.keys(data).length === 0) {
            returnObject.error = true;
            returnObject.errorMessage = 'Ошибка обработки данных. Обратитесь в поддержку';
            return returnObject;
        }
        const result = await HttpUtils.request(config.URL.login, config.method.post,false, data);

        if (result.error || !result.response || result.response && (!result.response.tokens || !result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user || !result.response.user.id || !result.response.user.name)) {
            returnObject.error = true;
            result.errorMessage?returnObject.errorMessage=result.errorMessage:null;
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async register(data) {
        let returnObject = {
            error:false,
            errorMessage: null,
            response: null
        };
        if (!data || Object.keys(data).length === 0) {
            result.error = true;
            result.errorMessage = 'Ошибка обработки данных. Обратитесь в поддержку';
            return result;
        }
        const result = await HttpUtils.request(config.URL.register, config.method.post,false, data);

        if (result.error || !result.response || result.response && (!result.response.user || !result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName)) {
            returnObject.error = true;
            returnObject.errorMessage=result.errorMessage;
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async logout(){
        const body={
            refreshToken:AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        };
        await HttpUtils.request(config.URL.logout, config.method.post,true,body);
        AuthUtils.delAuthInfo();
        return document.location='#/login';
    }

}