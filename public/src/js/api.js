// src/js/api.js

const BASE_URL = 'https://shfe-diplom.neto-server.ru/'; // Базовый URL API

/**
 * Асинхронная функция для выполнения запросов к API.
 * @param {string} endpoint - Конечная точка API (например, '/halls', '/movies').
 * @param {string} method - HTTP-метод ('GET', 'POST', 'DELETE', 'PUT').
 * @param {Object} [body] - Тело запроса (для POST/PUT).
 * @returns {Promise<any>} - Возвращает `result` из успешного ответа или выбрасывает ошибку.
 */
async function request(endpoint, method = 'GET', body = null) {
    const config = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(BASE_URL + endpoint, config);

        if (!response.ok) {
            // Обработка HTTP ошибок (например, 404, 500), если fetch не считает их за ошибки
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            return data.result; // Возвращаем полезные данные
        } else {
            // Если success: false, выбрасываем ошибку с сообщением от сервера
            throw new Error(data.error || 'Неизвестная ошибка API');
        }
    } catch (error) {
        // Ловим ошибки сети, JSON parsing, HTTP ошибки и ошибки API
        console.error('Ошибка при запросе к API:', error);
        throw error; // Пробрасываем ошибку дальше, чтобы вызывающий код мог обработать её
    }
}

const netoApi = {
    // Метод для получения всех данных
    fetchAllData: () => request('alldata', 'GET'),

    // Можно добавлять и другие методы здесь по мере необходимости
    // fetchHalls: () => request('halls', 'GET'),
    // fetchMovies: () => request('movies', 'GET'),
    // fetchSessions: () => request('sessions', 'GET'),
    // createHall: (hallData) => request('halls', 'POST', hallData),
    // deleteHall: (id) => request(`halls/${id}`, 'DELETE'),
    // и т.д.

    // Включаем универсальную функцию request, если она понадобится напрямую
    request,
};

export default netoApi;