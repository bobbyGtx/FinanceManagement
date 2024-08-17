import {HttpUtils} from "../utils/http-utils";
import {config} from "../config/config";

export class BalanceService {
    static async getBalance() {
        const returnObject = {
            error: false,
            errorMessage: null,
            redirect: null,
            response: null
        };
        const result=await HttpUtils.request(config.URL.balance,config.method.get);
        if (result.redirect || !result.response || result.errorMessage||(result.response && isNaN(parseInt(result.response.balance)))) {
            result.redirect?returnObject.redirect= result.redirect:null;
            result.errorMessage?returnObject.errorMessage=result.errorMessage:null;
            returnObject.error = "Возникла ошибка при запросе баланса. Обратитесь в поддержку";
            return returnObject;
        }
        returnObject.response = result.response.balance;
        return returnObject;
    }

    static async refreshBalance(){
        const sbUserMoneyElement =document.getElementById('sb-user-money');
        const nbUserMoneyElement =document.getElementById('nb-user-money');
        if (!sbUserMoneyElement || !nbUserMoneyElement){
            console.warn('Невозможно обновить баланс. Ошибка на странице');
            return
        }
        HttpUtils.request(config.URL.balance,config.method.get).then(result=>{
            if (result.error || result.redirect || (result.response && isNaN(parseInt(result.response.balance)))) {
                console.warn('Невозможно обновить баланс.' + result.errorMessage ? result.errorMessage : null);
                return
            }
            sbUserMoneyElement?sbUserMoneyElement.innerText = result.response.balance:null;
            nbUserMoneyElement?nbUserMoneyElement.innerText = result.response.balance:null;
            });
    } //Фоновое асинхронное информации о балансе пользователя

    static async setBalance(amount){
        if (!amount){
            return
        }
        const sbUserMoneyElement =document.getElementById('sb-user-money');
        const nbUserMoneyElement =document.getElementById('nb-user-money');
        if (!sbUserMoneyElement || !nbUserMoneyElement){
            console.warn('Невозможно обновить баланс. Ошибка на странице');
            return
        }

        HttpUtils.request(config.URL.balance,config.method.put,true,{newBalance:amount}).then(result=>{
            if (result.error || result.redirect || (result.response && isNaN(parseInt(result.response.balance)))) {
                console.warn('Невозможно обновить баланс.' + result.errorMessage ? result.errorMessage : null);
                return
            }
            sbUserMoneyElement?sbUserMoneyElement.innerText = result.response.balance:null;
            nbUserMoneyElement?nbUserMoneyElement.innerText = result.response.balance:null;
        });
    }
}