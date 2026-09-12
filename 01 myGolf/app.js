document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. 미스샷 9대 원인 백과 데이터 정의
  // ==========================================
  const MISS_REASONS_DATA = [
    {
      id: "sway",
      name: "스웨이 & 슬라이드",
      action: "회전해야 할 골반과 상체가 좌우로 밀리는 현상 (백스윙 시 우측으로 밀리면 스웨이, 다운스윙 시 좌측으로 과하게 밀리면 슬라이드).",
      result: "스윙 축이 흔들려 최저점이 일정하지 않아 뒤땅, 탑볼, 심한 푸시 유발."
    },
    {
      id: "early_extension",
      name: "얼리 익스텐션 (배치기)",
      action: "다운스윙 임팩트 구간에서 척추 각도를 유지하지 못하고 골반이 공 쪽으로 전진하며 상체가 일어서는 동작.",
      result: "손이 지나갈 공간이 좁아져 손목이 일찍 풀리며 생크, 블록성 푸시, 악성 훅, 탑볼 유발."
    },
    {
      id: "head_up",
      name: "헤드업 & 시선 이탈",
      action: "공의 탄착 지점을 빨리 보려 하거나 어깨 회전 타이밍과 머리가 함께 들리며 시선이 임팩트 전에 타깃 방향으로 돌아가는 동작.",
      result: "상체 척추 각도가 무너지며 클럽이 공 상단을 치는 탑볼(Topping) 및 페이스가 열려 맞는 슬라이스 유발."
    },
    {
      id: "over_the_top",
      name: "오버 더 탑 (엎어치기)",
      action: "다운스윙 시작 시 하체 리드 대신 상체(오른쪽 어깨와 팔)가 앞으로 덤비며 클럽이 스윙 플레인 바깥쪽에서 안쪽으로 가파르게 내려오는 동작.",
      result: "극단적인 아웃-인(Out-In) 궤도를 형성해 풀 훅(당겨 치는 훅) 또는 심한 슬라이스 유발."
    },
    {
      id: "casting_scooping",
      name: "캐스팅 & 스쿠핑",
      action: "다운스윙 초기에 손목 코킹이 낚싯대를 던지듯 너무 일찍 풀리는 동작(캐스팅), 임팩트 순간 손보다 클럽 헤드가 앞서며 퍼올리듯 맞는 동작(스쿠핑).",
      result: "로프트 각이 누워 비거리 손실이 크고 클럽이 공보다 뒤에 떨어져 뒤땅, 걷어 올리며 맞는 탑볼 유발."
    },
    {
      id: "reverse_pivot",
      name: "리버스 피벗 (역피봇)",
      action: "백스윙 탑에서 체중이 왼발에 남고 상체가 타깃 쪽으로 꺾였다가, 다운스윙 때 반대로 체중이 오른발로 쏠리는 역방향 체중 이동.",
      result: "스윙 최저점이 오른발 쪽에 형성되어 전형적인 뒤땅, 보상 동작으로 인한 탑볼 및 풀 샷 유발."
    },
    {
      id: "chicken_wing",
      name: "치킨 윙",
      action: "임팩트 후 팔로우스루 구간에서 왼팔이 자연스럽게 펴지거나 로테이션되지 못하고 팔꿈치가 몸 뒤나 바깥쪽으로 구부러지는 동작.",
      result: "클럽 페이스가 제때 닫히지 않아 슬라이스를 유발하고 헤드 스피드가 급감해 비거리 대폭 감소."
    },
    {
      id: "flying_elbow",
      name: "플라잉 엘보",
      action: "백스윙 탑에서 오른쪽 팔꿈치가 지면을 향하지 않고 몸통 바깥쪽 뒤로 과도하게 벌어지는 동작.",
      result: "다운스윙 궤도가 가팔라져 오버 더 탑(엎어치기)으로 연결되기 쉽고 일관된 타격점 형성이 어려움."
    },
    {
      id: "hanging_lunging",
      name: "행잉 백 vs 상체 덤빔",
      action: "행잉 백: 임팩트 이후에도 체중이 오른발에 과도하게 남아 뒤에서 퍼올림. 런징(덤빔): 하체 이동 대신 상체 전체가 공 앞쪽으로 쏠려 나감.",
      result: "행잉 백은 뒤땅·훅 유발, 런징은 가파른 입사각으로 인한 생크·심한 슬라이스 유발."
    }
  ];

  // ==========================================
  // 1. 공통 모달 오버레이 제어 로직
  // ==========================================
  const modalOverlay = document.getElementById("app-modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  function openModal(title, htmlContent) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add("show");
  }

  function closeModal() {
    modalOverlay.classList.remove("show");
    modalBody.innerHTML = "";
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ==========================================
  // 2. 하단 탭 전환 네비게이션
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
  // 3. 날짜 선택 기본값 (오늘 날짜 YYYY-MM-DD 세팅)
  // ==========================================
  const practiceDateInput = document.getElementById("practice-date-input");
  function getTodayString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (practiceDateInput) {
    practiceDateInput.value = getTodayString();
  }

  // ==========================================
  // 4. 칩 그룹 바인딩 및 연습 시간 Stepper (+,-)
  // ==========================================
  let currentDuration = 30;
  const customDurationDisplay = document.getElementById("custom-duration-display");
  const durationGroup = document.getElementById("duration-group");
  const minusBtn = document.getElementById("duration-minus-btn");
  const plusBtn = document.getElementById("duration-plus-btn");

  function setDuration(val) {
    currentDuration = Math.max(10, val);
    if (customDurationDisplay) {
      customDurationDisplay.textContent = currentDuration;
    }
    if (durationGroup) {
      const chips = durationGroup.querySelectorAll(".chip-btn");
      chips.forEach((c) => {
        if (Number(c.getAttribute("data-val")) === currentDuration) {
          c.classList.add("active");
        } else {
          c.classList.remove("active");
        }
      });
    }
  }

  if (durationGroup) {
    const chips = durationGroup.querySelectorAll(".chip-btn");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        setDuration(Number(chip.getAttribute("data-val")));
      });
    });
  }

  if (minusBtn) minusBtn.addEventListener("click", () => setDuration(currentDuration - 10));
  if (plusBtn) plusBtn.addEventListener("click", () => setDuration(currentDuration + 10));

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

  setupSingleChipGroup("ball-flight-group");
  setupMultiChipGroup("pain-part-group");

  // ==========================================
  // 5. 미스샷 9대 원인 칩 렌더링 & 정보 팝업 바인딩
  // ==========================================
  const missReasonContainer = document.getElementById("miss-reason-container");
  const selectedMissReasons = new Set();

  function renderMissReasonChips() {
    if (!missReasonContainer) return;
    missReasonContainer.innerHTML = "";

    MISS_REASONS_DATA.forEach((item) => {
      const chipWrap = document.createElement("div");
      chipWrap.className = "miss-tag-wrap";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `miss-chip-btn ${selectedMissReasons.has(item.name) ? "active" : ""}`;
      btn.textContent = item.name;
      btn.addEventListener("click", () => {
        if (selectedMissReasons.has(item.name)) {
          selectedMissReasons.delete(item.name);
        } else {
          selectedMissReasons.add(item.name);
        }
        renderMissReasonChips();
      });

      const infoBtn = document.createElement("button");
      infoBtn.type = "button";
      infoBtn.className = "miss-info-icon-btn";
      infoBtn.innerHTML = "ℹ️";
      infoBtn.title = "원인 및 결과 설명 보기";
      infoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(
          `🔍 ${item.name}`,
          `
          <div class="modal-info-box">
            <div class="info-block">
              <span class="info-sub-label">⚠️ 동작 메커니즘:</span>
              <p class="info-desc">${item.action}</p>
            </div>
            <div class="info-block" style="margin-top:10px;">
              <span class="info-sub-label" style="color:#ff8a80;">🚨 유발 미스샷:</span>
              <p class="info-desc" style="color:#ffd1d1;">${item.result}</p>
            </div>
          </div>
          <button type="button" class="submit-btn" id="modal-select-this-btn" style="margin-top:14px;">
            ${selectedMissReasons.has(item.name) ? "✓ 이미 선택됨 (닫기)" : "+ 이 원인 선택하고 닫기"}
          </button>
        `
        );
        document.getElementById("modal-select-this-btn").addEventListener("click", () => {
          selectedMissReasons.add(item.name);
          renderMissReasonChips();
          closeModal();
        });
      });

      chipWrap.appendChild(btn);
      chipWrap.appendChild(infoBtn);
      missReasonContainer.appendChild(chipWrap);
    });
  }

  renderMissReasonChips();

  // 힘빼기 슬라이더 텍스트
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
  // 6. 통계 요약 및 직전 연습 복기 로직 (월간/누적 정밀 분석)
  // ==========================================
  function updateSummaryAndPrevAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");

    // 최근 3개 One-Thing 복기 과제 최신순 렌더링
    const prevActionDisplay = document.getElementById("prev-action-display");
    if (prevActionDisplay) {
      const validLogs = logs.filter((l) => l.nextAction && l.nextAction.trim() !== "");
      if (validLogs.length > 0) {
        const recent3 = validLogs.slice(-3).reverse();
        prevActionDisplay.innerHTML = recent3
          .map(
            (l, idx) => `
          <div class="action-item">
            <span class="action-item-num">${idx + 1}</span>
            <div class="action-item-body">
              <span class="action-item-date">${l.date || ""} (${l.duration || 30}분 연습)</span>
              <div class="action-item-text">🎯 ${l.nextAction}</div>
            </div>
          </div>
        `
          )
          .join("");
      } else {
        prevActionDisplay.innerHTML =
          '<div class="highlight-text">아직 이전 기록이 없습니다. 힘빼고 가볍게 스윙을 시작하세요!</div>';
      }
    }

    const totalCount = logs.length;
    const totalSessionsEl = document.getElementById("sum-total-sessions");
    if (totalSessionsEl) totalSessionsEl.textContent = `${totalCount}회`;

    // 당월 기준 필터링
    const currentYearMonth = getTodayString().slice(0, 7); // 예: "2026-09"
    const monthLogs = logs.filter((l) => (l.date || "").startsWith(currentYearMonth));
    const monthCount = monthLogs.length;

    if (totalCount === 0) {
      document.getElementById("sum-draw-rate").textContent = "0%";
      document.getElementById("sum-back-pain-rate").textContent = "0%";
      document.getElementById("sum-avg-tension").textContent = "-";
      document.getElementById("sum-top-miss").textContent = "주요 미스샷 트리거: 데이터 수집 중";
      return;
    }

    // 나의 구질 (드로우 성공률)
    const drawCount = logs.filter((l) => l.ballFlight && l.ballFlight.includes("드로우")).length;
    const drawRate = Math.round((drawCount / totalCount) * 100);
    document.getElementById("sum-draw-rate").textContent = `${drawRate}%`;

    // 허리 통증 빈도: 누적 & 당월 분모 표기
    const backPainCountTotal = logs.filter(
      (l) => Array.isArray(l.painParts) && (l.painParts.includes("허리") || l.painParts.includes("허리/요추"))
    ).length;
    const backPainRateTotal = Math.round((backPainCountTotal / totalCount) * 100);
    document.getElementById("sum-back-pain-rate").textContent = `${backPainRateTotal}%`;

    const backPainCountMonth = monthLogs.filter(
      (l) => Array.isArray(l.painParts) && (l.painParts.includes("허리") || l.painParts.includes("허리/요추"))
    ).length;
    const backPainRateMonth = monthCount > 0 ? Math.round((backPainCountMonth / monthCount) * 100) : 0;
    const backMonthSubEl = document.getElementById("sum-back-month-sub");
    if (backMonthSubEl) {
      backMonthSubEl.textContent = `당월 ${backPainCountMonth}/${monthCount}회 (${backPainRateMonth}%)`;
    }

    // 평균 텐션: 누적 & 당월 평균
    const totalTension = logs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgTension = (totalTension / totalCount).toFixed(1);
    document.getElementById("sum-avg-tension").textContent = `${avgTension} / 5.0`;

    const monthTension = monthLogs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgMonthTension = monthCount > 0 ? (monthTension / monthCount).toFixed(1) : "-";
    const tensionMonthSubEl = document.getElementById("sum-tension-month-sub");
    if (tensionMonthSubEl) {
      tensionMonthSubEl.textContent = `당월 평균 ${avgMonthTension}`;
    }

    // 최빈 미스샷 원인 집계
    const missMap = {};
    logs.forEach((l) => {
      if (Array.isArray(l.missReasons)) {
        l.missReasons.forEach((r) => {
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

  // ==========================================
  // 7. 상단 요약 카드 클릭 시 세부 통계 모달 (수정사항 3 구현)
  // ==========================================
  // 7-1. 월간 캘린더 모달 (출석부 & 날짜 선택 소급 작성)
  const triggerCalendarModal = document.getElementById("trigger-calendar-modal");
  if (triggerCalendarModal) {
    triggerCalendarModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-based

      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      // 날짜별 연습 여부 매핑
      const practicedMap = {};
      logs.forEach((l) => {
        if (l.date) {
          practicedMap[l.date] = (practicedMap[l.date] || 0) + Number(l.duration || 30);
        }
      });

      let daysHtml = "";
      for (let i = 0; i < firstDayIndex; i++) {
        daysHtml += `<div class="cal-day empty"></div>`;
      }
      for (let d = 1; d <= lastDate; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const practicedMinutes = practicedMap[dateStr];
        const isToday = dateStr === getTodayString();
        daysHtml += `
          <div class="cal-day ${practicedMinutes ? 'practiced' : ''} ${isToday ? 'today' : ''}" data-date="${dateStr}">
            <span class="day-num">${d}</span>
            ${practicedMinutes ? `<span class="day-dot">● ${practicedMinutes}분</span>` : ''}
          </div>
        `;
      }

      openModal(
        `📅 ${year}년 ${month + 1}월 연습 출석부`,
        `
        <div class="calendar-wrap">
          <div class="cal-header-row">
            <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
          </div>
          <div class="cal-grid">${daysHtml}</div>
          <div class="cal-guide">
            <span style="color:#81c784;">● 초록 표시: 연습 완료일</span><br>
            <span>💡 날짜를 터치하면 해당 일자로 즉시 연습 일지를 입력할 수 있습니다.</span>
          </div>
        </div>
      `
      );

      // 달력 날짜 클릭 시 해당 날짜로 입력창 자동 세팅
      document.querySelectorAll(".cal-day[data-date]").forEach((el) => {
        el.addEventListener("click", () => {
          const selectedDate = el.getAttribute("data-date");
          practiceDateInput.value = selectedDate;
          closeModal();
          practiceDateInput.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
    });
  }

  // 7-2. 나의 구질 5대 분포 모달
  const triggerFlightModal = document.getElementById("trigger-flight-modal");
  if (triggerFlightModal) {
    triggerFlightModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const counts = {
        "드로우(성공)": 0,
        "스트레이트": 0,
        "푸시 발생": 0,
        "훅 발생": 0,
        "슬라이스": 0
      };

      logs.forEach((l) => {
        if (counts[l.ballFlight] !== undefined) {
          counts[l.ballFlight]++;
        }
      });

      const rowsHtml = Object.entries(counts)
        .map(([name, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return `
          <div class="stat-bar-row">
            <div class="stat-bar-label">
              <span>${name}</span>
              <strong>${count}회 (${pct}%)</strong>
            </div>
            <div class="stat-progress-track">
              <div class="stat-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
        })
        .join("");

      openModal(
        "🎯 나의 5대 구질 누적 분포",
        `
        <div class="stat-detail-box">
          <p class="field-label">총 ${total}회 연습 세션 동안의 구질 분포 현황입니다.</p>
          ${rowsHtml}
        </div>
      `
      );
    });
  }

  // 7-3. 허리 통증 & 부상 빈도 상세 모달
  const triggerPainModal = document.getElementById("trigger-pain-modal");
  if (triggerPainModal) {
    triggerPainModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const currentYearMonth = getTodayString().slice(0, 7);
      const monthLogs = logs.filter((l) => (l.date || "").startsWith(currentYearMonth));

      // 부위별 누적 집계
      const partsCount = {};
      logs.forEach((l) => {
        if (Array.isArray(l.painParts)) {
          l.painParts.forEach((p) => {
            partsCount[p] = (partsCount[p] || 0) + 1;
          });
        }
      });

      const partsHtml = Object.entries(partsCount)
        .sort((a, b) => b[1] - a[1])
        .map(
          ([part, c]) => `
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #282828;">
            <span>🩹 ${part}</span>
            <strong style="color:#ff8a80;">${c}회 (${total > 0 ? Math.round((c / total) * 100) : 0}%)</strong>
          </div>
        `
        )
        .join("");

      openModal(
        "🩹 통증 빈도 & 부상 예방 추이",
        `
        <div class="stat-detail-box">
          <div class="summary-item" style="margin-bottom:12px;">
            <span class="summary-label">허리 집중 통증 비교</span>
            <span class="summary-val" style="color:#ff8a80; font-size:1.05rem;">
              전체 누적: ${partsCount["허리"] || 0}/${total}회 | 당월: ${monthLogs.filter((l) => Array.isArray(l.painParts) && l.painParts.includes("허리")).length}/${monthLogs.length}회
            </span>
          </div>
          <div class="field-label" style="margin-top:10px;">전체 부위별 통증 발생 순위</div>
          ${partsHtml || "<p>기록된 통증 데이터가 없습니다.</p>"}
        </div>
      `
      );
    });
  }

  // 7-4. 평균 텐션(힘빼기) 상세 모달
  const triggerTensionModal = document.getElementById("trigger-tension-modal");
  if (triggerTensionModal) {
    triggerTensionModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const currentYearMonth = getTodayString().slice(0, 7);
      const monthLogs = logs.filter((l) => (l.date || "").startsWith(currentYearMonth));

      const tensionCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      logs.forEach((l) => {
        const val = Number(l.tensionLevel || 3);
        if (tensionCounts[val] !== undefined) tensionCounts[val]++;
      });

      const totalT = logs.reduce((acc, c) => acc + Number(c.tensionLevel || 3), 0);
      const avgT = total > 0 ? (totalT / total).toFixed(2) : "-";

      const monthT = monthLogs.reduce((acc, c) => acc + Number(c.tensionLevel || 3), 0);
      const avgMonthT = monthLogs.length > 0 ? (monthT / monthLogs.length).toFixed(2) : "-";

      const barsHtml = [1, 2, 3, 4, 5]
        .map((lvl) => {
          const c = tensionCounts[lvl];
          const pct = total > 0 ? Math.round((c / total) * 100) : 0;
          return `
          <div class="stat-bar-row">
            <div class="stat-bar-label">
              <span>레벨 ${lvl}: ${tensionLabels[lvl]}</span>
              <strong>${c}회 (${pct}%)</strong>
            </div>
            <div class="stat-progress-track">
              <div class="stat-progress-fill" style="width: ${pct}%; background-color:#81c784;"></div>
            </div>
          </div>
        `;
        })
        .join("");

      openModal(
        "⚖️ 힘빼기 & 상체 텐션 변화 추이",
        `
        <div class="stat-detail-box">
          <div class="summary-grid" style="margin-bottom:12px;">
            <div class="summary-item">
              <span class="summary-label">전체 평균 텐션</span>
              <span class="summary-val" style="color:#81c784;">${avgT} / 5.0</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">당월(${currentYearMonth}) 평균</span>
              <span class="summary-val" style="color:#64b5f6;">${avgMonthT} / 5.0</span>
            </div>
          </div>
          <div class="field-label">텐션 레벨별 분포 현황</div>
          ${barsHtml}
        </div>
      `
      );
    });
  }

  // ==========================================
  // 8. 연습 일지 저장 (날짜 소급 및 9대 미스샷 원인 저장)
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

      const selectedDate = practiceDateInput ? practiceDateInput.value : getTodayString();

      const newLog = {
        id: Date.now(),
        date: selectedDate, // 사용자가 지정한 날짜
        duration: currentDuration,
        painParts: getActiveMulti("pain-part-group"),
        painLevel: document.getElementById("pain-level").value,
        ballFlight: getActiveSingle("ball-flight-group"),
        tensionLevel: tensionRange ? tensionRange.value : "3",
        weightTransfer: document.getElementById("weight-transfer").value,
        missReasons: Array.from(selectedMissReasons), // 9대 미스샷 원인 세트 저장
        nextAction: document.getElementById("next-action-input").value.trim()
      };

      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      logs.push(newLog);
      // 날짜순 정렬 보장
      logs.sort((a, b) => new Date(a.date) - new Date(b.date));
      localStorage.setItem("golf_practice_logs", JSON.stringify(logs));

      alert(`✅ [${selectedDate}] 연습 일지(${currentDuration}분)가 안전하게 저장되었습니다!`);
      document.getElementById("next-action-input").value = "";
      selectedMissReasons.clear();
      renderMissReasonChips();
      updateSummaryAndPrevAction();
    });
  }

  // ==========================================
  // 9. 연습 일지 엑셀 CSV 내보내기 & 전체 백업/복원
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
  // 10. 클럽 정밀 스펙 관리 모듈
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
    if (headSpecGroup) {
      headSpecGroup.style.display = ["드라이버", "우드", "유틸"].includes(selected) ? "block" : "none";
    }
    if (wedgeSpecGroup) {
      wedgeSpecGroup.style.display = (selected === "웨지") ? "flex" : "none";
    }
  }

  if (clubTypeSelect) {
    clubTypeSelect.addEventListener("change", updateConditionalFields);
    updateConditionalFields();
  }

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

  if (cancelClubEditBtn) cancelClubEditBtn.addEventListener("click", resetClubForm);

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

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

        <div class="spec-grid spec-summary-grid">
          <div>로프트/라이: <strong>${club.loft || "-"} / ${club.lie || "-"}</strong></div>
          <div>샤프트: <strong>${club.shaftWeight ? club.shaftWeight : '-'} (${club.flex || '-'})</strong></div>
          <div>토크 / 킥: <strong>${club.torque || "-"} / ${club.kickpoint || "-"}</strong></div>
          <div>스윙웨이트: <strong style="color:#81c784;">${club.swingweight || "-"}</strong></div>
        </div>

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

      item.addEventListener("click", (e) => {
        if (e.target.closest(".action-text-btn")) return;
        const drawer = item.querySelector(".club-detail-drawer");
        const hint = item.querySelector(".expand-hint");
        const isExpanded = drawer.classList.toggle("open");
        hint.textContent = isExpanded ? "터치하여 상세 스펙 접기 ▴" : "터치하여 상세 스펙 펼치기 ▾";
      });

      clubList.appendChild(item);
    });

    clubList.querySelectorAll(".edit-club-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetId = Number(e.target.getAttribute("data-id"));
        editClub(targetId);
      });
    });

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

  // 클럽 CSV 내보내기
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
  // 11. 드릴 & 레슨 관리 모듈 (검색 + 카테고리 필터)
  // ==========================================
  const toggleDrillFormBtn = document.getElementById("toggle-drill-form-btn");
  const drillForm = document.getElementById("drill-form");
  const drillFormTitle = document.getElementById("drill-form-title");
  const submitDrillBtn = document.getElementById("submit-drill-btn");
  const cancelDrillEditBtn = document.getElementById("cancel-drill-edit-btn");
  const drillEditIdInput = document.getElementById("drill-edit-id");
  const drillList = document.getElementById("drill-list");
  const drillSearchInput = document.getElementById("drill-search-input");
  const drillFilterChipsContainer = document.getElementById("drill-filter-chips");
  const drillCategoryInput = document.getElementById("drill-category");
  const drillQuickChips = document.getElementById("drill-quick-chips");

  let selectedCategoryFilter = "전체";
  let searchKeyword = "";

  if (drillQuickChips && drillCategoryInput) {
    drillQuickChips.querySelectorAll(".quick-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        drillCategoryInput.value = btn.getAttribute("data-cat");
      });
    });
  }

  if (drillSearchInput) {
    drillSearchInput.addEventListener("input", (e) => {
      searchKeyword = e.target.value.trim().toLowerCase();
      renderDrills();
    });
  }

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

  if (cancelDrillEditBtn) cancelDrillEditBtn.addEventListener("click", resetDrillForm);

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

  function renderCategoryFilterChips(drills) {
    if (!drillFilterChipsContainer) return;
    const baseCategories = ["전체", "드라이버", "아이언/웨지", "힘빼기/부상방지", "궤도/드로우", "퍼팅"];
    const savedCategories = drills.map(d => d.category).filter(Boolean);
    const allCategories = Array.from(new Set([...baseCategories, ...savedCategories]));

    drillFilterChipsContainer.innerHTML = "";
    allCategories.forEach((cat) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `filter-chip-btn ${selectedCategoryFilter === cat ? "active" : ""}`;
      chip.textContent = cat;
      chip.addEventListener("click", () => {
        selectedCategoryFilter = cat;
        renderCategoryFilterChips(drills);
        renderDrills();
      });
      drillFilterChipsContainer.appendChild(chip);
    });
  }

  function renderDrills() {
    if (!drillList) return;
    const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
    renderCategoryFilterChips(drills);

    const filtered = drills.filter((drill) => {
      const matchCat = (selectedCategoryFilter === "전체") || (drill.category === selectedCategoryFilter);
      const matchSearch = !searchKeyword || 
        (drill.title && drill.title.toLowerCase().includes(searchKeyword)) ||
        (drill.category && drill.category.toLowerCase().includes(searchKeyword)) ||
        (drill.memo && drill.memo.toLowerCase().includes(searchKeyword));
      return matchCat && matchSearch;
    });

    drillList.innerHTML = "";

    if (filtered.length === 0) {
      drillList.innerHTML = `
        <div class="empty-notice">
          ${drills.length === 0 
            ? '보관된 드릴이 없습니다. 상단의 "+ 레슨 추가"를 눌러 유튜브/블로그 링크를 저장해 보세요.' 
            : '선택한 조건에 일치하는 드릴이 없습니다.'}
        </div>`;
      return;
    }

    filtered.forEach((drill) => {
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
        <a href="${drill.url}" target="_blank" rel="noopener noreferrer" class="link-action-btn">▶ Youtube / 레슨 바로가기</a>
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
// 12. PWA 서비스 워커 등록
// ==========================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("PWA ServiceWorker Ready (v1.3)"))
      .catch((err) => console.log("PWA ServiceWorker Failed:", err));
  });
}