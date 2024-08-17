import {UrlUtils} from "../../utils/url-utils";
import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";

export class ExpensesDel {
    constructor() {
        this.expenseOrigData = UrlUtils.getQueryParams();

        if (!this.expenseOrigData || !this.expenseOrigData.id){
            alert('Ошибка получения идентификатора записи. Удаление не сработало.')
            return document.location = '#/expenses';
        }

        this.delExpenseCategory(this.expenseOrigData.id).then();

    }
    async delExpenseCategory(id){
        const result=await CategoriesServices.deleteCategory(config.expCategory,id);
        if (result.error) {
            result.errorMessage?alert(result.errorMessage):null;
            return result.redirect ? document.location = result.redirect : document.location = '#/expenses';
        }
        return document.location = '#/expenses';
    }


}