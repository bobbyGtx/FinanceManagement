import {config} from "../config/config";

export class CommonUtils {
    static setIntervalData(page, period, userInterval) {
        if (period) {
            sessionStorage.setItem(page + 'Period', period);
        }
        if (userInterval && Object.keys(userInterval).length > 0) {
            sessionStorage.setItem(page + 'StartDate', userInterval.startDate);
            sessionStorage.setItem(page + 'EndDate', userInterval.endDate);
        }
    }

    static getIntervalData(page) {
        const response = {
            period: null,
            startDate: null,
            endDate: null
        }
        if (sessionStorage.getItem(page + 'Period')) {
            response.period = sessionStorage.getItem(page + 'Period');
        }
        if (sessionStorage.getItem(page + 'StartDate')) {
            response.startDate = sessionStorage.getItem(page + 'StartDate');
            response.endDate = sessionStorage.getItem(page + 'EndDate');
            if (new Date(response.startDate) > new Date(response.endDate)) {
                response.endDate = response.startDate;
            }
        }
        return response;
    }

    static generateChartsData(operations,type) {
        const responseData={
            labels:[],
            datasets:[ {
                    label: ' Всего ',
                    data: [],
                    backgroundColor: [],
                    borderWidth: 1
                }]
        }
        const filteredData=operations.filter(operation=>operation.type===type);
        if (filteredData.length === 0) {
            responseData.labels=['Нет данных за выбранный период'];
            responseData.datasets[0].data=[1];
            responseData.datasets[0].backgroundColor=[config.defColor];
            responseData.datasets[0].borderWidth=0;
            return responseData;
        }

        filteredData.forEach(record => {
            const elementIndex=responseData.labels.findIndex(item=>item===record.category)
            if (elementIndex===-1){
                responseData.labels.push(record.category);
                responseData.datasets[0].data.push(record.amount);
                responseData.datasets[0].backgroundColor.push(config.colors[responseData.labels.length-1]?config.colors[responseData.labels.length-1]:`rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`);
            }else{
                responseData.datasets[0].data[elementIndex]+=record.amount;
            }
        })
        return responseData;
    }
}