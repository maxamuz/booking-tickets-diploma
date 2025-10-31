// public/src/js/pages/mainPage.js
import netoApi from "../api.js";

// --- Вспомогательные функции ---

/**
 * Форматирует дату в формате YYYY-MM-DD в строку "ДД.ММ" и день недели.
 * @param {Date} date - Объект даты.
 * @returns {Object} - Объект с полями dateStr (строка "ДД.ММ") и dayName (день недели).
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы с 0
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const dayName = dayNames[date.getDay()];
  return {
    dateStr: `${day}.${month}`,
    dayName: dayName,
    fullDate: date.toISOString().split("T")[0], // Формат YYYY-MM-DD для сравнения
  };
}

/**
 * Генерирует массив дат с сегодняшнего дня на 7 дней вперед.
 * @returns {Array} - Массив объектов {dateStr, dayName, fullDate}.
 */
function generateDaysArray() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    // 7 дней вперед, включая сегодня
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(formatDate(date));
  }
  return days;
}

/**
 * Проверяет, прошёл ли сеанс на указанную дату и время.
 * @param {string} seanceTime - Время сеанса в формате "HH:MM".
 * @param {string} seanceDateStr - Дата сеанса в формате YYYY-MM-DD.
 * @returns {boolean} - true, если сеанс прошёл.
 */
function isSeancePassed(seanceTime, seanceDateStr) {
  const [hours, minutes] = seanceTime.split(":").map(Number);
  const seanceDateTime = new Date(`${seanceDateStr}T${hours}:${minutes}:00`);

  const now = new Date();
  return seanceDateTime < now;
}

/**
 * Фильтрует сеансы, исключая прошедшие (если дата сеанса - сегодня).
 * @param {Array} seances - Массив сеансов из API.
 * @param {string} selectedDateStr - Выбранная дата в формате YYYY-MM-DD.
 * @param {Array} halls - Массив залов (для проверки hall_open).
 * @returns {Array} - Отфильтрованные сеансы.
 */
function getFilteredSeancesForDate(seances, selectedDateStr, halls) {
  // Предполагаем, что все сеансы в списке seances - на выбранный день selectedDateStr
  // Проверяем, является ли день сегодняшним, и если да, фильтруем прошедшие
  const isToday = selectedDateStr === new Date().toISOString().split("T")[0];

  return seances.filter((seance) => {
    // Проверяем, открыт ли зал для продажи
    const hall = halls.find((h) => h.id === seance.seance_hallid);
    if (!hall || hall.hall_open !== 1) {
      return false;
    }

    // Если дата - сегодня, проверяем время
    if (isToday && isSeancePassed(seance.seance_time, selectedDateStr)) {
      return false; // Исключаем прошедший сеанс
    }
    return true; // Включаем сеанс
  });
}

/**
 * Генерирует HTML для панели выбора дней.
 * @param {Array} days - Массив дней.
 * @param {Function} onClickHandler - Функция-обработчик клика по кнопке дня.
 * @returns {string} - HTML-код панели.
 */
function renderDaySelector(days, onClickHandler) {
  const todayStr = new Date().toISOString().split("T")[0]; // Получаем сегодняшнюю дату

  let html = '<div class="day-selector day-selector-container">';

days.forEach((day, index) => {
  const isToday = day.fullDate === todayStr; // Проверяем, является ли день сегодняшним
  const buttonText = isToday ? `Сегодня<br>${day.dayName}<br>${day.dateStr}` : `${day.dayName}<br>${day.dateStr}`; // Формируем текст кнопки
  const isActive = index === 0 ? " day-btn-active" : ""; // Активируем первый день по умолчанию
  html += `<button type="button" class="day-btn${isActive}" data-date="${day.fullDate}">${buttonText}</button>`;
});

// Добавляем кнопку со стрелкой в конец списка
html += `<button type="button" class="day-btn-more" id="show-more-days">></button>`;

  html += "</div>";
  return html;
}

/**
 * Генерирует HTML для карточек фильмов.
 * @param {Array} films - Массив фильмов для отображения.
 * @param {Array} seances - Массив сеансов (уже отфильтрованных).
 * @param {Array} halls - Массив залов.
 * @returns {string} - HTML-код карточек.
 */
