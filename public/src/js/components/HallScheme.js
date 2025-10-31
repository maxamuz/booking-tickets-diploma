// public/src/js/components/HallScheme.js

/**
 * Компонент схемы зала
 */
export class HallScheme {
  constructor(hallData) {
    this.hallData = hallData;
  }

 render() {
    // Заглушка для компонента схемы зала
    return `
      <div class="hall-scheme">
        <h3>Схема зала: ${this.hallData.hall_name}</h3>
        <p>Количество мест: ${this.hallData.hall_size}</p>
        <!-- Здесь будет отображаться схема зала -->
      </div>
    `;
  }
}