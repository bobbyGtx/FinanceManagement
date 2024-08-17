import {CategoriesServices} from "../../services/categories-service";
import {config} from "../../config/config";

export class ExpensesList {
    constructor() {
        this.cardsContainerElement = document.getElementById('cards-element');
        this.delButtonsElements = [];
        this.btnConfirmElement = document.getElementById('btn-confirm');
        this.init().then();
    }

    async init() {
        await this.getCardList()
    }

    async getCardList() {
        const response = await CategoriesServices.getCategoriesList(config.expCategory);
        if (response.error) {
            alert(response.errorMessage);
            return response.redirect ? window.location = response.redirect : null;
        }
        this.showRecords(response.categoryList);
    }

    showRecords(categoryList) {

        categoryList.forEach(categoryItem => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card", "p-1", "rounded-4");

            const cardBodyElement = document.createElement("div");
            cardBodyElement.classList.add("card-body");

            const headerElement = document.createElement("div");
            headerElement.classList.add("h3", "text-truncate");
            headerElement.innerText = categoryItem.title;

            const actionsElement = document.createElement("div");
            actionsElement.innerHTML = `
                <button onclick="document.location='#/expenses/edit?id=${categoryItem.id}&title=${categoryItem.title}'" type="button" class="btn btn-primary me-2">Редактировать</button>
                <button id="${categoryItem.id}" type="button" class="btn btn-danger" data-bs-toggle="modal"data-bs-target="#modalCenter">Удалить</button>`;

            cardBodyElement.appendChild(headerElement);
            cardBodyElement.appendChild(actionsElement);
            cardElement.appendChild(cardBodyElement);
            this.cardsContainerElement.appendChild(cardElement);
            this.delButtonsElements.push(document.getElementById(categoryItem.id));
            this.delButtonsElements[this.delButtonsElements.length - 1].addEventListener('click', (e) => {
                const id = e.target.id;
                this.btnConfirmElement.addEventListener('click', this.deleteCategory.bind(this, id));
            })
        });
        const addCardElement = document.createElement("div");
        addCardElement.classList.add("card", "p-1", "rounded-4");
        const addCardBodyElement = document.createElement("div");
        addCardBodyElement.classList.add("card-body", "p-0");
        addCardBodyElement.innerHTML = `<a href="#/expenses/create"class="d-flex align-items-center justify-content-center h-100 w-100 p-0 fs-1">+</a>`;
        addCardElement.appendChild(addCardBodyElement);
        this.cardsContainerElement.appendChild(addCardElement);
    }

    deleteCategory(e) {
        document.location = '#/expenses/delete?id=' + e;
    }
}