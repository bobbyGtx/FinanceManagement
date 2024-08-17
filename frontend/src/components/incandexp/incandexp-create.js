import {UrlUtils} from "../../utils/url-utils";
import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";
import {ValidateUtils} from "../../utils/validate-utils";
import {OperationService} from "../../services/operation-service";

export class IncAndExpCreate {
    constructor() {
        this.params = UrlUtils.getQueryParams().new;
        this.fields = [
            {
                name: 'type', //используем для передачи формы
                id: 'select-type',//id элемента формы
                element: null,
                valid: false,
            },
            {
                name: 'category_id', //используем для передачи формы
                id: 'select-category',//id элемента формы
                element: null,
                validation: {selectIndex: /^[1-9][0-9]*$/},
                valid: false,
            },
            {
                name: 'amount',
                id: 'amount',
                element: null,
                validation: {regex: /^[0-9]*[.,]?[0-9]+$/},
                valid: false,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                validation: {regex: /\d{4}-\d{2}-\d{2}/},//$3-$2-$1 замена (\d{2})\.(\d{2})\.(\d{4})
                valid: false,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                validation: {regex: /^[А-яA-z0-9]/},
                valid: false,
            },
        ];
        this.findElements();
        this.init().then();
    }

    findElements() {
        ValidateUtils.findElements(this.fields);
        this.selectTypeElement = this.fields[0].element;//document.getElementById('select-type');
        this.selectCategoryElement = this.fields[1].element;//document.getElementById('select-category');
        this.btnActionElement = document.getElementById("btnAction");
    }

    async init() {
        if (this.params) {
            this.selectTypeElement.value = this.params;
        }
        this.selectTypeElement.addEventListener('change', this.getCategories.bind(this));
        await this.getCategories();
        this.btnActionElement.addEventListener('click', this.saveOperation.bind(this));

    }

    async getCategories() {
        const result = await CategoriesServices.getCategoriesList(config[this.selectTypeElement.value]);
        if (result.error) {
            alert(result.errorMessage);
            return result.redirect ? window.location = result.redirect : null;
        }
        for (let i = this.selectCategoryElement.options.length-1; i > 0; i--) {
            this.selectCategoryElement.removeChild(this.selectCategoryElement.children[i]);
        }
        result.categoryList.forEach(category => {
            this.selectCategoryElement.options[this.selectCategoryElement.options.length] = new Option(category.title, category.id);
        });
    }

    async saveOperation() {
        if (!ValidateUtils.validateForm(this.fields)) {
            return
        }
        const requestData = {}
        requestData[this.fields[0].name] = config[this.fields[0].element.value].split('/')[1];
        requestData[this.fields[1].name] = Number(this.fields[1].element.value);

        let amount = this.fields[2].element.value.replace(/,/, '.');
        if (amount.includes('.') && amount.split('.')[1].length > 2) {
            amount = Number(amount).toFixed(2)
        } else {
            amount = Number(amount);
        }
        requestData[this.fields[2].name] = amount;
        requestData[this.fields[3].name] = this.fields[3].element.value;
        requestData[this.fields[4].name] = this.fields[4].element.value;

        const result = await OperationService.addOperation(requestData);
        if (result.error) {
            alert(result.errorMessage);
            return result.redirect ? window.location = result.redirect : null;
        }
        document.location = '#/incandexp';
    }

}