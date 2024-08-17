import {UrlUtils} from "../../utils/url-utils";
import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";

export class IncomingsDel {
    constructor() {
        this.incomingOrigData = UrlUtils.getQueryParams();
        if (!this.incomingOrigData || !this.incomingOrigData.id){
            alert('Ошибка получения идентификатора записи. Удаление не сработало.')
            return document.location = '#/incomings';
        }

        this.delIncomingCategory(this.incomingOrigData.id).then();

    }
    async delIncomingCategory(id){
        const result=await CategoriesServices.deleteCategory(config.incCategory,id);
        if (result.error) {
            alert(result.errorMessage);
            return result.redirect ? document.location = result.redirect : null;
        }
        return document.location = '#/incomings';
    }
}