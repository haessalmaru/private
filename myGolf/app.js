document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTabId = button.getAttribute("data-tab");
      navButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      const activePanel = document.getElementById(targetTabId);
      if (activePanel) activePanel.classList.add("active");
    });
  });

  function setupSingleChipGroup(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll(".chip-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  function setupMultiChipGroup(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll(".chip-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-val");
        if (val === "이상 없음") {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          return;
        }
        const noPainBtn = container.querySelector('[data-val="이상 없음"]');
        if (noPainBtn) noPainBtn.classList.remove("active");
        btn.classList.toggle("active");
      });
    });
  }

  setupSingleChipGroup("duration-group");
  setupSingleChipGroup("ball-flight-group");
  setupMultiChipGroup("pain-part-group");
  setupMultiChipGroup("miss-reason-group");

  const tensionRange = document.getElementById("tension-level");
  const tensionDisplay = document.getElementById("tension-val");
  const tensionLabels = {
    "1": "1 (완전 부드러움)",
    "2": "2 (가벼운 악력)",
    "3": "3 (적당한 텐션)",
    "4": "4 (약간 힘들어감)",
    "5": "5 (경직됨)"
  };
  tensionRange.addEventListener("input", (e) => {
    tensionDisplay.textContent = tensionLabels[e.target.value] || e.target.value;
  });

  const prevActionDisplay = document.getElementById("prev-action-display");
  function loadPreviousAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    if (logs.length > 0) {
      const latest = logs[logs.length - 1];
      prevActionDisplay.textContent = `🎯 ${latest.nextAction} (기록일: ${latest.date})`;
    }
  }
  loadPreviousAction();

  const form = document.getElementById("practice-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const getActiveSingle = (containerId) => {
      const active = document.querySelector(`#${containerId} .chip-btn.active`);
      return active ? active.getAttribute("data-val") : "";
    };
    const getActiveMulti = (containerId) => {
      const actives = document.querySelectorAll(`#${containerId} .chip-btn.active`);
      return Array.from(actives).map((btn) => btn.getAttribute("data-val"));
    };

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ko-KR"),
      duration: getActiveSingle("duration-group"),
      painParts: getActiveMulti("pain-part-group"),
      painLevel: document.getElementById("pain-level").value,
      ballFlight: getActiveSingle("ball-flight-group"),
      tensionLevel: tensionRange.value,
      weightTransfer: document.getElementById("weight-transfer").value,
      missReasons: getActiveMulti("miss-reason-group"),
      nextAction: document.getElementById("next-action-input").value.trim()
    };

    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    logs.push(newLog);
    localStorage.setItem("golf_practice_logs", JSON.stringify(logs));

    alert("오늘의 연습 일지가 안전하게 저장되었습니다!");
    document.getElementById("next-action-input").value = "";
    loadPreviousAction();
  });
});