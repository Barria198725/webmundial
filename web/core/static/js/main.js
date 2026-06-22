document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".accordion__toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const panel = toggle.nextElementSibling;
      if (!panel) return;
      const isOpen = panel.clientHeight > 0;
      panel.style.maxHeight = isOpen ? "0" : `${panel.scrollHeight}px`;
    });
  });

  const inputs = document.querySelectorAll(".prediction-row input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.style.borderColor = "rgba(0,255,135,0.6)";
    });
    input.addEventListener("blur", () => {
      input.style.borderColor = "rgba(255,255,255,0.12)";
    });
  });
});
