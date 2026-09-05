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

  // 2. 칩 그룹 바인딩
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

  // 3. 힘빼기 슬라이더 라벨
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

  // 4. 통계 요약 및 직전 연습 복기 로직
  function updateSummaryAndPrevAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    
    // 직전 과제 표시
    const prevActionDisplay = document.getElementById("prev-action-display");
    if (logs.length > 0) {
      const latest = logs[logs.length - 1];
      prevActionDisplay.textContent = `🎯 ${latest.nextAction} (기록일: ${latest.date})`;
    } else {
      prevActionDisplay.textContent = "아직 이전 기록이 없습니다. 힘빼고 가볍게 스윙을 시작하세요!";
    }

    // 통계 계산
    const totalCount = logs.length;
    document.getElementById("sum-total-sessions").textContent = `${totalCount}회`;

    if (totalCount === 0) {
      document.getElementById("sum-draw-rate").textContent = "0%";
      document.getElementById("sum-back-pain-rate").textContent = "0%";
      document.getElementById("sum-avg-tension").textContent = "-";
      document.getElementById("sum-top-miss").textContent = "주요 미스샷 트리거: 데이터 수집 중";
      return;
    }

    // 드로우 달성률
    const drawCount = logs.filter(l => l.ballFlight && l.ballFlight.includes("드로우")).length;
    const drawRate = Math.round((drawCount / totalCount) * 100);
    document.getElementById("sum-draw-rate").textContent = `${drawRate}%`;

    // 허리 통증 빈도
    const backPainCount = logs.filter(l => Array.isArray(l.painParts) && l.painParts.includes("허리/요추")).length;
    const backPainRate = Math.round((backPainCount / totalCount) * 100);
    document.getElementById("sum-back-pain-rate").textContent = `${backPainRate}%`;

    // 평균 텐션 점수
    const totalTension = logs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgTension = (totalTension / totalCount).toFixed(1);
    document.getElementById("sum-avg-tension").textContent = `${avgTension} / 5.0`;

    // 최빈 미스샷 트리거
    const missMap = {};
    logs.forEach(l => {
      if (Array.isArray(l.missReasons)) {
        l.missReasons.forEach(r => {
          missMap[r] = (missMap[r] || 0) + 1;
        });
      }
    });

    let topMiss = "-";
    let maxFreq = 0;
    for (const [key, val] of Object.entries(missMap)) {
      if (val > maxFreq) {
        maxFreq = val;
        topMiss = key;
      }
    }
    document.getElementById("sum-top-miss").textContent = `주요 미스샷 트리거: ${topMiss} (${maxFreq}회 감지)`;
  }

  updateSummaryAndPrevAction();

  // 5. 일지 저장
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
    updateSummaryAndPrevAction();
  });

  // ==========================================
  // 6. 엑셀 CSV 내보내기 & 데이터 백업/복원 모듈
  // ==========================================
  
  // CSV 내보내기 (한글 깨짐 방지 UTF-8 BOM 탑재)
  document.getElementById("export-csv-btn").addEventListener("click", () => {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    if (logs.length === 0) {
      alert("내보낼 연습 일지 데이터가 없습니다.");
      return;
    }

    const headers = [
      "No", "날짜", "연습시간(분)", "통증부위", "통증정도(0-3)", 
      "구질결과", "힘빼기텐션(1-5)", "체중이동방식", "미스샷원인", "다음과제"
    ];

    // 기존: const rows = logs.map(l => [ l.id, ...
    // 수정: 순번(index + 1)으로 직관적으로 출력
    const rows = logs.map((l, index) => [
      index + 1, // 1, 2, 3... 회차 순번
      `"${l.date}"`,
      l.duration,
      `"${(l.painParts || []).join(', ')}"`,
      l.painLevel,
      `"${l.ballFlight}"`,
      l.tensionLevel,
      `"${l.weightTransfer}"`,
      `"${(l.missReasons || []).join(', ')}"`,
      `"${(l.nextAction || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `골프연습일지_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // JSON 전체 백업 내보내기
  document.getElementById("export-json-btn").addEventListener("click", () => {
    const backupData = {
      logs: JSON.parse(localStorage.getItem("golf_practice_logs") || "[]"),
      clubs: JSON.parse(localStorage.getItem("golf_my_clubs") || "[]"),
      drills: JSON.parse(localStorage.getItem("golf_drills") || "[]"),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `myGolf_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // 백업 파일 불러와서 복원하기
  const importFileInput = document.getElementById("import-file");
  importFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.logs) localStorage.setItem("golf_practice_logs", JSON.stringify(data.logs));
        if (data.clubs) localStorage.setItem("golf_my_clubs", JSON.stringify(data.clubs));
        if (data.drills) localStorage.setItem("golf_drills", JSON.stringify(data.drills));

        alert("백업 파일로부터 모든 데이터가 성공적으로 복원되었습니다!");
        updateSummaryAndPrevAction();
        renderClubs();
        renderDrills();
      } catch (err) {
        alert("올바르지 않은 백업 파일 형식입니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  // ==========================================
  // 7. 클럽 스펙 관리 모듈
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
  // 8. 드릴 & 레슨 관리 모듈
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

// PWA 서비스 워커 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("PWA ServiceWorker Ready"))
      .catch((err) => console.log("PWA ServiceWorker Failed:", err));
  });
}