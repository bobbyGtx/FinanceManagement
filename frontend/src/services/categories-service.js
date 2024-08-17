import {HttpUtils} from "../utils/http-utils";
import {config} from "../config/config";
import {BalanceService} from "./balance-service";

export class CategoriesServices {
    static async getCategoriesList(category) {
        const returnObject = {
            error: false,
            redirect: null,
            categoryList: null
        };
        const result = await HttpUtils.request(config.URL.categories + category, config.method.get);

        if (result.error || result.redirect || !result.response || !Array.isArray(result.response)) {
            returnObject.error = true;
            if (result.errorMessage) {
                returnObject.errorMessage = result.errorMessage;
            } else {
                returnObject.errorMessage = 'Возникла ошибка, попробуйте перелогиниться. Если ошибка повториться - обратитесь в поддержку.';
            }
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.categoryList = result.response;
        return returnObject;
    }

    static async getCategory(category, id) {
        const returnObject = {
            error: false,
            errorMessage: null,
            redirect: null,
            category: null
        };
        const result = await HttpUtils.request(config.URL.categories + category + `/${id}`, config.method.get);

        if (result.error || result.redirect || !result.response || result.response && (result.response.error || !result.response.id || !result.response.title)) {
            returnObject.error = true;
            result.errorMessage? returnObject.errorMessage = result.errorMessage:returnObject.errorMessage = 'Возникла ошибка, попробуйте перелогиниться. Если ошибка повториться - обратитесь в поддержку.';
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.category = result.response;
        return returnObject;
    }

    static async addCategory(category, data) {
        const returnObject = {
            error: false,
            errorMessage: null,
            redirect: null,
        };
        if (!data || Object.keys(data).length === 0) {
            returnObject.error = true;
            returnObject.errorMessage = 'Ошибка в данных. Заполните поле и повторите операцию.';
            return returnObject;
        }

        const result = await HttpUtils.request(config.URL.categories + category, config.method.post, true, data);

        if (result.error || result.redirect || !result.response || result.response && (!result.response.id || !result.response.title)) {
            returnObject.error = true;
            if (result.errorMessage) {
                result.errorMessage === 'This record already exists' ? returnObject.errorMessage = 'Такая категория уже существует' : null;
            } else {
                returnObject.errorMessage = 'Ошибка при выполнении/обработке запроса. Попробуйте повторить операцию.';
            }

            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async editCategory(category, data) {
        const returnObject = {
            error: false,
            errorMessage: null,
            redirect: null,
        };
        if (!data || Object.keys(data).length === 0) {
            returnObject.error = true;
            returnObject.errorMessage = 'Ошибка в данных. Заполните поле и повторите операцию.';
            return returnObject;
        }

        const result = await HttpUtils.request(config.URL.categories + category + '/' + data.id, config.method.put, true, data);

        if (result.error || result.redirect || !result.response || result.response && (!result.response.id || !result.response.title)) {
            returnObject.error = true;
            result.errorMessage ? returnObject.errorMessage = result.errorMessage : returnObject.errorMessage = 'Ошибка при выполнении/обработке запроса. Попробуйте повторить операцию.';
            result.redirect ? returnObject.redirect = result.redirect : null;
            console.warn(result);
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async deleteCategory(category, id) {
        const returnObject = {
            error: false,
            errorMessage: null,
            redirect: null,
        };
        if (!id) {
            returnObject.error = true;
            returnObject.errorMessage = 'Ошибка в данных. Нет идентификатора категории для удаления.';
            return returnObject;
        }

        const result = await HttpUtils.request(config.URL.categories + category + '/' + id, config.method.del, true);

        if (result.error || result.redirect || !result.response || result.response && result.response.error) {
            returnObject.error = true;
            result.errorMessage ? returnObject.errorMessage = result.errorMessage : returnObject.errorMessage = result.response.errorMessage;
            result.redirect ? returnObject.redirect = result.redirect : null;
            return returnObject;
        }
        returnObject.response = result.response;
        result.errorMessage ? returnObject.errorMessage = result.errorMessage : null;
        result.redirect ? returnObject.redirect = result.redirect : null;
        BalanceService.refreshBalance().then();
        return returnObject;
    }

}