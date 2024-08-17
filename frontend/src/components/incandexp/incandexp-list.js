import {OperationService} from "../../services/operation-service";
import * as tempusDominus from "@eonasdan/tempus-dominus";
import {CommonUtils} from "../../utils/common-utils";

export class IncandexpList {
    constructor() {
        this.delButtonsElements = [];
        this.userInterval = {
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
        };
        this.period = 'today';
        this.findElements();
        this.init().then();
    }

    findElements() {
        this.intervalMenuElements = [
            document.getElementById('today'),
            document.getElementById('week'),
            document.getElementById('month'),
            document.getElementById('year'),
            document.getElementById('all'),
            document.getElementById('interval')
        ];
        this.userStartDateElement = document.getElementById('user-start-date');
        this.userEndDateElement = document.getElementById('user-end-date');
        this.tableBodyElement = document.getElementById('table-body');
        this.btnAddIncomingElement = document.getElementById('btn-add-incoming');
        this.btnAddExpenseElement = document.getElementById('btn-add-expense');
        this.btnConfirmElement = document.getElementById('btn-confirm');
    }

    async init() {
        this.loadIntervalMenu();//загрузка из сессионки типа запроса и дат
        this.intervalMenuElements.forEach(menuElement => {
            if (menuElement.id === this.period) {
                menuElement.classList.add('active');
            }
            menuElement.onclick = (e) => {
                if (e.target.id === 'interval') {
                    if (new Date(this.userInterval.startDate) > new Date(this.userInterval.endDate)) {
                        alert('Ошибка! Начальная дата не может быть больше конечной, поэтому она будет изменена на начальную');
                        this.userInterval.endDate = this.userInterval.startDate;
                        const parsedDate = this.endPicker.dates.parseInput(new Date(this.userInterval.endDate));
                        this.endPicker.dates.setValue(parsedDate);
                    }
                }
                this.clearIntervalMenu();
                e.target.classList.toggle('active');
                this.period = e.target.id;
                this.getOperations();
            }
        });
        const startPickerConfig = {
            defaultDate: new Date(this.userInterval.startDate),
            display: {
                icons: {
                    type: 'icons',
                    time: 'fas fa-clock',
                    date: 'fas fa-calendar',
                    up: 'fas fa-arrow-up',
                    down: 'fas fa-arrow-down',
                    previous: 'fas fa-chevron-left',
                    next: 'fas fa-chevron-right',
                    today: 'fas fa-calendar-check',
                    clear: 'fas fa-trash',
                    close: 'fas fa-times',
                },
                calendarWeeks: true,
                buttons: {
                    today: false,
                    clear: false,
                    close: true
                },
                components: {
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: true,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
            },
            useCurrent: false,
            viewDate: new Date(this.userInterval.startDate)
        };
        const endPickerConfig = {
            defaultDate: new Date(this.userInterval.endDate),
            display: {
                icons: {
                    type: 'icons',
                    time: 'fas fa-clock',
                    date: 'fas fa-calendar',
                    up: 'fas fa-arrow-up',
                    down: 'fas fa-arrow-down',
                    previous: 'fas fa-chevron-left',
                    next: 'fas fa-chevron-right',
                    today: 'fas fa-calendar-check',
                    clear: 'fas fa-trash',
                    close: 'fas fa-times',
                },
                calendarWeeks: true,
                buttons: {
                    today: false,
                    clear: false,
                    close: true
                },
                components: {
                    calendar: true,
                    date: true,
                    month: true,
                    year: true,
                    decades: true,
                    clock: false,
                    hours: false,
                    minutes: false,
                    seconds: false
                },
            },
            useCurrent: false,
            viewDate: new Date(this.userInterval.endDate)
        };
        this.startPicker = new tempusDominus.TempusDominus(this.userStartDateElement, startPickerConfig);
        this.endPicker = new tempusDominus.TempusDominus(this.userEndDateElement, endPickerConfig);
        this.userStartDateElement.addEventListener('change.td', (e) => {
            if (e.detail.oldDate) {
                this.userInterval.startDate = e.detail.date.toISOString().split('T')[0];
                this.userStartDateElement.innerText=this.userInterval.startDate;
                CommonUtils.setIntervalData('incandexp', this.period, this.userInterval);
                if (this.period==='interval') {
                    if (new Date(this.userInterval.startDate)<new Date(this.userInterval.endDate)){
                        this.getOperations();
                    }
                }
            }
        });
        this.userEndDateElement.addEventListener('change.td', (e) => {
            if (e.detail.oldDate) {
                this.userInterval.endDate = e.detail.date.toISOString().split('T')[0];
                this.userEndDateElement.innerText=this.userInterval.endDate;
                CommonUtils.setIntervalData('incandexp', this.period, this.userInterval);
                if (this.period==='interval') {
                    if (new Date(this.userInterval.startDate)<new Date(this.userInterval.endDate)){
                        this.getOperations();
                    }
                }
            }
        });

        this.userStartDateElement.innerText=this.userInterval.startDate;
        this.userEndDateElement.innerText=this.userInterval.endDate;

        this.btnAddIncomingElement.addEventListener('click', () => {
            document.location = '#/incandexp/create?new=incCategory';
        });
        this.btnAddExpenseElement.addEventListener('click', () => {
            document.location = '#/incandexp/create?new=expCategory';
        });
        await this.getOperations();
    }

    clearIntervalMenu() {
        this.intervalMenuElements.find(itm => itm.classList.contains('active')).classList.remove('active');
    }

    loadIntervalMenu() {
        const today=new Date();
        this.intervalMenuElements[0].setAttribute('title', today.toLocaleString('ru-RU').split(',')[0]);
        let week=new Date();
        week=new Date(week.setDate(week.getDate()-7)).toLocaleString('ru-RU').split(',')[0];
        this.intervalMenuElements[1].setAttribute('title', week+' - '+today.toLocaleString('ru-RU').split(',')[0]);
        let month=new Date();
        month=new Date(month.setMonth(month.getMonth()-1)).toLocaleString('ru-RU').split(',')[0];
        this.intervalMenuElements[2].setAttribute('title', month+' - '+today.toLocaleString('ru-RU').split('T')[0]);
        let year=new Date();
        year=new Date(year.setFullYear(year.getFullYear()-1)).toLocaleString('ru-RU').split(',')[0];
        this.intervalMenuElements[3].setAttribute('title', year+' - '+today.toLocaleString('ru-RU').split('T')[0]);
        const response = CommonUtils.getIntervalData('incandexp');
        if (response.period) {
            this.period = response.period;
        }
        if (response.startDate) {
            this.userInterval.startDate = response.startDate;
            this.userInterval.endDate = response.endDate;
        }
    }

    async getOperations() {
        CommonUtils.setIntervalData('incandexp', this.period, this.userInterval);//Сохранение состояния
        const response = await OperationService.getOperationsList(this.period, this.userInterval);
        if (response.error) {
            response.errorMessage ? alert(response.errorMessage) : alert('Ошибка в полученных данных с сервера. Повторите запрос.');
            console.warn(response.operationsList);
            return response.redirect ? window.location = response.redirect : null;
        }
        this.showRecords(response.operationsList);
    }

    showRecords(operations) {
        this.tableBodyElement.innerHTML = '';
        operations.forEach((operation) => {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerText = (operation.id).toString();
            trElement.cells[0].setAttribute('data-title', '№ операции');

            trElement.insertCell().innerHTML = `<span> ${operation.type === 'expense' ? 'расход' : 'доход'} </span>`;
            trElement.cells[1].setAttribute('data-title', 'Тип');
            trElement.cells[1].classList.add(operation.type);

            trElement.insertCell().innerText = operation.category;
            trElement.cells[2].setAttribute('data-title', 'Категория');

            trElement.insertCell().innerText = operation.amount + '$';
            trElement.cells[3].setAttribute('data-title', 'Сумма');

            trElement.insertCell().innerText = new Date(operation.date).toLocaleString('ru-RU').split(',')[0];
            trElement.cells[4].setAttribute('data-title', 'Дата');

            trElement.insertCell().innerText = operation.comment;
            trElement.cells[5].setAttribute('data-title', 'Комментарий');

            trElement.insertCell().innerHTML = `
                    <a id="${operation.id}" href="javascript:void(0)" class="text-decoration-none me-2" data-bs-toggle="modal"
                       data-bs-target="#modalCenter">
                        <svg width="13.000000" height="15.000000" viewBox="0 0 13 15" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <defs/>
                            <path id="Union"
                                  d="M11.5 4C12.05 4 12.5 3.55 12.5 3L12.5 2C12.5 1.44 12.05 1 11.5 1L8 1C8 0.44 7.55 0 7 0L5 0C4.44 0 4 0.44 4 1L0.5 1C-0.06 1 -0.5 1.44 -0.5 2L-0.5 3C-0.5 3.55 -0.06 4 0.5 4L1 4L1 13C1 14.1 1.89 15 3 15L9 15C10.1 15 11 14.1 11 13L11 4L11.5 4ZM0.5 2L0.5 3L11.5 3L11.5 2L0.5 2ZM2 4.05L2.11 4L9.88 4L10 4.05L10 13C10 13.55 9.55 14 9 14L3 14C2.44 14 2 13.55 2 13L2 4.05ZM4 6C4 5.72 3.77 5.5 3.5 5.5C3.22 5.5 3 5.72 3 6L3 12C3 12.27 3.22 12.5 3.5 12.5C3.77 12.5 4 12.27 4 12L4 6ZM6.5 6C6.5 5.72 6.27 5.5 6 5.5C5.72 5.5 5.5 5.72 5.5 6L5.5 12C5.5 12.27 5.72 12.5 6 12.5C6.27 12.5 6.5 12.27 6.5 12L6.5 6ZM9 6C9 5.72 8.77 5.5 8.5 5.5C8.22 5.5 8 5.72 8 6L8 12C8 12.27 8.22 12.5 8.5 12.5C8.77 12.5 9 12.27 9 12L9 6Z"
                                  fill="#000000" fill-opacity="1.000000" fill-rule="evenodd"/>
                        </svg>
                    </a>
                    <a href="#/incandexp/edit?id=${operation.id}" class="text-decoration-none">
                        <svg width="16.000000" height="16.000000" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <defs/>
                            <path id="v2 (Stroke)"
                                  d="M12.14 0.14C12.34 -0.05 12.65 -0.05 12.85 0.14L15.85 3.14C16.04 3.34 16.04 3.65 15.85 3.85L5.85 13.85C5.8 13.9 5.74 13.93 5.68 13.96L0.68 15.96C0.5 16.03 0.28 15.99 0.14 15.85C0 15.71 -0.04 15.5 0.03 15.31L2.03 10.31C2.06 10.25 2.09 10.19 2.14 10.14L12.14 0.14ZM11.2 2.5L13.5 4.79L14.79 3.5L12.5 1.2L11.2 2.5ZM12.79 5.5L10.5 3.2L4 9.7L4 10L4.5 10C4.77 10 5 10.22 5 10.5L5 11L5.5 11C5.77 11 6 11.22 6 11.5L6 12L6.29 12L12.79 5.5ZM3.03 10.67L2.92 10.78L1.39 14.6L5.21 13.07L5.32 12.96C5.13 12.89 5 12.71 5 12.5L5 12L4.5 12C4.22 12 4 11.77 4 11.5L4 11L3.5 11C3.28 11 3.1 10.86 3.03 10.67Z"
                                  fill="#000000" fill-opacity="1.000000" fill-rule="nonzero"/>
                        </svg>
                    </a>`;
            this.tableBodyElement.appendChild(trElement);
            this.delButtonsElements.push(document.getElementById(operation.id));
            this.delButtonsElements[this.delButtonsElements.length - 1].addEventListener('click', (event) => {
                const id = event.currentTarget.id;
                event.stopPropagation();
                this.btnConfirmElement.addEventListener('click', this.deleteOperation.bind(this, id));
            })
        });
    }

    deleteOperation(e) {
        document.location = '#/incandexp/delete?id=' + e;
    }
}