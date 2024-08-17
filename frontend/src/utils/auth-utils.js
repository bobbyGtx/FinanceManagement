import {config} from "../config/config";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static userFIO='userFIO';
    static userId='userId';

    static setAuthInfoLogin(accessToken, refreshToken, userInfo, rememberMe=false) {
        if (rememberMe) {
            localStorage.setItem(this.accessTokenKey, accessToken);
            localStorage.setItem(this.refreshTokenKey, refreshToken);
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
            localStorage.setItem(this.userFIO, `${userInfo.name} ${userInfo.lastName}`);
            localStorage.setItem(this.userId, userInfo.id);


        } else {
            sessionStorage.setItem(this.accessTokenKey, accessToken);
            sessionStorage.setItem(this.refreshTokenKey, refreshToken);
            sessionStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
            sessionStorage.setItem(this.userFIO, `${userInfo.name} ${userInfo.lastName}`);
            sessionStorage.setItem(this.userId, userInfo.id);
        }
    }

    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        const rememberMe = localStorage.getItem(this.accessTokenKey);
        if (rememberMe) {
            localStorage.setItem(this.accessTokenKey, accessToken);
            localStorage.setItem(this.refreshTokenKey, refreshToken);
            if (userInfo) {
                localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
                localStorage.setItem(this.userFIO, `${userInfo.name} ${userInfo.lastName}`);
                localStorage.setItem(this.userId, userInfo.id);
            }
        } else {
            sessionStorage.setItem(this.accessTokenKey, accessToken);
            sessionStorage.setItem(this.refreshTokenKey, refreshToken);
            if (userInfo) {
                sessionStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
                sessionStorage.setItem(this.userFIO, `${userInfo.name} ${userInfo.lastName}`);
                sessionStorage.setItem(this.userId, userInfo.id);
            }
        }
    }

    static delAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
        localStorage.removeItem(this.userFIO);
        localStorage.removeItem(this.userId);
        sessionStorage.removeItem(this.accessTokenKey);
        sessionStorage.removeItem(this.refreshTokenKey);
        sessionStorage.removeItem(this.userInfoKey);
        sessionStorage.removeItem(this.userFIO);
        sessionStorage.removeItem(this.userId);
    }

    static getAuthInfo(key=null){

        const rememberMe = localStorage.getItem(this.accessTokenKey);

        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey,this.userFIO,this.userId].includes(key)){
            if (rememberMe) {
                return localStorage.getItem(key);
            }else{
                return sessionStorage.getItem(key);
            }
        }
        if (rememberMe) {
            return{
                [this.accessTokenKey]:localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]:localStorage.getItem(this.refreshTokenKey),
                [this.userFIO]:localStorage.getItem(this.userFIO),
                [this.userId]:localStorage.getItem(this.userId),
                [this.userInfoKey]:JSON.parse(localStorage.getItem(this.userInfoKey)),
            }
        } else {
            return{
                [this.accessTokenKey]:sessionStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]:sessionStorage.getItem(this.refreshTokenKey),
                [this.userFIO]:sessionStorage.getItem(this.userFIO),
                [this.userId]:sessionStorage.getItem(this.userId),
                [this.userInfoKey]:JSON.parse(sessionStorage.getItem(this.userInfoKey)),
            }
        }
    }

    static async updateRefreshToken(){
        const refreshToken=this.getAuthInfo(this.refreshTokenKey);
        let result=false;
        if (refreshToken){
            const response = await fetch(config.URL.refresh,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response.status === 200){
                const tokens = await response.json();

                if (tokens && !tokens.error)
                 this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                result=true;
            }
        }
        if (!result){
            this.delAuthInfo();
            console.warn('Ошибка обновления refreshTokena');//Удалить после теста
        }
        return result;
    }
}