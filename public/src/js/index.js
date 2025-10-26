// src/js/index.js
import { initMainPage } from './pages/mainPage.js'; // Импортируем функцию инициализации главной страницы

document.addEventListener('DOMContentLoaded', () => {
    console.log('Гостевая часть загружена');
    initMainPage(); // Вызываем функцию для инициализации логики главной страницы
});