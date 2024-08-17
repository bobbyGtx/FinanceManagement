import {ValidateUtils} from "../../utils/validate-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";

export class IncomingsEdit {
    constructor(operation) {
        this.OrigData = {};
        this.operation = operation;
        this.fields =
            [
                {
                    name: 'title',
                    id: 'title',
                    element: null,
                    validation: {regex: /^[А-яA-z]/},
                    valid: false,
                }
            ];
        this.findElements();
        if (this.operation === 'edit') {
            this.fillElements();
        }
        this.btnActionElement.addEventListener('click', this.actionRecord.bind(this));
        this.fields[0].element.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.btnActionElement.click();
            } else if(e.key === 'Escape') {
                this.btnCancelElement.click();
            }
        }
        this.fields[0].element.focus();
    }

    findElements() {
        this.fields = ValidateUtils.findElements(this.fields);
        this.btnActionElement = document.getElementById("btn-action");
        this.btnCancelElement = document.getElementById("btn-cancel");
        this.pageHeader=document.getElementById("page-header");
    }

    async fillElements() {
        this.OrigData = UrlUtils.getQueryParams();
        if (!this.OrigData || !this.OrigData.id){
            return document.location = '#/incomings';
        }else if(!this.OrigData.title && this.OrigData.id){
            await this.fillDataFromServer(this.OrigData.id);
        }else{
            this.fields[0].element.value = this.OrigData.title;
            document.location.hash=document.location.hash.split('&')[0];
        }
        this.pageHeader.innerText='Редактирование категории расходов';
        this.btnActionElement.innerText='Сохранить';
    }
    async fillDataFromServer(id){
        const result = await CategoriesServices.getCategory(config.incCategory,id);
        if (result.error){
            result.errorMessage?alert(result.errorMessage):alert('Возникла ошибка после запроса на сервер. Обратитесь в поддержку');
            return result.redirect ? document.location = result.redirect : document.location= '#/incomings';
        }
        this.fields[0].element.value = result.category.title;
    }
    async actionRecord() {
        if (!ValidateUtils.validateForm(this.fields)) {
            return
        }
        const requestData = {};
        if (this.operation === 'edit' && this.OrigData.title !== this.fields[0].element.value) {
            requestData[this.fields[0].name] = this.fields[0].element.value;
            requestData.id = this.OrigData.id;
        } else {
            requestData[this.fields[0].name] = this.fields[0].element.value;
        }
        let result = null;

        if (this.operation === 'edit') {
            if (Object.keys(requestData).length === 0){
                return
            }else{
                result = await CategoriesServices.editCategory(config.incCategory,requestData);
            }
        }else{
            result=await CategoriesServices.addCategory(config.incCategory,requestData);
        }

        if (result.error) {
            alert(result.errorMessage);
            return result.redirect ? document.location = result.redirect : null;
        }
        return document.location = '#/incomings';
    }
}