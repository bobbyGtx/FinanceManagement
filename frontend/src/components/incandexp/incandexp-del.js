import {UrlUtils} from "../../utils/url-utils";
import {OperationService} from "../../services/operation-service";

export class IncAndExpDel {
    constructor() {
        this.id = UrlUtils.getQueryParams().id;
        if (!this.id){
            alert('Удаление невозможно. Не найден идентификатор');
            return document.location = '#/incandexp';
        }

        this.delOperation(this.id).then();
    }

    async delOperation(id){
        const result=await OperationService.deleteOperation(id);
        if (result.error) {
            result.errorMessage?alert(result.errorMessage):null;
            return result.redirect ? document.location = result.redirect : document.location = '#/incandexp';
        }
        return document.location = '#/incandexp';
    }
}