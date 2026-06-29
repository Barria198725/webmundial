const CALENDAR_API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";

const calendarState = {
	matches: [],
	matchesByDate: new Map(),
	currentMonth: null,
	selectedDateKey: null,
	todayKey: new Date().toISOString().slice(0, 10),
};

function fetchJson(path) {
	return fetch(`${CALENDAR_API_BASE_URL}${path}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}
			return response.json();
		})
		.catch((error) => {
			console.error("API request failed:", error);
			return null;
		});
}

function utcDateKey(value) {
	return new Date(value).toISOString().slice(0, 10);
}

function toCalendarDate(key) {
	return new Date(`${key}T00:00:00Z`);
}

function formatMonthLabel(date) {
	return new Intl.DateTimeFormat("es-MX", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}

function formatDayLabel(key) {
	return new Intl.DateTimeFormat("es-MX", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}).format(toCalendarDate(key));
}

function formatTime(value) {
	return new Intl.DateTimeFormat("es-MX", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "UTC",
	}).format(new Date(value));
}

function buildMatchesByDate(matches) {
	const grouped = new Map();
	matches.forEach((match) => {
		const key = utcDateKey(match.date);
		if (!grouped.has(key)) {
			grouped.set(key, []);
		}
		grouped.get(key).push(match);
	});
	return grouped;
}

function createMonthAnchor(date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function getMatchesForDate(key) {
	return calendarState.matchesByDate.get(key) || [];
}

function renderCalendarHeader() {
	const label = document.getElementById("calendar-month-label");
	const meta = document.getElementById("calendar-month-meta");
	if (!label || !meta || !calendarState.currentMonth) return;

	label.textContent = formatMonthLabel(calendarState.currentMonth);
	const monthMatches = calendarState.matches.filter((match) => {
		const matchDate = new Date(match.date);
		return (
			matchDate.getUTCFullYear() === calendarState.currentMonth.getUTCFullYear() &&
			matchDate.getUTCMonth() === calendarState.currentMonth.getUTCMonth()
		);
	});

	meta.textContent = monthMatches.length
		? `${monthMatches.length} partidos programados`
		: "Sin partidos en este mes";
}

function renderSelectedDayPanel() {
	const title = document.getElementById("calendar-selected-date");
	const summary = document.getElementById("calendar-day-summary");
	if (!title || !summary || !calendarState.selectedDateKey) return;

	const matches = getMatchesForDate(calendarState.selectedDateKey);
	title.textContent = formatDayLabel(calendarState.selectedDateKey);

	if (!matches.length) {
		summary.innerHTML = `
			<div class="calendar-empty-state">
				<strong>Sin partidos</strong>
				<p>No hay encuentros programados para este día.</p>
			</div>
		`;
		return;
	}

	summary.innerHTML = `
		<div class="calendar-summary-card">
			<strong>${matches.length} partido${matches.length === 1 ? "" : "s"}</strong>
			<p>Este día concentra la actividad seleccionada del calendario.</p>
			<div class="calendar-summary-card__chips">
				${matches
					.map((match) => `<span>${match.stage} · ${formatTime(match.date)} UTC</span>`)
					.join("")}
			</div>
		</div>
	`;
}

function renderAgenda() {
	const agendaTitle = document.getElementById("calendar-agenda-title");
	const countLabel = document.getElementById("calendar-agenda-count");
	const container = document.getElementById("calendar-match-list");
	if (!agendaTitle || !countLabel || !container || !calendarState.selectedDateKey) return;

	const matches = getMatchesForDate(calendarState.selectedDateKey);
	agendaTitle.textContent = `Partidos de ${formatDayLabel(calendarState.selectedDateKey)}`;
	countLabel.textContent = `${matches.length} partido${matches.length === 1 ? "" : "s"}`;

	if (!matches.length) {
		container.innerHTML = `
			<div class="calendar-empty-state calendar-empty-state--compact">
				<strong>Agenda vacía</strong>
				<p>No hay partidos en este día. Prueba otro mes o selecciona otra fecha.</p>
			</div>
		`;
		return;
	}

	container.innerHTML = matches
		.map(
			(match) => `
				<article class="calendar-match-card" data-date="${utcDateKey(match.date)}">
					<div class="calendar-match-card__header">
						<strong>${match.stage}</strong>
						<span>${formatTime(match.date)} UTC</span>
					</div>
					<div class="calendar-match-card__teams">
						<span>${match.homeTeam}</span>
						<strong>${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}</strong>
						<span>${match.awayTeam}</span>
					</div>
					<div class="calendar-match-card__venue">${match.venue}</div>
					<button type="button" class="calendar-match-card__button" data-select-date="${utcDateKey(match.date)}">Ver este día</button>
				</article>
			`
		)
		.join("");

	container.querySelectorAll("[data-select-date]").forEach((button) => {
		button.addEventListener("click", () => {
			const selected = button.getAttribute("data-select-date");
			if (!selected) return;
			calendarState.selectedDateKey = selected;
			calendarState.currentMonth = new Date(`${selected}T00:00:00Z`);
			renderCalendar();
		});
	});
}

function selectDate(dateKey) {
	calendarState.selectedDateKey = dateKey;
	calendarState.currentMonth = createMonthAnchor(toCalendarDate(dateKey));
	renderCalendar();
}

function renderCalendarGrid() {
	const grid = document.getElementById("calendar-grid");
	if (!grid || !calendarState.currentMonth) return;

	const weekdayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
	const currentYear = calendarState.currentMonth.getUTCFullYear();
	const currentMonth = calendarState.currentMonth.getUTCMonth();
	const firstDay = new Date(Date.UTC(currentYear, currentMonth, 1));
	const firstDayOffset = firstDay.getUTCDay();
	const totalCells = 42;

	const fragments = [];

	weekdayLabels.forEach((label) => {
		fragments.push(`<div class="calendar-weekday">${label}</div>`);
	});

	for (let index = 0; index < totalCells; index += 1) {
		const dayNumber = index - firstDayOffset + 1;
		const cellDate = new Date(Date.UTC(currentYear, currentMonth, dayNumber));
		const cellKey = cellDate.toISOString().slice(0, 10);
		const isCurrentMonth = cellDate.getUTCMonth() === currentMonth;
		const isSelected = cellKey === calendarState.selectedDateKey;
		const isToday = cellKey === calendarState.todayKey;
		const matchCount = getMatchesForDate(cellKey).length;

		fragments.push(`
			<button
				type="button"
				class="calendar-day ${isCurrentMonth ? "" : "calendar-day--muted"} ${isSelected ? "calendar-day--selected" : ""} ${isToday ? "calendar-day--today" : ""} ${matchCount ? "calendar-day--has-match" : ""}"
				data-date="${cellKey}"
				aria-label="${formatDayLabel(cellKey)}${matchCount ? `, ${matchCount} partido${matchCount === 1 ? "" : "s"}` : ""}"
			>
				<span class="calendar-day__number">${cellDate.getUTCDate()}</span>
				<span class="calendar-day__meta">${matchCount ? `${matchCount} partido${matchCount === 1 ? "" : "s"}` : isCurrentMonth ? "Libre" : ""}</span>
				${matchCount ? '<span class="calendar-day__dot"></span>' : ""}
			</button>
		`);
	}

	grid.innerHTML = fragments.join("");

	grid.querySelectorAll("[data-date]").forEach((button) => {
		button.addEventListener("click", () => {
			const dateKey = button.getAttribute("data-date");
			if (!dateKey) return;
			selectDate(dateKey);
		});
	});
}

function renderCalendar() {
	renderCalendarHeader();
	renderCalendarGrid();
	renderSelectedDayPanel();
	renderAgenda();
}

async function initializeCalendar() {
	const matches = await fetchJson("/api/matches");
	const grid = document.getElementById("calendar-grid");
	const summary = document.getElementById("calendar-day-summary");
	if (!grid || !summary) return;

	if (!matches || !matches.length) {
		grid.innerHTML = `<div class="data-placeholder calendar-grid__empty">No se pudieron cargar los partidos.</div>`;
		summary.innerHTML = `<div class="calendar-empty-state"><strong>Sin datos</strong><p>No hay partidos disponibles para construir el calendario.</p></div>`;
		return;
	}

	calendarState.matches = matches;
	calendarState.matchesByDate = buildMatchesByDate(matches);

	const firstMatchDate = new Date(matches[0].date);
	const monthFromMatches = createMonthAnchor(firstMatchDate);
	const currentMonth = createMonthAnchor(new Date());

	calendarState.currentMonth = monthFromMatches > currentMonth ? monthFromMatches : currentMonth;
	calendarState.selectedDateKey = calendarState.matchesByDate.has(calendarState.todayKey)
		? calendarState.todayKey
		: utcDateKey(matches[0].date);

	const prevButton = document.getElementById("calendar-prev");
	const nextButton = document.getElementById("calendar-next");

	if (prevButton && !prevButton.dataset.bound) {
		prevButton.dataset.bound = "true";
		prevButton.addEventListener("click", () => {
			calendarState.currentMonth = new Date(
				Date.UTC(
					calendarState.currentMonth.getUTCFullYear(),
					calendarState.currentMonth.getUTCMonth() - 1,
					1
				)
			);
			renderCalendar();
		});
	}

	if (nextButton && !nextButton.dataset.bound) {
		nextButton.dataset.bound = "true";
		nextButton.addEventListener("click", () => {
			calendarState.currentMonth = new Date(
				Date.UTC(
					calendarState.currentMonth.getUTCFullYear(),
					calendarState.currentMonth.getUTCMonth() + 1,
					1
				)
			);
			renderCalendar();
		});
	}

	renderCalendar();
}

document.addEventListener("DOMContentLoaded", () => {
	initializeCalendar();
});
