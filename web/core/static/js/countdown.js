let countdownInterval = null;
let nextMatchInterval = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown(container) {
  const target = container.dataset.target;
  if (!target) return;

  const status = document.getElementById("countdown-status");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const targetDate = new Date(target);

  function tick() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (status) status.textContent = "THE FINAL HAS STARTED";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    if (status) status.textContent = "Final countdown in progress";
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function setCountdownTarget(dateString) {
  const countdownContainer = document.getElementById("countdown");
  if (!countdownContainer) return;

  countdownContainer.dataset.target = dateString;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  updateCountdown(countdownContainer);
}

function updateNextMatchCountdown(targetDateString) {
  const countdownEl = document.getElementById("nextMatchCountdown");
  if (!countdownEl || !targetDateString) return;

  if (nextMatchInterval) {
    clearInterval(nextMatchInterval);
    nextMatchInterval = null;
  }

  const targetDate = new Date(targetDateString);

  function tick() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      countdownEl.textContent = "Match started";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }

  tick();
  nextMatchInterval = setInterval(tick, 1000);
}

function registerSportsTicker() {
  const ticker = document.getElementById("ticker");
  if (!ticker) return;

  const track = ticker.querySelector(".ticker__track");
  if (!track) return;

  const firstClone = track.cloneNode(true);
  firstClone.classList.add("ticker__track--clone");
  ticker.appendChild(firstClone);
}

function initCountdown() {
  const countdownContainer = document.getElementById("countdown");
  if (countdownContainer) {
    updateCountdown(countdownContainer);
  }
}

window.setCountdownTarget = setCountdownTarget;
window.updateNextMatchCountdown = updateNextMatchCountdown;

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  updateNextMatchCountdown("2026-07-20T16:30:00Z");
  registerSportsTicker();
});
