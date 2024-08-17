import * as tempusDominus from "@eonasdan/tempus-dominus";
import {OperationService} from "../services/operation-service";
import {CommonUtils} from "../utils/common-utils";
import {config} from "../config/config";

export class Main {
    constructor() {
        this.userInterval = {
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
        };
        this.period = 'today';
        this.findElements();
        this.init().then;
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
        this.incomingChartElement = document.getElementById('inc-chart');
        this.expensesChartElement = document.getElementById('exp-chart');
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
        const incomingData = {
            labels: ['Нет данных с сервера'],
            datasets: [
                {
                    label: ' Всего',
                    data: [1],
                    backgroundColor: [config.defColor],
                    borderWidth: 0
                }]
        };
        const expenseData = {
            labels: ['Нет данных с сервера'],
            datasets: [
                {
                label: ' Всего',
                data: [1],
                backgroundColor: [config.defColor],
                borderWidth: 0
            }]
        };


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
                CommonUtils.setIntervalData('main', this.period, this.userInterval);
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
                CommonUtils.setIntervalData('main', this.period, this.userInterval);
                if (this.period==='interval') {
                    if (new Date(this.userInterval.startDate)<new Date(this.userInterval.endDate)){
                        this.getOperations();
                    }
                }
            }
        });
        this.userStartDateElement.innerText=this.userInterval.startDate;
        this.userEndDateElement.innerText=this.userInterval.endDate;
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

        const response = CommonUtils.getIntervalData('main');
        if (response.period) {
            this.period = response.period;
        }
        if (response.startDate) {
            this.userInterval.startDate = response.startDate;
            this.userInterval.endDate = response.endDate;
        }
    }

    async getOperations() {
        CommonUtils.setIntervalData('main', this.period, this.userInterval);//Сохранение состояния
        const response = await OperationService.getOperationsList(this.period, this.userInterval);
        if (response.error) {
            response.errorMessage ? alert(response.errorMessage) : alert('Ошибка в полученных данных с сервера. Повторите запрос.');
            console.warn(response.operationsList);
            return response.redirect ? window.location = response.redirect : null;
        }
        this.showRecords(response.operationsList);
    }
    showRecords(operations) {
        const incomingChartData=CommonUtils.generateChartsData(operations,'income');
        const expenseChartData=CommonUtils.generateChartsData(operations,'expense');

        if (this.incomingChart){
            this.incomingChart.data=incomingChartData;
            this.expensesChart.data=expenseChartData;
            this.incomingChart.update();
            this.expensesChart.update();
        }else{
            const legendMargin = {
                id: 'legendMargin',
                beforeInit(chart, legend, options) {
                    const fitValue = chart.legend.fit;
                    chart.legend.fit = function fit() {
                        fitValue.bind(chart.legend)();
                        return this.height += 30;
                    }
                }
            };
            this.incomingChart = new Chart(this.incomingChartElement, {
                type: 'pie',
                plugins: [legendMargin],
                data: incomingChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
            this.expensesChart = new Chart(this.expensesChartElement, {
                type: 'pie',
                plugins: [legendMargin],
                data: expenseChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }

    }
}
