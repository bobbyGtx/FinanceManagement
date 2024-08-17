import {ValidateUtils} from "../../utils/validate-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";


export class Register {
    constructor() {
        this.fields = [
            {
                name: 'fullName', //используем для передачи формы
                id: 'full-name',//id элемента формы
                element: null,
                validation: {regex: /^[А-Я][а-я]*(?:\s[А-Я][а-я]*)+$/},
                valid: false,
            },
            {
                name: 'email', //используем для передачи формы
                id: 'email',//id элемента формы
                element: null,
                validation: {regex: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu},
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                validation: {regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.).{8,}$/, comparable: 'password-repeat'},
                regex: /./,
                valid: false,
            },
            {
                name: 'passwordRepeat',
                id: 'password-repeat',
                element: null,
                validation: {compare: 'password'},
                valid: false,
            }
        ];
        this.findElements();
        this.init();
    }

    findElements() {
        ValidateUtils.findElements(this.fields);
        this.registerErrorMsgElement = document.getElementById("register-error-msg");
        this.btnRegisterElement = document.getElementById("btn-register");
    }

    init() {
        this.btnRegisterElement.addEventListener("click", this.registerAction.bind(this));
        //real-time validation
        this.fields.forEach(fieldItem => {
            fieldItem.element.addEventListener("change", () => {
                fieldItem.valid = ValidateUtils.validateElement(fieldItem);
                if (fieldItem.validation.hasOwnProperty("comparable")) {
                    const comparableElement = this.fields.find(item => item.id === fieldItem.validation.comparable);
                    if (comparableElement.element.value) {
                        comparableElement.valid = ValidateUtils.validateElement(comparableElement);
                        !comparableElement.valid ? comparableElement.element.value = '' : null;
                    }
                }
                if (this.fields.some(item => item.valid === false)) {
                    this.btnRegisterElement.classList.add("disabled");
                } else {
                    this.btnRegisterElement.classList.remove("disabled");
                }
            });
        });
    }

   async registerAction() {
        this.registerErrorMsgElement.classList.add("d-none");
        if (this.fields.some(item => item.valid === false)) {
            this.btnRegisterElement.classList.add("disabled");
            const isValidated = ValidateUtils.validateForm(this.fields);
            if (!isValidated) {
                return
            }
        }
        const requestData = {}
        this.fields.forEach(field => requestData[field.name] = field.element.value);
        let [userName,userLastName]=requestData.fullName.split(' ');
        delete requestData.fullName;
        requestData.name=userName;
        requestData.lastName=userLastName;

        const result = await AuthService.register(requestData);
        if (result.error){
            this.registerErrorMsgElement.innerText = result.errorMessage;
            this.registerErrorMsgElement.classList.remove("d-none");
            return
        }

       delete requestData.name;
       delete requestData.lastName;
       delete requestData.passwordRepeat;

       const loginResult = await AuthService.login(requestData);
       if (loginResult.error){
           this.registerErrorMsgElement.innerHTML = `Регистрация прошла успешно. Но вход не выполнен.Перейдите на <a href="#/login">страницу логина</a> и войдите вручную. Ошибка: ${loginResult.errorMessage}`;
           this.registerErrorMsgElement.classList.remove("d-none");
           return
       }
       AuthUtils.setAuthInfoLogin(loginResult.response.tokens.accessToken, loginResult.response.tokens.refreshToken,loginResult.response.user);
        return document.location='#/';
    }
}