function renderMovieCards(films, seances, halls) {
  // Создаём мапу сеансов по ID фильма
  const seancesByFilmId = {};
  seances.forEach((seance) => {
    if (!seancesByFilmId[seance.seance_filmid]) {
      seancesByFilmId[seance.seance_filmid] = [];
    }
    seancesByFilmId[seance.seance_filmid].push(seance);
  });

  if (Object.keys(seancesByFilmId).length === 0) {
    return "<p>На выбранный день сеансы не найдены.</p>";
  }

  let filmsHtml = '<div class="movies-list">';
 
  films.forEach((film) => {
    // Проверяем, есть ли сеансы для этого фильма
    const filmSeances = seancesByFilmId[film.id];
    if (filmSeances && filmSeances.length > 0) {
      filmsHtml += `
            <div class="movie-item">
                <div class="movie-card">
                    <img src="${film.film_poster}" class="movie-card__image" alt="${film.film_name}">
                    <div class="movie-info">
                        <h5 class="movie-title">${film.film_name}</h5>
                        <p class="movie-details">
                            <strong>Длительность:</strong> ${film.film_duration} мин<br>
                            <strong>Страна:</strong> ${film.film_origin}
                        </p>
                        <div class="movie-sessions">
                            <h6>Сеансы:</h6>
                            <div class="seance-times">`;
      // Выводим времена сеансов
      filmSeances.forEach((seance) => {
        const hall = halls.find((h) => h.id === seance.seance_hallid);
        const hallName = hall ? hall.hall_name : "Зал неизвестен";
        filmsHtml += `<span class="seance-time">${seance.seance_time} (${hallName})</span>`;
      });
      filmsHtml += `
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    // Если у фильма нет сеансов, он не отображается
  });
 
  // Если ни один фильм не имеет сеансов (после фильтрации), отображаем сообщение
  if (filmsHtml === '<div class="movies-list">') {
    filmsHtml +=
      '<div class="no-movies"><p>На выбранный день фильмы с доступными сеансами не найдены.</p></div>';
  }
 
  filmsHtml += "</div>";
  return filmsHtml;
}

// --- Основная функция ---

export async function initMainPage() {
  console.log("Инициализация логики главной страницы (гостевой части)");

  const daySelectorContainer = document.getElementById(
    "day-selector-container"
  );
  const moviesContainer = document.getElementById("movies-container"); // Обновленный контейнер

  if (!daySelectorContainer || !moviesContainer) {
    console.error("Контейнеры для дней или фильмов не найдены.");
    return;
  }

  try {
    moviesContainer.innerHTML = "<p>Загружается расписание...</p>";
    const data = await netoApi.fetchAllData();
    console.log("Данные с сервера:", data);

    const { films, seances, halls } = data; // Извлекаем фильмы, сеансы и залы

    // ВАЖНО: API не предоставляет дату в объекте сеанса.
    // ПРЕДПОЛОЖЕНИЕ: Все сеансы в списке seances относятся к выбранному дню (например, сегодня).
    // ПРОВЕРКА ПРОШЕДШИХ СЕАНСОВ БУДЕТ РАБОТАТЬ ТОЛЬКО ДЛЯ "СЕГОДНЯ".

    const days = generateDaysArray(); // Генерируем дни с сегодняшнего

    // Функция для отображения фильмов выбранного дня
    const displayFilmsForDay = (selectedDateStr) => {
      console.log(`Отображение фильмов для даты: ${selectedDateStr}`);
      // Так как API не предоставляет дату в сеансе, мы фильтруем сеансы
      // только на предмет "сегодня/не сегодня" и открытых залов.
      // Для других дней, если API не меняется, все сеансы будут "актуальными", кроме как если зал закрыт.
      const filteredSeances = getFilteredSeancesForDate(
        seances,
        selectedDateStr,
        halls
      );
      console.log(
        `Отфильтрованные сеансы для ${selectedDateStr}:`,
        filteredSeances
      );

      // Оставляем только фильмы, у которых есть отфильтрованные сеансы
      const filmIdsToShow = new Set(
        filteredSeances.map((s) => s.seance_filmid)
      );
      const filmsToShow = films.filter((film) => filmIdsToShow.has(film.id));
      console.log(`Фильмы для отображения на ${selectedDateStr}:`, filmsToShow);

      moviesContainer.innerHTML = renderMovieCards(
        filmsToShow,
        filteredSeances,
        halls
      );
    };

    // Рендерим панель дней
    daySelectorContainer.innerHTML = renderDaySelector(
      days,
      displayFilmsForDay
    );

    // Находим кнопки дней и кнопку стрелки
    const dayButtons = daySelectorContainer.querySelectorAll(".day-btn");
    const showMoreButton = daySelectorContainer.querySelector("#show-more-days");

    dayButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Убираем активный класс у всех кнопок
        dayButtons.forEach((btn) => btn.classList.remove("active"));
        // Добавляем активный класс к нажатой
        e.target.classList.add("active");

        const selectedDate = e.target.getAttribute("data-date");
        console.log(`Выбрана дата: ${selectedDate}`);
        displayFilmsForDay(selectedDate); // Вызываем функцию отображения
      });
    });

    // Добавляем обработчик клика для кнопки стрелки (заглушка)
    showMoreButton.addEventListener("click", (e) => {
        console.log('Кнопка "Показать больше дней" нажата. Реализация отложена.');
        // TODO: Реализовать логику показа/скрытия остальных дней
    });

    // Отображаем фильмы для первого (сегодняшнего) дня по умолчанию
    const todayDateStr = days[0].fullDate;
    console.log(`Отображение фильмов для сегодняшней даты: ${todayDateStr}`);
    displayFilmsForDay(todayDateStr);
  } catch (error) {
    console.error("Ошибка при инициализации главной страницы:", error);
    moviesContainer.innerHTML = `<div class="error-message">
            Не удалось загрузить данные. Пожалуйста, обновите страницу или повторите попытку позже.<br>
            <small>Ошибка: ${error.message}</small>
        </div>`;
  }
}
