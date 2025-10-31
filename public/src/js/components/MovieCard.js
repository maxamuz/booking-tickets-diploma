// public/src/js/components/MovieCard.js

/**
 * Компонент карточки фильма
 */
export class MovieCard {
  constructor(filmData, seances, halls) {
    this.filmData = filmData;
    this.seances = seances;
    this.halls = halls;
  }

  render() {
    const film = this.filmData;
    const filmSeances = this.seances.filter(s => s.seance_filmid === film.id);

    if (!filmSeances || filmSeances.length === 0) {
      return '';
    }

    let seancesHtml = '';
    filmSeances.forEach((seance) => {
      const hall = this.halls.find((h) => h.id === seance.seance_hallid);
      const hallName = hall ? hall.hall_name : "Зал неизвестен";
      seancesHtml += `<span class="badge bg-secondary me-1">${seance.seance_time} (${hallName})</span>`;
    });

    return `
      <div class="col-md-12 mb-3">
        <div class="movie-card">
          <img src="${film.film_poster}" class="movie-card__image" alt="${film.film_name}">
          <div class="card-body">
            <h5 class="card-title">${film.film_name}</h5>
            <p class="card-text">
              <strong>Длительность:</strong> ${film.film_duration} мин<br>
              <strong>Страна:</strong> ${film.film_origin}
            </p>
            <div class="mt-auto">
              <h6>Сеансы:</h6>
              <div class="seance-times">${seancesHtml}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}