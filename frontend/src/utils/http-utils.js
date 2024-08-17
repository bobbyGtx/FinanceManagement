import {AuthUtils} from "./auth-utils";
import {config} from "../config/config";

export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {
        let result = {
            error: false,
            errorMessage: null,
            redirect: null,
            response: null,
        };
        const requestParams = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                requestParams.headers[config.tokenHeader] = token;
            }
        }

        if (body && Object.keys(body).length > 0) {
            requestParams.body = JSON.stringify(body);
        }
        let response = null;
        try {
            response = await fetch(url, requestParams);
        } catch (error) {
            result.error = true;
            result.errorMessage = 'Ошибка во время выполнения запроса:' + error + '! Обратитесь в поддержку!';
            return result;
        }//запрос
        try {
            result.response = await response.json();
        } catch (error) {
            result.error = true;
            result.errorMessage = 'Ошибка во время обработки ответа:' + response.status + ': ' + error + '! Обратитесь в поддержку!';
            return result;
        }//обработка ответа

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                if (useAuth) {//Если есть аутентификация в параметрах - то 401 говорит о неверном accessToken
                    if (token) {//Если токкен есть - то его нужно обновить
                        if (await AuthUtils.updateRefreshToken()) {
                            return this.request(url, method, useAuth, body);
                        } else {
                            result.errorMessage = 'Ошибка аутентификации. Войдите в систему повторно!';
                            AuthUtils.delAuthInfo();
                            return result.redirect = '#/login';
                        }
                    } else {//если токена нет - чистим данные и выходим на авторизацию
                        AuthUtils.delAuthInfo();
                        result.redirect = '#/login';
                    }
                } else {//Если код 401 и нет аутентификации - то это был запрос логина, и получили ошибку логина-пароля
                    result.errorMessage = 'Неверный email или пароль!';
                }
            } else if (response.status === 400) {
                if (useAuth && result.response && result.response.error) { //В случае ошибки 400 bad request берем сообщение с сервера

                    result.errorMessage = result.response.message ? result.response.message==='All parameters should be passed'?'На сервер переданы не все данные. Обратитесь в поддержку':result.response.message : 'Пришел ответ ошибки с сервера';
                } else {
                    result.errorMessage = result.response.message === 'User with given email already exist' ? 'Пользователь с указанным email уже зарегистрирован!' : result.response.message;
                }
            } else if(response.status === 404){
                result.errorMessage = result.response.message === 'Not found' ? 'Ошибка. Запись не найдена' : result.response.message;
            } else{
                result.errorMessage = 'Возникла непредвиденная ошибка. Обратитесь в поддержку';
                console.error(result.response.message);
            }
            result.error = true;
        }//Блок обработки ошибок в ответе

        return result;
    }
}