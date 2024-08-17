import {Main} from "./components/main.js";
import {Login} from "./components/auth/login.js";
import {Register} from "./components/auth/register.js";
import {FileUtils} from "./utils/file-utils.js";
import {IncandexpList} from "./components/incandexp/incandexp-list";
import {IncAndExpCreate} from "./components/incandexp/incandexp-create";
import {IncAndExpEdit} from "./components/incandexp/incandexp-edit";
import {IncomingsList} from "./components/incomings/incomings-list";
import {IncomingsEdit} from "./components/incomings/incomings-edit";
import {AuthUtils} from "./utils/auth-utils";
import {BalanceService} from "./services/balance-service";
import {Logout} from "./components/auth/logout";
import {IncomingsDel} from "./components/incomings/incomings-del";
import {ExpensesList} from "./components/expenses/expenses-list";
import {ExpensesDel} from "./components/expenses/expenses-del";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {IncAndExpDel} from "./components/incandexp/incandexp-del";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentElement = document.getElementById('main-content');
        this.bootstrapStyleElement = document.getElementById('bootstrap-element');
        this.userNameElements = [];
        this.userCashElements = [];
        this.logoutElements = [];
        this.sidebar = [];
        this.navbar = [];
        this.balance = null;
        this.initEvents();
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: '/templates/pages/main.html',
                useLayout: "/templates/layout.html",
                styles: [
                    'fontawesome.css',
                    'tempus-dominus.min.css',
                ],
                scripts: [
                    'popper.min.js',
                    'tempus-dominus.min.js',
                    'chart.umd.js',
                ],
                elements: [
                    'tempus-dominus-widget',
                ],
                load: () => {
                    new Main();
                }
            },

            {
                route: '#/login',
                title: 'Авторизация',
                template: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login();
                }
            },
            {
                route: '#/register',
                title: 'Регистрация',
                template: '/templates/pages/auth/register.html',
                useLayout: false,
                load: () => {
                    new Register();
                }
            },
            {
                route: '#/logout',
                useLayout: false,
                load: () => {
                    new Logout();
                }
            },

            {
                route: '#/incandexp',
                title: 'Доходы и расходы',
                template: '/templates/pages/incandexp/list.html',
                useLayout: "/templates/layout.html",
                styles: [
                    'fontawesome.css',
                    'tempus-dominus.min.css',
                ],
                scripts: [
                    'popper.min.js',
                    'tempus-dominus.min.js',
                ],
                elements: [
                    'tempus-dominus-widget',
                ],
                load: () => {
                    new IncandexpList();
                }
            },
            {
                route: '#/incandexp/create',
                title: 'Добавление',
                template: '/templates/pages/incandexp/create.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new IncAndExpCreate();
                }
            },
            {
                route: '#/incandexp/edit',
                title: 'Редактирование записи',
                template: '/templates/pages/incandexp/edit.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new IncAndExpEdit();
                }
            },
            {
                route: '#/incandexp/delete',
                load: () => {
                    new IncAndExpDel();
                }
            },

            {
                route: '#/incomings',
                title: 'Категории доходов',
                template: '/templates/pages/incomings/list.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new IncomingsList();
                }
            },
            {
                route: '#/incomings/create',
                title: 'Создание категории доходов',
                template: '/templates/pages/incomings/edit.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new IncomingsEdit('create');
                }
            },
            {
                route: '#/incomings/edit',
                title: 'Редактирование категории доходов',
                template: '/templates/pages/incomings/edit.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new IncomingsEdit('edit');
                }
            },
            {
                route: '#/incomings/delete',
                load: () => {
                    new IncomingsDel();
                }
            },

            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: '/templates/pages/expenses/list.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new ExpensesList();
                }
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории расходов',
                template: '/templates/pages/expenses/edit.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new ExpensesEdit('create');
                }
            },
            {
                route: '#/expenses/edit',
                title: 'Редактирование категории расходов',
                template: '/templates/pages/expenses/edit.html',
                useLayout: "/templates/layout.html",
                load: () => {
                    new ExpensesEdit('edit');
                }
            },
            {
                route: '#/expenses/delete',
                load: () => {
                    new ExpensesDel();
                }
            },

            {
                route: '#/404',
                title: 'Страница не найдена',
                template: '/templates/pages/404.html',
                useLayout: false,
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        this.clearOldData();//Чистка остатков прошлого подключения
        //берем url без домена и находим элемент массива роутов
        let urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '' || (urlRoute === '#/register' && AuthUtils.getAuthInfo(AuthUtils.userId))) {
            urlRoute = '#/';
            history.pushState({}, '', urlRoute);
        }

        this.oldHash = urlRoute;//перезаписываем прошлый хэш на новый
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                for (let i = newRoute.styles.length - 1; i >= 0; i--) {
                    FileUtils.loadPageStyle('/css/' + newRoute.styles[i], this.bootstrapStyleElement);
                }
            }//Подключаем файлы стилей
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (let i = 0; i < newRoute.scripts.length; i++) {
                    await FileUtils.loadPageScript('/js/' + newRoute.scripts[i]);
                }
            }//Подключаем скрипты библиотек
            let contentPageElement = this.contentElement;
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }
            if (newRoute.template) {
                if (newRoute.useLayout) {
                    let refind = false;
                    if (!document.getElementById('layout-content')) {
                        this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                        this.userNameElements[0] = document.getElementById('sb-user-name');
                        this.userCashElements[0] = document.getElementById('sb-user-money');
                        this.userCashElements[1] = document.getElementById('nb-user-money');
                        const balanceRequest = await BalanceService.getBalance();
                        if (balanceRequest.error || balanceRequest.redirect) {
                            balanceRequest.errorMessage ? alert(balanceRequest.errorMessage) : null;
                            if (balanceRequest.redirect) {
                                return document.location = balanceRequest.redirect;
                            }
                        } else {
                            this.balance = balanceRequest.response;
                        }
                        this.userCashElements.forEach(item => {
                            item.onclick = () => {
                                const newMoney = prompt('Введите новый бананс средств в $', parseInt(item.innerText));
                                if (newMoney !== null) {
                                    if (!isNaN(Number(newMoney))) {
                                        BalanceService.setBalance(newMoney);
                                    } else {
                                        alert('Введены некорректные данные!');
                                    }
                                }
                            }
                            return item.innerText = this.balance + '$'
                        });
                        this.logoutElements[0] = document.getElementById('sb-logout');
                        this.logoutElements[1] = document.getElementById('nb-logout');
                        this.logoutElements[0].addEventListener('click', () => {
                            window.location = '#/logout';
                        });
                        this.logoutElements[1].addEventListener('click', () => {
                            window.location = '#/logout';
                        });

                        refind = true;//В случае загрузки layout метка о необходимости повторного поиска элементов меню
                    }//Если есть уже layout - то не грузим его заново
                    contentPageElement = document.getElementById('layout-content');
                    this.userNameElements[0].innerText = AuthUtils.getAuthInfo(AuthUtils.userFIO);
                    this.activateMenu(newRoute.route, refind);
                } else {//если не используется лэйаут - чистим элементы сайдбара и навбара
                    this.sidebar.splice(0, this.sidebar.length - 1);
                    this.navbar.splice(0, this.navbar.length - 1);
                }
                contentPageElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            window.location = '#/404';
        }
    }

    clearOldData() {
        if (this.oldHash) {
            const oldRoute = this.routes.find(item => item.route === this.oldHash);
            if (oldRoute) {
                if (oldRoute.styles && oldRoute.styles.length > 0) {
                    oldRoute.styles.forEach(styleItem => {
                        document.head.querySelector(`link[href='/css/${styleItem}']`).remove();
                    });
                }
                if (oldRoute.scripts && oldRoute.scripts.length > 0) {
                    oldRoute.scripts.forEach(scriptItem => {
                        let scriptElement = document.querySelector(`script[src='/js/${scriptItem}']`);
                        if (scriptElement) {
                            scriptElement.remove();
                        }
                    });
                }
                if (oldRoute.elements && oldRoute.elements.length > 0) {
                    oldRoute.elements.forEach(elementItem => {
                        let element = document.getElementsByClassName(elementItem);
                        if (element && element.length > 0) {
                            while (element.length > 0) {
                                element[0].remove();
                            }
                        }
                    });
                }
            }
        }
    }

    activateMenu(route, refind) {
        if (refind || this.sidebar.length === 0) {
            this.sidebar = [
                document.getElementById('side-menu-1'),
                document.getElementById('side-menu-2'),
                [
                    document.getElementById('side-menu-3'),
                    document.getElementById('side-menu-3_1'),
                    document.getElementById('side-menu-3_2'),
                ],
            ];
            this.navbar = [
                document.getElementById('nav-menu-1'),
                document.getElementById('nav-menu-2'),
                [
                    document.getElementById('nav-menu-3'),
                    document.getElementById('nav-menu-3_1'),
                    document.getElementById('nav-menu-3_2'),
                ],
            ];
            this.collapsible = document.getElementsByClassName('collapsable');
        }//Если перезагрузили layout или первичная загрузка то ищем элементы меню
        for (let i = 0; i < this.sidebar.length; i++) {
            if (Array.isArray(this.sidebar[i])) {
                this.sidebar[i][0].classList.remove('active');

                if (!this.navbar[i][0].classList.contains('collapsed')) {
                    this.sidebar[i][0].classList.add('collapsed');
                    for (let n = 0; n < this.collapsible.length; n++) {
                        this.collapsible[n].classList.remove('show');
                    }
                }
                this.navbar[i][0].classList.remove('active');

                for (let j = 1; j < this.sidebar[i].length; j++) {
                    if (this.sidebar[i][j].getAttribute('href') === route) {
                        this.sidebar[i][j].classList.add('active');
                        this.navbar[i][j].classList.add('active');

                        this.sidebar[i][0].classList.add('active');
                        this.navbar[i][0].classList.add('active');

                    } else {
                        this.sidebar[i][j].classList.remove('active');
                        this.navbar[i][j].classList.remove('active');
                    }
                }
            } else {
                if (this.sidebar[i].getAttribute('href') === route) {
                    this.sidebar[i].classList.add('active');
                    this.navbar[i].classList.add('active');
                } else {
                    this.sidebar[i].classList.remove('active');
                    this.navbar[i].classList.remove('active');
                }
            }
        }
    }

    async getBalance() {
        const response = await BalanceService.getBalance();
        if (response.redirect) {
            return response.redirect;
        } else if (response.error) {
            alert(response.error);
            return false;
        }
        return response.balance;
    }

}