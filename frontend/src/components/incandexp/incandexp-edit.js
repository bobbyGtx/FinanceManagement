import {UrlUtils} from "../../utils/url-utils";
import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";
import {ValidateUtils} from "../../utils/validate-utils";
import {OperationService} from "../../services/operation-service";
import {BalanceService} from "../../services/balance-service";

export class IncAndExpEdit{
    constructor(){
        this.params = UrlUtils.getQueryParams();
        this.categories=[];
        this.fields = [
            {
                name: 'type', //используем для передачи формы
                id: 'select-type',//id элемента формы
                element: null,
                valid: false,
                original:null,
            },
            {
                name: 'category_id', //используем для передачи формы
                id: 'select-category',//id элемента формы
                element: null,
                validation: {selectIndex: /^[1-9][0-9]*$/},
                valid: false,
                original:null,
            },
            {
                name: 'amount',
                id: 'amount',
                element: null,
                validation: {regex: /^[0-9]*[.,]?[0-9]+$/},
                valid: false,
                original:null,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                validation: {regex: /\d{4}-\d{2}-\d{2}/},//$3-$2-$1 замена (\d{2})\.(\d{2})\.(\d{4})
                valid: false,
                original:null,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                validation: {regex: /^[А-яA-z0-9]/},
                valid: false,
                original:null,
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
        if (!this.params.id){
            return document.location = '#/incandexp';
        }

        const originalData=await OperationService.getOperation(this.params.id);
        if (originalData.error){
            alert(originalData.errorMessage);
            return document.location = originalData.redirect;
        }
        await this.fillDatatoForm(originalData.response);

        this.selectTypeElement.addEventListener('change', this.getCategories.bind(this));
        this.btnActionElement.addEventListener('click', this.saveOperation.bind(this));

    }

    async getCategories() {
        const result = await CategoriesServices.getCategoriesList(config[this.selectTypeElement.value]);
        if (result.error) {
            alert(result.errorMessage);
            return result.redirect ? window.location = result.redirect : null;
        }
        this.categories=[];
        for (let i = this.selectCategoryElement.options.length-1; i >= 0; i--) {
            this.selectCategoryElement.removeChild(this.selectCategoryElement.children[i]);
        }
        result.categoryList.forEach(category => {
            this.selectCategoryElement.options[this.selectCategoryElement.options.length] = new Option(category.title, category.id);
            this.categories.push(category);
        });
        if (this.fields[1].original>=0 && this.fields[0].element.value===this.fields[0].original) {
            this.selectCategoryElement.value = this.fields[1].original;
        }
    }
    async fillDatatoForm(operation){
        this.fields[0].original=operation[this.fields[0].name]==='expense'?'expCategory':'incCategory';
        this.fields[0].element.value=operation[this.fields[0].name]==='expense'?'expCategory':'incCategory';
        await this.getCategories();
        const category=this.categories.find(category=>category.title===operation.category)
        this.fields[1].original=category.id;
        this.fields[1].element.value=category.id;
        for (let i = 2; i < this.fields.length; i++) {
            this.fields[i].element.value=operation[this.fields[i].name];
            this.fields[i].original=operation[this.fields[i].name];
        }
    }
    async saveOperation() {
        if (!ValidateUtils.validateForm(this.fields)) {
            return
        }
        let edited=false;
        let updateBalance=false;
        const requestData = {}
        //Обработка типа расход/доход
        if(this.fields[0].element.value!==this.fields[0].original){
            edited=true;
            updateBalance=true;
        }
        //обработка категории
        if(Number(this.fields[1].element.value)!==this.fields[1].original) {
            edited=true;
        }
        //Обработка поля amount
        let amount = this.fields[2].element.value.replace(/,/, '.');
        if (amount.includes('.') && amount.split('.')[1].length > 2) {
            amount = Number(amount).toFixed(2)
        } else {
            amount = Number(amount);
        }
        if (amount!==this.fields[2].original) {
            updateBalance=true;
            edited=true;
        }
        //Обработка поля Data
        if (this.fields[3].element.value!==this.fields[3].original) {
            edited=true;
        }
        //Обработка поля Komment
        if (this.fields[4].element.value!==this.fields[4].original) {
            edited=true;
        }
        if (!edited){//Если небыло изменений - просто выходим из редактирования
            return document.location = '#/incandexp';
        }
        requestData[this.fields[0].name] = config[this.fields[0].element.value].split('/')[1];
        requestData[this.fields[1].name] = Number(this.fields[1].element.value);
        requestData[this.fields[2].name] = amount;
        requestData[this.fields[3].name] = this.fields[3].element.value;
        requestData[this.fields[4].name] = this.fields[4].element.value;

        if (Object.keys(requestData).length===0){
          return document.location = '#/incandexp';
        }//Если изменений нет и нажата кнопка сохранить - просто выходим
        const result = await OperationService.editOperation(requestData,this.params.id);
        if (result.error) {
            result.errorMessage?alert(result.errorMessage):null;
            return result.redirect ? window.location = result.redirect : null;
        }
        updateBalance?BalanceService.refreshBalance().then():null;
        document.location = '#/incandexp';
    }
}