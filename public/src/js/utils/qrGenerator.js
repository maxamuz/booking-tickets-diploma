// public/src/js/utils/qrGenerator.js

/**
 * Утилита для генерации QR-кодов
 */
export const qrGenerator = {
  /**
   * Генерирует QR-код для переданного текста
   * @param {string} text - Текст для генерации QR-кода
   * @param {HTMLElement} container - Контейнер, в который нужно вставить QR-код
   * @param {Object} options - Опции генерации QR-кода
   */
  generate: function(text, container, options = {}) {
    // Проверяем, подключен ли QRCode.js
    if (typeof QRCode === 'undefined') {
      console.error('QRCode.js не подключен. Пожалуйста, подключите библиотеку QRCode.js');
      return;
    }

    // Опции по умолчанию
    const defaultOptions = {
      width: 200,
      height: 200,
      colorDark: "#0000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Очищаем контейнер
    container.innerHTML = '';

    // Генерируем QR-код
    new QRCode(container, {
      text: text,
      width: mergedOptions.width,
      height: mergedOptions.height,
      colorDark: mergedOptions.colorDark,
      colorLight: mergedOptions.colorLight,
      correctLevel: mergedOptions.correctLevel
    });
  }
};