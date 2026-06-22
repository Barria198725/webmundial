function pad(value) {
  return String(value).padStart(2, "0");
}

document.addEventListener("DOMContentLoaded", () => {
  const countdown = document.querySelector(".hero__countdown");
  if (!countdown) return;

  const target = countdown.dataset.target;
  if (!target) return;

  const targetDate = new Date(target);

  function update() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      countdown.querySelectorAll("span").forEach((span) => (span.textContent = "00"));
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = pad(days);
    document.getElementById("hours").textContent = pad(hours);
    document.getElementById("minutes").textContent = pad(minutes);
    document.getElementById("seconds").textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
});
