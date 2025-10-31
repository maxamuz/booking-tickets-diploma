// public/src/js/components/SessionList.js

/**
 * Компонент списка сеансов
 */
export class SessionList {
  constructor(seances, halls) {
    this.seances = seances;
    this.halls = halls;
  }

  render() {
    if (!this.seances || this.seances.length === 0) {
      return '<p>Сеансы не найдены</p>';
    }

    let seancesHtml = '';
    this.seances.forEach((seance) => {
      const hall = this.halls.find((h) => h.id === seance.seance_hallid);
      const hallName = hall ? hall.hall_name : "Зал неизвестен";
      seancesHtml += `
        <div class="session-item">
          <span class="session-time">${seance.seance_time}</span>
          <span class="session-hall">(${hallName})</span>
        </div>
      `;
    });

    return `
      <div class="session-list">
        <h4>Сеансы:</h4>
        ${seancesHtml}
      </div>
    `;
  }
}