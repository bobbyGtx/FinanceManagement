import {HttpUtils} from "../utils/http-utils";
import {config} from "../config/config";
import {BalanceService} from "./balance-service";

export class OperationService {
    static async getOperationsList(period, userInterval = null) {
        const returnObject = {
            error: false,
            errorMessage:null,
            redirect: null,
            categoryList: null
        };
        let requestURL = `${config.URL.operations}?period=${period}`;
        if (period === 'interval') {
            if (userInterval && Object.keys(userInterval).length > 0 && userInterval.startDate && userInterval.endDate) {
                requestURL += `&dateFrom=${userInterval.startDate}&dateTo=${userInterval.endDate}`;
            }else{
                returnObject.error = true;
                returnObject.errorMessage = 'Ошибка! Отсутствуют(ет) даты интервала';
                return returnObject;
            }
        }
        const result = await HttpUtils.request(requestURL, config.method.get);
        if (result.error || result.redirect || !result.response || result.response && !Array.isArray(result.response)) {
            returnObject.error = true;
            if (result.errorMessage) {
                returnObject.errorMessage = result.errorMessage;
            } else {
                returnObject.errorMessage = 'Возникла ошибка, попробуйте повторить запрос. Если ошибка повториться - обратитесь в поддержку.';
            }
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.operationsList = result.response;
        return returnObject;
    }

    static async addOperation(data) {
        const returnObject = {
            error: false,
            redirect: null,
            response: null
        };
        const result = await HttpUtils.request(config.URL.operations, config.method.post, true, data);
        if (result.error) {
            returnObject.error = true;
            returnObject.errorMessage = result.errorMessage === 'This record already exists' ? 'Ошибка! Такая запись уже существует.' : result.errorMessage;
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.response = result.response;
        BalanceService.refreshBalance().then();
        return returnObject;

    }

    static async getOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            response: null
        };
        if (!id) {
            returnObject.error = true;
            returnObject.redirect = '#/incandexp';
            return returnObject;
        }
        const result = await HttpUtils.request(config.URL.operations + `/${id}`, config.method.get);
        if (result.error || result.redirect || !result.response || result.response && (!result.response.id || !result.response.type || !result.response.amount || !result.response.date || !result.response.comment || !result.response.category)) {
            returnObject.error = true;
            returnObject.errorMessage = result.errorMessage === 'Not found' ? 'Ошибка! Такой записи не найдено.' : result.errorMessage;
            result.redirect ? returnObject.redirect = result.redirect : returnObject.redirect = '#/incandexp';
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;

    }

    static async editOperation(data, id) {
        const returnObject = {
            error: false,
            redirect: null,
            response: null
        };
        if (!id || !data || Object.keys(data).length === 0) {
            returnObject.error = true;
            returnObject.errorMessage('Возникла ошибка при подготовке данных к отправке! Повторите попытку еще раз');
            returnObject.redirect = '#/incandexp';
            return returnObject;
        }
        const result = await HttpUtils.request(config.URL.operations + `/${id}`, config.method.put, true, data);
        if (result.error || result.redirect || !result.response || (result.response && result.response.error)) {
            returnObject.error = true;
            result.errorMessage ? returnObject.errorMessage = result.errorMessage : null;
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;

    }

    static async deleteOperation(id) {
        const returnObject = {
            error: false,
            redirect: null,
            response: null
        };
        if (!id) {
            returnObject.error = true;
            returnObject.redirect = '#/incandexp';
            return returnObject;
        }
        const result = await HttpUtils.request(config.URL.operations + `/${id}`, config.method.del);
        if (result.error || result.redirect || !result.response || result.response && result.response.error) {
            returnObject.error = true;
            result.errorMessage ? returnObject.errorMessage = result.errorMessage : null;
            result.redirect ? returnObject.redirect = result.redirect : returnObject.redirect = '#/incandexp';
            return returnObject;
        }
        returnObject.response = result.response;
        BalanceService.refreshBalance().then();
        return returnObject;

    }
}