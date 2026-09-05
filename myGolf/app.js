document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTabId = button.getAttribute("data-tab");

      // 모든 버튼과 탭 패널의 active 클래스 제거
      navButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      // 클릭한 탭과 버튼 활성화
      button.classList.add("active");
      const activePanel = document.getElementById(targetTabId);
      if (activePanel) {
        activePanel.classList.add("active");
      }
    });
  });
});