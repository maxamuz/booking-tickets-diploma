// src/js/pages/mainPage.js
import netoApi from "../api.js"; // Импортируем наш API модуль

export async function initMainPage() {
  console.log("Инициализация логики главной страницы (гостевой части)");

  const mainContentElement = document.getElementById("main-content"); // Находим элемент для вставки контента
  if (!mainContentElement) {
    console.error('Элемент с id "main-content" не найден.');
    return;
  }

  try {
    mainContentElement.innerHTML = "<p>Загружается расписание...</p>"; // Показываем сообщение о загрузке

    const data = await netoApi.fetchAllData(); // Получаем все данные
    console.log("Данные с сервера:", data); // Для отладки

    // Извлекаем фильмы
    const { films } = data;

    // Генерируем HTML для списка фильмов
    let filmsHtml = '<div class="row">'; // Используем Bootstrap row для сетки

    films.forEach((film) => {
      // Создаем карточку фильма (Bootstrap Card)
      filmsHtml += `
            <div class="col-md-12 mb-3"> <!-- Bootstrap column -->
                <div class="movie-card"> <!-- h-100 для выравнивания высоты карточек в ряду -->
                    
                    <div class="card-body"> <!-- d-flex flex-column для выравнивания кнопки внизу -->
                    <img src="${film.film_poster}" class="movie-card__image" alt="${film.film_name}">
                        <h5 class="card-title">${film.film_name}</h5>
                        <p class="card-text">
                            <strong>Длительность:</strong> ${film.film_duration} мин<br>
                            <strong>Страна:</strong> ${film.film_origin}
                        </p>
                        
                    </div>
                    <button class="btn btn-primary mt-auto" onclick="alert('Фильм: ${film.film_name}')">Подробнее</button> <!-- Заглушка для кнопки -->
                </div>
            </div>`;
    });

    filmsHtml += "</div>";

    // Вставляем сгенерированный HTML в элемент mainContentElement
    mainContentElement.innerHTML = filmsHtml;
  } catch (error) {
    console.error("Ошибка при инициализации главной страницы:", error);
    // Отображаем сообщение об ошибке пользователю
    mainContentElement.innerHTML = `<div class="alert alert-danger" role="alert">
            Не удалось загрузить данные. Пожалуйста, обновите страницу или повторите попытку позже.<br>
            <small>Ошибка: ${error.message}</small>
        </div>`;
  }
}
