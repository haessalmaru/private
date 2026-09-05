document.addEventListener("DOMContentLoaded", () => {
  // 1. 하단 탭 전환
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

  // 2. 칩 그룹 셋업 (일지 탭)
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

  // 3. 힘빼기 슬라이더
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

  // 4. 이전 Next-Action 불러오기
  const prevActionDisplay = document.getElementById("prev-action-display");
  function loadPreviousAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    if (logs.length > 0) {
      const latest = logs[logs.length - 1];
      prevActionDisplay.textContent = `🎯 ${latest.nextAction} (기록일: ${latest.date})`;
    }
  }
  loadPreviousAction();

  // 5. 연습 일지 저장
  const practiceForm = document.getElementById("practice-form");
  practiceForm.addEventListener("submit", (e) => {
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

  // ==========================================
  // 6. 클럽 스펙 관리 모듈 (My Gear)
  // ==========================================
  const toggleClubFormBtn = document.getElementById("toggle-club-form-btn");
  const clubForm = document.getElementById("club-form");
  const clubList = document.getElementById("club-list");

  toggleClubFormBtn.addEventListener("click", () => {
    clubForm.classList.toggle("show");
    toggleClubFormBtn.textContent = clubForm.classList.contains("show") ? "닫기" : "+ 클럽 추가";
  });

  function renderClubs() {
    const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
    clubList.innerHTML = "";

    if (clubs.length === 0) {
      clubList.innerHTML = '<div class="empty-notice">등록된 클럽이 없습니다. 상단의 "+ 클럽 추가"를 눌러 장비를 등록하세요.</div>';
      return;
    }

    clubs.forEach((club) => {
      const item = document.createElement("div");
      item.className = "item-card";
      item.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge">${club.type}</span>
            <div class="item-main-title">${club.name}</div>
          </div>
          <button type="button" class="delete-btn" data-id="${club.id}">삭제</button>
        </div>
        <div class="spec-grid">
          <div>샤프트: <strong>${club.shaft || "-"}</strong></div>
          <div>로프트: <strong>${club.loft || "-"}</strong></div>
          <div>라이각: <strong>${club.lie || "-"}</strong></div>
          <div>토크값: <strong>${club.torque || "-"}</strong></div>
        </div>
      `;
      clubList.appendChild(item);
    });

    // 클럽 삭제 이벤트
    clubList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetId = Number(e.target.getAttribute("data-id"));
        const updated = clubs.filter((c) => c.id !== targetId);
        localStorage.setItem("golf_my_clubs", JSON.stringify(updated));
        renderClubs();
      });
    });
  }

  clubForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newClub = {
      id: Date.now(),
      type: document.getElementById("club-type").value.trim(),
      name: document.getElementById("club-name").value.trim(),
      shaft: document.getElementById("club-shaft").value.trim(),
      loft: document.getElementById("club-loft").value.trim(),
      lie: document.getElementById("club-lie").value.trim(),
      torque: document.getElementById("club-torque").value.trim()
    };

    const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
    clubs.push(newClub);
    localStorage.setItem("golf_my_clubs", JSON.stringify(clubs));

    clubForm.reset();
    clubForm.classList.remove("show");
    toggleClubFormBtn.textContent = "+ 클럽 추가";
    renderClubs();
  });

  renderClubs();

  // ==========================================
  // 7. 드릴 & 레슨 관리 모듈 (Drills & Links)
  // ==========================================
  const toggleDrillFormBtn = document.getElementById("toggle-drill-form-btn");
  const drillForm = document.getElementById("drill-form");
  const drillList = document.getElementById("drill-list");

  toggleDrillFormBtn.addEventListener("click", () => {
    drillForm.classList.toggle("show");
    toggleDrillFormBtn.textContent = drillForm.classList.contains("show") ? "닫기" : "+ 레슨 추가";
  });

  function renderDrills() {
    const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
    drillList.innerHTML = "";

    if (drills.length === 0) {
      drillList.innerHTML = '<div class="empty-notice">보관된 드릴이 없습니다. 유튜브 레슨 링크를 등록해 보세요.</div>';
      return;
    }

    drills.forEach((drill) => {
      const item = document.createElement("div");
      item.className = "item-card";
      item.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge">${drill.category}</span>
            <div class="item-main-title">${drill.title}</div>
          </div>
          <button type="button" class="delete-btn" data-id="${drill.id}">삭제</button>
        </div>
        ${drill.memo ? `<div style="font-size:0.83rem; color:#aaaaaa; margin-top:4px;">💡 ${drill.memo}</div>` : ""}
        <a href="${drill.url}" target="_blank" rel="noopener noreferrer" class="link-action-btn">▶ YouTube 영상 열기</a>
      `;
      drillList.appendChild(item);
    });

    // 드릴 삭제 이벤트
    drillList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetId = Number(e.target.getAttribute("data-id"));
        const updated = drills.filter((d) => d.id !== targetId);
        localStorage.setItem("golf_drills", JSON.stringify(updated));
        renderDrills();
      });
    });
  }

  drillForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newDrill = {
      id: Date.now(),
      category: document.getElementById("drill-category").value.trim(),
      title: document.getElementById("drill-title").value.trim(),
      url: document.getElementById("drill-url").value.trim(),
      memo: document.getElementById("drill-memo").value.trim()
    };

    const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
    drills.push(newDrill);
    localStorage.setItem("golf_drills", JSON.stringify(drills));

    drillForm.reset();
    drillForm.classList.remove("show");
    toggleDrillFormBtn.textContent = "+ 레슨 추가";
    renderDrills();
  });

  renderDrills();
});