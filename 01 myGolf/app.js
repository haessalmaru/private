document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. 하단 탭 전환 네비게이션
  // ==========================================
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

  // ==========================================
  // 2. 칩 그룹 바인딩 (단일/다중 선택)
  // ==========================================
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

  // ==========================================
  // 3. 힘빼기 슬라이더 텍스트 라벨
  // ==========================================
  const tensionRange = document.getElementById("tension-level");
  const tensionDisplay = document.getElementById("tension-val");
  const tensionLabels = {
    "1": "1 (완전 부드러움)",
    "2": "2 (가벼운 악력)",
    "3": "3 (적당한 텐션)",
    "4": "4 (약간 힘들어감)",
    "5": "5 (경직됨)"
  };
  if (tensionRange && tensionDisplay) {
    tensionRange.addEventListener("input", (e) => {
      tensionDisplay.textContent = tensionLabels[e.target.value] || e.target.value;
    });
  }

  // ==========================================
  // 4. 통계 요약 및 직전 연습 복기 로직
  // ==========================================
  function updateSummaryAndPrevAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    
    const prevActionDisplay = document.getElementById("prev-action-display");
    if (prevActionDisplay) {
      if (logs.length > 0) {
        const latest = logs[logs.length - 1];
        prevActionDisplay.textContent = `🎯 ${latest.nextAction} (기록일: ${latest.date})`;
      } else {
        prevActionDisplay.textContent = "아직 이전 기록이 없습니다. 힘빼고 가볍게 스윙을 시작하세요!";
      }
    }

    const totalCount = logs.length;
    const totalSessionsEl = document.getElementById("sum-total-sessions");
    if (totalSessionsEl) totalSessionsEl.textContent = `${totalCount}회`;

    if (totalCount === 0) {
      const drawEl = document.getElementById("sum-draw-rate");
      const backEl = document.getElementById("sum-back-pain-rate");
      const tenEl = document.getElementById("sum-avg-tension");
      const missEl = document.getElementById("sum-top-miss");
      if (drawEl) drawEl.textContent = "0%";
      if (backEl) backEl.textContent = "0%";
      if (tenEl) tenEl.textContent = "-";
      if (missEl) missEl.textContent = "주요 미스샷 트리거: 데이터 수집 중";
      return;
    }

    const drawCount = logs.filter(l => l.ballFlight && l.ballFlight.includes("드로우")).length;
    const drawRate = Math.round((drawCount / totalCount) * 100);
    const drawEl = document.getElementById("sum-draw-rate");
    if (drawEl) drawEl.textContent = `${drawRate}%`;

    const backPainCount = logs.filter(l => Array.isArray(l.painParts) && l.painParts.includes("허리/요추")).length;
    const backPainRate = Math.round((backPainCount / totalCount) * 100);
    const backEl = document.getElementById("sum-back-pain-rate");
    if (backEl) backEl.textContent = `${backPainRate}%`;

    const totalTension = logs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgTension = (totalTension / totalCount).toFixed(1);
    const tenEl = document.getElementById("sum-avg-tension");
    if (tenEl) tenEl.textContent = `${avgTension} / 5.0`;

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
    const missEl = document.getElementById("sum-top-miss");
    if (missEl) missEl.textContent = `주요 미스샷 트리거: ${topMiss} (${maxFreq}회 감지)`;
  }

  updateSummaryAndPrevAction();

  // ==========================================
  // 5. 연습 일지 저장
  // ==========================================
  const practiceForm = document.getElementById("practice-form");
  if (practiceForm) {
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
        tensionLevel: tensionRange ? tensionRange.value : "3",
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
  }

  // ==========================================
  // 6. 연습 일지 엑셀 CSV 내보내기 & 전체 백업/복원
  // ==========================================
  const exportCsvBtn = document.getElementById("export-csv-btn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      if (logs.length === 0) {
        alert("내보낼 연습 일지 데이터가 없습니다.");
        return;
      }

      const headers = [
        "연습회차", "날짜", "연습시간(분)", "통증부위", "통증정도(0-3)", 
        "구질결과", "힘빼기텐션(1-5)", "체중이동방식", "미스샷원인", "다음과제"
      ];

      const rows = logs.map((l, index) => [
        index + 1,
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
  }

  // 전체 JSON 백업
  const exportJsonBtn = document.getElementById("export-json-btn");
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", () => {
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
  }

  // JSON 백업 복원
  const importFileInput = document.getElementById("import-file");
  if (importFileInput) {
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
  }

  // ==========================================
  // 7. 클럽 정밀 스펙 관리 모듈 (수정 기능 & 아코디언 상세 보기)
  // ==========================================
  const toggleClubFormBtn = document.getElementById("toggle-club-form-btn");
  const clubForm = document.getElementById("club-form");
  const clubFormTitle = document.getElementById("club-form-title");
  const submitClubBtn = document.getElementById("submit-club-btn");
  const cancelClubEditBtn = document.getElementById("cancel-club-edit-btn");
  const clubEditIdInput = document.getElementById("club-edit-id");

  const clubList = document.getElementById("club-list");
  const clubTypeSelect = document.getElementById("club-type");
  const headSpecGroup = document.getElementById("head-spec-group");
  const wedgeSpecGroup = document.getElementById("wedge-spec-group");

  function updateConditionalFields() {
    if (!clubTypeSelect) return;
    const selected = clubTypeSelect.value;
    
    // 1. 드라이버/우드/유틸
    if (headSpecGroup) {
      headSpecGroup.style.display = ["드라이버", "우드", "유틸"].includes(selected) ? "block" : "none";
    }
    // 2. 웨지
    if (wedgeSpecGroup) {
      wedgeSpecGroup.style.display = (selected === "웨지") ? "flex" : "none";
    }
  }

  if (clubTypeSelect) {
    clubTypeSelect.addEventListener("change", updateConditionalFields);
    updateConditionalFields();
  }

  // 클럽 폼 리셋 (등록/수정 모드 초기화)
  function resetClubForm() {
    if (!clubForm) return;
    clubForm.reset();
    clubEditIdInput.value = "";
    clubFormTitle.textContent = "신규 클럽 상세 스펙 등록";
    submitClubBtn.textContent = "클럽 정밀 스펙 저장";
    cancelClubEditBtn.style.display = "none";
    clubForm.classList.remove("show");
    toggleClubFormBtn.textContent = "+ 클럽 추가";
    updateConditionalFields();
  }

  if (toggleClubFormBtn && clubForm) {
    toggleClubFormBtn.addEventListener("click", () => {
      if (clubForm.classList.contains("show")) {
        resetClubForm();
      } else {
        resetClubForm();
        clubForm.classList.add("show");
        toggleClubFormBtn.textContent = "닫기";
        updateConditionalFields();
      }
    });
  }

  if (cancelClubEditBtn) {
    cancelClubEditBtn.addEventListener("click", resetClubForm);
  }

  // 안전한 값 추출/주입 헬퍼
  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  // 클럽 수정 모드로 폼에 데이터 채우기
  function editClub(id) {
    const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
    const target = clubs.find((c) => c.id === id);
    if (!target) return;

    clubEditIdInput.value = target.id;
    setVal("club-distance", target.distance);
    setVal("club-status", target.status || "사용");
    setVal("club-type", target.type || "드라이버");
    setVal("club-subname", target.subname);
    setVal("club-maker", target.maker);
    setVal("club-model", target.model);
    setVal("club-head-volume", target.headVolume);
    setVal("club-head-weight", target.headWeight);
    setVal("club-head-weight-screw", target.headWeightScrew);
    setVal("club-loft", target.loft);
    setVal("club-lie", target.lie);
    setVal("club-wedge-bounce", target.wedgeBounce);
    setVal("club-wedge-grind", target.wedgeGrind);
    setVal("club-shaft-material", target.shaftMaterial || "그라파이트");
    setVal("club-shaft-name", target.shaftName);
    setVal("club-shaft-weight", target.shaftWeight);
    setVal("club-flex", target.flex || "S");
    setVal("club-cpm", target.cpm);
    setVal("club-torque", target.torque);
    setVal("club-kickpoint", target.kickpoint);
    setVal("club-grip-type", target.gripType);
    setVal("club-grip-size", target.gripSize);
    setVal("club-grip-weight", target.gripWeight);
    setVal("club-total-weight", target.totalWeight);
    setVal("club-swingweight", target.swingweight);
    setVal("club-length", target.length);
    setVal("club-price", target.price);
    setVal("club-buy-date", target.buyDate);

    updateConditionalFields();

    clubFormTitle.textContent = `🛠️ [${target.subname || ""} ${target.model || ""}] 스펙 수정`;
    submitClubBtn.textContent = "클럽 스펙 수정 완료";
    cancelClubEditBtn.style.display = "inline-block";

    clubForm.classList.add("show");
    toggleClubFormBtn.textContent = "닫기";
    clubForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 클럽 카드 렌더링 (요약 비교뷰 + 클릭 시 상세 확장)
  function renderClubs() {
    if (!clubList) return;
    const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
    clubList.innerHTML = "";

    if (clubs.length === 0) {
      clubList.innerHTML = '<div class="empty-notice">등록된 클럽이 없습니다. 상단의 "+ 클럽 추가"를 눌러 장비를 등록하세요.</div>';
      return;
    }

    clubs.forEach((club) => {
      const statusBadgeColor = club.status === "사용" ? "#2e7d32" : (club.status === "보유" ? "#1565c0" : "#757575");
      const item = document.createElement("div");
      item.className = "item-card club-expandable-card";
      item.setAttribute("data-club-id", club.id);

      item.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge" style="background-color: ${statusBadgeColor}; color:#fff;">${club.status || "사용"}</span>
            <span class="item-badge" style="margin-left:4px;">${club.type || ""} · ${club.subname || ""}</span>
            <span class="item-badge" style="margin-left:4px; background-color:#1e3d2f; color:#81c784;">🎯 ${club.distance || "-"}</span>
            <div class="item-main-title" style="margin-top:6px; font-size:1.02rem;">
              ${club.maker ? club.maker + ' ' : ''}<strong>${club.model || ''}</strong>
            </div>
          </div>
          <div class="card-action-group">
            <button type="button" class="action-text-btn edit-club-btn" data-id="${club.id}">수정</button>
            <button type="button" class="action-text-btn delete-club-btn" data-id="${club.id}">삭제</button>
          </div>
        </div>

        <!-- 1) 기본 비교 요약 뷰 (요청하신 9가지 핵심 스펙) -->
        <div class="spec-grid spec-summary-grid">
          <div>로프트/라이: <strong>${club.loft || "-"} / ${club.lie || "-"}</strong></div>
          <div>샤프트: <strong>${club.shaftWeight ? club.shaftWeight : '-'} (${club.flex || '-'})</strong></div>
          <div>토크 / 킥: <strong>${club.torque || "-"} / ${club.kickpoint || "-"}</strong></div>
          <div>스윙웨이트: <strong style="color:#81c784;">${club.swingweight || "-"}</strong></div>
        </div>

        <!-- 2) 클릭 시 확장되는 세부 스펙 뷰 (아코디언) -->
        <div class="club-detail-drawer" id="detail-${club.id}">
          <div class="detail-divider"></div>
          <div class="spec-grid spec-detail-grid">
            <div>토털 웨이트: <strong style="color:#81c784;">${club.totalWeight || "-"}</strong></div>
            <div>샤프트 모델: <strong>${club.shaftMaterial || ""} ${club.shaftName || "-"}</strong></div>
            <div>CPM (진동수): <strong>${club.cpm ? club.cpm + ' cpm' : '-'}</strong></div>
            <div>클럽 길이: <strong>${club.length || "-"}</strong></div>
            <div>그립 제원: <strong>${club.gripType || "-"} (${club.gripSize || "표준"}, ${club.gripWeight || "-"})</strong></div>
            ${club.type === "웨지" ? `<div>웨지 바운스/그라인드: <strong>${club.wedgeBounce || "-"} / ${club.wedgeGrind || "-"}</strong></div>` : ""}
            ${(club.headVolume || club.headWeight || club.headWeightScrew) ? `<div>헤드/무게추: <strong>${club.headVolume || '-'} / ${club.headWeight || '-'}(추 ${club.headWeightScrew || '0g'})</strong></div>` : ""}
            <div>구입 이력: <strong>${club.buyDate || '-'} (${club.price ? club.price + '원' : '-'})</strong></div>
          </div>
        </div>
        <div class="expand-hint">터치하여 상세 스펙 펼치기 ▾</div>
      `;

      // 카드 클릭 시 세부 스펙 토글 (단, 수정/삭제 버튼 클릭 시 제외)
      item.addEventListener("click", (e) => {
        if (e.target.closest(".action-text-btn")) return;
        const drawer = item.querySelector(".club-detail-drawer");
        const hint = item.querySelector(".expand-hint");
        const isExpanded = drawer.classList.toggle("open");
        hint.textContent = isExpanded ? "터치하여 상세 스펙 접기 ▴" : "터치하여 상세 스펙 펼치기 ▾";
      });

      clubList.appendChild(item);
    });

    // 수정 버튼 이벤트 연결
    clubList.querySelectorAll(".edit-club-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetId = Number(e.target.getAttribute("data-id"));
        editClub(targetId);
      });
    });

    // 삭제 버튼 이벤트 연결
    clubList.querySelectorAll(".delete-club-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm("이 클럽 스펙을 삭제하시겠습니까?")) return;
        const targetId = Number(e.target.getAttribute("data-id"));
        const updated = clubs.filter((c) => c.id !== targetId);
        localStorage.setItem("golf_my_clubs", JSON.stringify(updated));
        if (Number(clubEditIdInput.value) === targetId) resetClubForm();
        renderClubs();
      });
    });
  }

  // 클럽 등록 및 수정 폼 제출
  if (clubForm) {
    clubForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const subname = getVal("club-subname");
      const model = getVal("club-model");

      if (!subname || !model) {
        alert("클럽구분(넘버/각도)과 모델명은 필수 입력 항목입니다.");
        return;
      }

      const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
      const editId = clubEditIdInput.value ? Number(clubEditIdInput.value) : null;

      const clubData = {
        id: editId ? editId : Date.now(),
        distance: getVal("club-distance"),
        status: getVal("club-status") || "사용",
        type: getVal("club-type") || "드라이버",
        subname: subname,
        maker: getVal("club-maker"),
        model: model,
        headVolume: getVal("club-head-volume"),
        headWeight: getVal("club-head-weight"),
        headWeightScrew: getVal("club-head-weight-screw"),
        loft: getVal("club-loft"),
        lie: getVal("club-lie"),
        wedgeBounce: getVal("club-wedge-bounce"),
        wedgeGrind: getVal("club-wedge-grind"),
        shaftMaterial: getVal("club-shaft-material"),
        shaftName: getVal("club-shaft-name"),
        shaftWeight: getVal("club-shaft-weight"),
        flex: getVal("club-flex") || "S",
        cpm: getVal("club-cpm"),
        torque: getVal("club-torque"),
        kickpoint: getVal("club-kickpoint"),
        gripType: getVal("club-grip-type"),
        gripSize: getVal("club-grip-size"),
        gripWeight: getVal("club-grip-weight"),
        totalWeight: getVal("club-total-weight"),
        swingweight: getVal("club-swingweight"),
        length: getVal("club-length"),
        price: getVal("club-price"),
        buyDate: getVal("club-buy-date")
      };

      if (editId) {
        const index = clubs.findIndex((c) => c.id === editId);
        if (index !== -1) {
          clubs[index] = clubData;
          alert(`✅ [${clubData.subname} ${clubData.model}] 클럽 스펙이 수정되었습니다!`);
        }
      } else {
        clubs.push(clubData);
        alert(`✅ [${clubData.subname} ${clubData.model}] 새 클럽이 등록되었습니다!`);
      }

      localStorage.setItem("golf_my_clubs", JSON.stringify(clubs));
      resetClubForm();
      renderClubs();
    });
  }

  renderClubs();

  // 클럽 데이터 CSV 내보내기
  const exportClubCsvBtn = document.getElementById("export-club-csv-btn");
  if (exportClubCsvBtn) {
    exportClubCsvBtn.addEventListener("click", () => {
      const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
      if (clubs.length === 0) {
        alert("내보낼 클럽 스펙 데이터가 없습니다.");
        return;
      }

      const headers = [
        "No", "목표비거리", "구분", "종류", "클럽구분(넘버/각도)", "메이커", "모델명",
        "헤드체적(cc)", "헤드본체무게(g)", "헤드무게추(g)", "로프트", "라이각", "웨지바운스", "웨지그라인드",
        "샤프트소재", "샤프트모델", "샤프트단품무게(g)", "강도", "CPM", "토크", "킥포인트",
        "그립종류", "그립사이즈", "그립무게(g)", "토털웨이트(총중량g)", "스윙웨이트", "길이(inch)",
        "구입가격", "구입일자"
      ];

      const rows = clubs.map((c, index) => [
        index + 1,
        `"${c.distance || ''}"`,
        `"${c.status || ''}"`,
        `"${c.type || ''}"`,
        `"${c.subname || ''}"`,
        `"${c.maker || ''}"`,
        `"${c.model || ''}"`,
        `"${c.headVolume || ''}"`,
        `"${c.headWeight || ''}"`,
        `"${c.headWeightScrew || ''}"`,
        `"${c.loft || ''}"`,
        `"${c.lie || ''}"`,
        `"${c.wedgeBounce || ''}"`,
        `"${c.wedgeGrind || ''}"`,
        `"${c.shaftMaterial || ''}"`,
        `"${c.shaftName || ''}"`,
        `"${c.shaftWeight || ''}"`,
        `"${c.flex || ''}"`,
        `"${c.cpm || ''}"`,
        `"${c.torque || ''}"`,
        `"${c.kickpoint || ''}"`,
        `"${c.gripType || ''}"`,
        `"${c.gripSize || ''}"`,
        `"${c.gripWeight || ''}"`,
        `"${c.totalWeight || ''}"`,
        `"${c.swingweight || ''}"`,
        `"${c.length || ''}"`,
        `"${c.price || ''}"`,
        `"${c.buyDate || ''}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `마이클럽스펙_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================
  // 8. 드릴 & 레슨 관리 모듈 (수정 기능 추가)
  // ==========================================
  const toggleDrillFormBtn = document.getElementById("toggle-drill-form-btn");
  const drillForm = document.getElementById("drill-form");
  const drillFormTitle = document.getElementById("drill-form-title");
  const submitDrillBtn = document.getElementById("submit-drill-btn");
  const cancelDrillEditBtn = document.getElementById("cancel-drill-edit-btn");
  const drillEditIdInput = document.getElementById("drill-edit-id");
  const drillList = document.getElementById("drill-list");

  function resetDrillForm() {
    if (!drillForm) return;
    drillForm.reset();
    drillEditIdInput.value = "";
    drillFormTitle.textContent = "신규 레슨/드릴 저장";
    submitDrillBtn.textContent = "드릴 저장";
    cancelDrillEditBtn.style.display = "none";
    drillForm.classList.remove("show");
    toggleDrillFormBtn.textContent = "+ 레슨 추가";
  }

  if (toggleDrillFormBtn && drillForm) {
    toggleDrillFormBtn.addEventListener("click", () => {
      if (drillForm.classList.contains("show")) {
        resetDrillForm();
      } else {
        resetDrillForm();
        drillForm.classList.add("show");
        toggleDrillFormBtn.textContent = "닫기";
      }
    });
  }

  if (cancelDrillEditBtn) {
    cancelDrillEditBtn.addEventListener("click", resetDrillForm);
  }

  function editDrill(id) {
    const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
    const target = drills.find((d) => d.id === id);
    if (!target) return;

    drillEditIdInput.value = target.id;
    setVal("drill-category", target.category);
    setVal("drill-title", target.title);
    setVal("drill-url", target.url);
    setVal("drill-memo", target.memo);

    drillFormTitle.textContent = "🛠️ 레슨/드릴 내용 수정";
    submitDrillBtn.textContent = "드릴 수정 완료";
    cancelDrillEditBtn.style.display = "inline-block";

    drillForm.classList.add("show");
    toggleDrillFormBtn.textContent = "닫기";
    drillForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderDrills() {
    if (!drillList) return;
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
            <div class="item-main-title" style="margin-top:4px;">${drill.title}</div>
          </div>
          <div class="card-action-group">
            <button type="button" class="action-text-btn edit-drill-btn" data-id="${drill.id}">수정</button>
            <button type="button" class="action-text-btn delete-drill-btn" data-id="${drill.id}">삭제</button>
          </div>
        </div>
        ${drill.memo ? `<div style="font-size:0.83rem; color:#aaaaaa; margin-top:4px;">💡 ${drill.memo}</div>` : ""}
        <a href="${drill.url}" target="_blank" rel="noopener noreferrer" class="link-action-btn">▶ YouTube 영상 열기</a>
      `;
      drillList.appendChild(item);
    });

    drillList.querySelectorAll(".edit-drill-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetId = Number(e.target.getAttribute("data-id"));
        editDrill(targetId);
      });
    });

    drillList.querySelectorAll(".delete-drill-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (!confirm("이 드릴을 삭제하시겠습니까?")) return;
        const targetId = Number(e.target.getAttribute("data-id"));
        const updated = drills.filter((d) => d.id !== targetId);
        localStorage.setItem("golf_drills", JSON.stringify(updated));
        if (Number(drillEditIdInput.value) === targetId) resetDrillForm();
        renderDrills();
      });
    });
  }

  if (drillForm) {
    drillForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
      const editId = drillEditIdInput.value ? Number(drillEditIdInput.value) : null;

      const drillData = {
        id: editId ? editId : Date.now(),
        category: getVal("drill-category"),
        title: getVal("drill-title"),
        url: getVal("drill-url"),
        memo: getVal("drill-memo")
      };

      if (editId) {
        const index = drills.findIndex((d) => d.id === editId);
        if (index !== -1) {
          drills[index] = drillData;
          alert("✅ 드릴 내용이 수정되었습니다!");
        }
      } else {
        drills.push(drillData);
        alert("✅ 새 드릴이 보관함에 등록되었습니다!");
      }

      localStorage.setItem("golf_drills", JSON.stringify(drills));
      resetDrillForm();
      renderDrills();
    });
  }

  renderDrills();
});

// ==========================================
// 9. PWA 서비스 워커 등록
// ==========================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("PWA ServiceWorker Ready"))
      .catch((err) => console.log("PWA ServiceWorker Failed:", err));
  });
}