document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // [0. 공통 헬퍼 함수]
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

  function normalizeDate(rawDate) {
    if (!rawDate) return "";
    const cleaned = String(rawDate).replace(/[^\d]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const parts = cleaned.split("-");
    if (parts.length >= 3) {
      const y = parts[0];
      const m = parts[1].padStart(2, "0");
      const d = parts[2].padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return rawDate;
  }

  function getTodayString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // ==========================================
  // [1. 공통 모달 제어 로직]
  // ==========================================
  const modalOverlay = document.getElementById("app-modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  function openModal(title, htmlContent) {
    if (!modalOverlay || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add("show");
  }

  function closeModal() {
    if (!modalOverlay || !modalBody) return;
    modalOverlay.classList.remove("show");
    modalBody.innerHTML = "";
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // 전역 릴리즈 모달 함수 (인라인 onclick 지원)
  window.showReleaseHistoryModal = function () {
    openModal(
      "🚀 MyGolfNotes 릴리즈 이력",
      `
      <div class="release-history-wrap">
        <div class="release-card">
          <div class="release-card-header">
            <span class="release-ver-badge">v1.5 (Step 1)</span>
            <strong class="release-card-title">13대 미스샷 백과 & 4단계 자가점검 리스트</strong>
          </div>
          <ul class="release-feature-list">
            <li>13종 미스샷 원인 확충 (스트롱 그립, 손목 롤링, 힙턴 블록)</li>
            <li>원인 / 유발미스샷 / 📋자가점검 리스트 / 교정드릴 4단계 가이드 팝업</li>
            <li>2열 반응형 그리드 최적화 및 렌더링 에러 수정</li>
          </ul>
        </div>
      </div>
    `
    );
  };

  document.querySelectorAll(".release-footer").forEach((footer) => {
    footer.addEventListener("click", (e) => {
      e.stopPropagation();
      window.showReleaseHistoryModal();
    });
  });

  // ==========================================
  // [2. 하단 탭 전환]
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
  // [3. 13대 미스샷 원인 백과 데이터]
  // ==========================================
  const ALL_MISS_REASONS_DATA = [
    {
      id: "sway",
      name: "스웨이 & 슬라이드",
      cause: "백스윙 시 척추 축을 중심으로 회전하지 못하고 골반과 상체가 오른쪽으로 밀리거나(스웨이), 다운스윙 시 타깃 방향으로 하체가 과도하게 옆으로 밀려 나가는(슬라이드) 현상.",
      result: "스윙 최저점이 일정하지 않아 발생하는 뒤땅(Fat shot), 탑볼(Thin shot), 푸시 슬라이스 및 심한 훅(타이밍 의존성 증가).",
      checklist: [
        "백스윙 시 오른발 바깥쪽으로 체중이 쏠리며 오른 무릎이 펴지거나 바깥으로 밀리는가?",
        "다운스윙 시 왼쪽 골반이 회전하지 않고 타깃 쪽으로 평행 이동만 심하게 되는가?",
        "임팩트 순간 머리가 어드레스 위치보다 과도하게 좌우로 이동해 있는가?"
      ],
      drill: "• 오른발 바깥쪽 볼 밟기 드릴: 오른발 바깥쪽에 골프공이나 웨지를 밟고 백스윙하여 오른발 안쪽 허벅지에 체중이 잡히는 회전 감각을 익힙니다.\n• 의식적 포인트: 스윙은 '좌우 왕복 운동'이 아닌 '고정된 축 중심의 원통 회전 운동'임을 인지합니다.",
      aiCheckpoint: "백스윙 탑에서 우측 고관절 힌지 유지 여부 및 다운스윙 전환 시 좌측 골반이 회전 대신 타깃 방향으로 과도하게 슬라이드되는지 여부"
    },
    {
      id: "over_the_top",
      name: "오버 더 탑 (엎어치기)",
      cause: "다운스윙 전환 시 하체 선행 없이 상체와 오른쪽 어깨, 손이 먼저 타깃 쪽으로 덤벼들며 클럽이 스윙 플레인 바깥쪽에서 안쪽으로 가파르게 들어오는 동작(아웃-인 궤도).",
      result: "악성 슬라이스(페이스 오픈 시), 풀 훅(페이스 클로즈 시), 심한 비거리 손실 및 찍혀 맞는 샷(Skying/뽕샷).",
      checklist: [
        "백스윙 톱에서 첫 동작으로 오른쪽 어깨나 오른팔이 공 쪽으로 튀어나오는가?",
        "다운스윙 궤도 데이터가 Out-to-In으로 마이너스 값을 지속적으로 기록하는가?",
        "드라이버 샷 시 헤드 윗부분(크라운)에 볼 자국이 나거나 가파르게 찍혀 맞는가?"
      ],
      drill: "• 오른쪽 팔꿈치 갈비뼈 붙이기 드릴: 백스윙 톱에서 다운스윙 시작 시 오른 팔꿈치가 오른쪽 옆구리를 향해 수직으로 떨어지는 샬로윙 느낌을 집중 연습합니다.\n• 헤드커버 장애물 드릴: 공 뒤쪽 바깥쪽 대각선 라인에 헤드커버를 두고, 건드리지 않고 인-투-아웃으로 스윙하는 감각을 체득합니다.",
      aiCheckpoint: "다운스윙 시작 시 하체 리드 선행 여부 및 오른쪽 어깨/팔이 앞으로 덤비며 샤프트가 스윙 플레인 바깥에서 쏟아지는 아웃-인 궤도 발생 여부"
    },
    {
      id: "early_extension",
      name: "얼리 익스텐션 (배치기)",
      cause: "다운스윙과 임팩트 존에서 척추 각도를 유지하지 못하고 골반과 상체가 공 쪽(앞쪽)으로 펴지며 일어서는 현상.",
      result: "힐 타구(생크), 푸시(Push) 슬라이스, 급격한 손목 보상 동작에 의한 훅, 뒤땅.",
      checklist: [
        "임팩트 순간 엉덩이가 어드레스 때 만든 가상의 뒤쪽 벽에서 앞으로 떨어지는가?",
        "임팩트 시 상체가 일찍 세워지며 명치가 하늘을 향하는 느낌이 드는가?",
        "손과 몸 사이의 공간이 좁아져 팔을 접거나 들어 올리며 치는가?"
      ],
      drill: "• 엉덩이 의자 터치 드릴: 등 뒤에 의자나 벽을 대고 어드레스 후, 임팩트 직전까지 엉덩이가 벽에서 떨어지지 않게 회전하는 연습을 합니다.\n• 의식적 포인트: 척추 각을 유지하는 원동력은 고관절(힌지)을 접어둔 상태에서 골반을 회전시키는 것입니다.",
      aiCheckpoint: "임팩트 구간에서 어드레스 시 형성된 척추 각도(Spine Angle) 유지 여부 및 골반이 볼 방향으로 전진하며 손목 공간을 좁히는지 여부"
    },
    {
      id: "casting_scooping",
      name: "캐스팅 & 스쿠핑",
      cause: "다운스윙 시작 시 코킹(손목 각도)이 일찍 풀려 헤드가 손보다 먼저 내려오거나(캐스팅), 임팩트 구간에서 볼을 띄우려고 손목으로 퍼올리는 동작(스쿠핑).",
      result: "유효 로프트 증가로 인한 과도하게 높은 탄도, 비거리 손실, 심한 뒤땅 및 탑볼, 드로우 과다(감아치기).",
      checklist: [
        "다운스윙 허리 높이에서 이미 코킹 각도가 풀려 손목과 샤프트가 일직선이 되는가?",
        "임팩트 순간 손목이 볼보다 뒤에 위치하는가(핸드 레이트)?",
        "왼 손목이 타깃 반대 방향으로 꺾이며(커핑) 공을 걷어 올리는 느낌이 나는가?"
      ],
      drill: "• 스틱 연장선 유지 드릴: 그립 끝에 얼라인먼트 스틱을 겹쳐 잡고, 팔로스루 시 스틱이 왼쪽 옆구리를 때리지 않도록 손목 각을 유지합니다.\n• 의식적 포인트: 공을 띄우는 것은 클럽 자체의 로프트 각도이지 손목의 퍼올림이 아닙니다.",
      aiCheckpoint: "다운스윙 초기에 손목 코킹 래깅(Lagging)이 유지되는지 및 임팩트 순간 핸드퍼스트 타격 대신 왼손목이 꺾여 헤드가 손을 앞지르는 스쿠핑 여부"
    },
    {
      id: "head_up",
      name: "헤드업 & 시선 이탈",
      cause: "볼의 비행 궤적을 눈으로 확인하려는 심리적 조급함, 또는 흉추 회전 유연성이 부족해 몸통을 돌리기 위해 머리와 시선을 함께 타깃 쪽으로 들어 올리는 보상 동작.",
      result: "척추 각도가 세워지며 스윙 최저점이 지면보다 높아져 발생하는 탑볼(Topping) 및 클럽 페이스가 스퀘어로 닫히지 못해 생기는 슬라이스 유발.",
      checklist: [
        "임팩트 타구음을 듣기도 전에 머리가 이미 타깃 방향으로 돌아가 있는가?",
        "어드레스 때 정해둔 시선의 초점이 임팩트 전에 허공으로 분산되는가?",
        "볼의 출발 탄도를 직접 눈으로 보려고 상체가 조기에 벌떡 일어나는가?"
      ],
      drill: "• 동전/마킹 응시 드릴: 볼 뒤쪽 2~3cm 지점에 동전을 두거나 볼의 특정 마크를 정해놓고, 클럽 헤드가 볼을 완전히 통과할 때까지 시선을 지킵니다.\n• 의식적 포인트: 머리를 억지로 고정해 목을 굳히지 말고, 턱 밑으로 어깨가 빠져나갈 때까지 가슴의 시선 각도를 유지합니다.",
      aiCheckpoint: "임팩트 순간까지 시선과 머리가 어드레스 축에 안정적으로 머무는지 및 임팩트 직전 시선과 머리가 타깃 방향으로 조기 회전/들리는지 여부"
    },
    {
      id: "reverse_pivot",
      name: "리버스 피벗 (역피봇)",
      cause: "백스윙 시 체중이 오른발이 아닌 왼발로 역으로 쏠리고, 상체가 타깃 쪽으로 뒤집어지듯 기울어지는 현상.",
      result: "다운스윙 시 반작용으로 오른발에 체중이 남으며 발생하는 치명적인 뒤땅, 탑볼, 스카잉(뽕샷), 심한 푸시/풀.",
      checklist: [
        "백스윙 톱에서 머리와 상체가 타깃 방향(왼쪽)으로 기울어져 있는가?",
        "백스윙 완료 시 왼 무릎이 앞으로 심하게 튀어나오고 오른발에 하중이 전혀 없는가?",
        "다운스윙 시 뒤로 누우면서 올려치듯 타격하는가?"
      ],
      drill: "• 스텝 스윙 드릴: 백스윙 시 오른발을 오른쪽으로 반 발자국 디디며 회전하고, 다운스윙 시 왼발을 디디며 스윙하는 야구 배팅 스윙 훈련을 합니다.\n• 의식적 포인트: 백스윙 톱에서는 오른쪽 고관절 안쪽에 상체 체중이 70% 이상 안착해 얹혀 있는 느낌을 받습니다.",
      aiCheckpoint: "백스윙 탑에서 척추 중심축이 타깃 방향으로 꺾여 체중이 왼발에 역으로 실리는지 및 다운스윙 시 오른발로 역이동하는 밸런스 붕괴 여부"
    },
    {
      id: "lunging",
      name: "상체 덤빔 (런징)",
      cause: "비거리를 늘리려는 과도한 힘으로 인해 다운스윙 전환 시 머리와 상체 전체가 타깃 앞쪽으로 밀고 나가며 공을 가격하려는 동작.",
      result: "급격한 다운블로 형성으로 인한 심한 뽕샷, 드라이버 비거리 급감, 심한 풀(Pull) 훅 또는 깎여 맞는 슬라이스.",
      checklist: [
        "임팩트 순간 머리 위치가 어드레스 때 머리 위치보다 타깃 쪽(왼쪽)으로 크게 튀어나가 있는가?",
        "다운스윙 시 상체와 머리가 지면 쪽으로 고꾸라지는 느낌이 드는가?",
        "피니시 때 척추가 타깃 반대쪽으로 활처럼 꺾이며 허리에 과도한 긴장이 오는가?"
      ],
      drill: "• 오른발 뒤꿈치 머리 고정 드릴: 임팩트 순간 머리가 티(볼) 뒤에 머물러 있는 느낌(Head behind the ball)을 유지하며 하체만 턴해줍니다.\n• 의식적 포인트: 드라이버는 볼 뒤에서 올려치는 상향 타격이므로 머리가 공을 앞지르면 정타가 어렵습니다.",
      aiCheckpoint: "임팩트 시 상체(가슴과 머리)가 볼보다 타깃 쪽으로 앞서 돌진하여 지나치게 가파른 입사각(Steep Angle)을 형성하는지 여부"
    },
    {
      id: "chicken_wing",
      name: "치킨 윙",
      cause: "임팩트 후 팔로스루 구간에서 왼팔이 자연스럽게 로테이션(회전)되지 못하고, 팔꿈치가 바깥쪽으로 구부러지며 당겨지는 현상.",
      result: "페이스가 열린 채 맞아 생기는 슬라이스, 클럽이 당겨지며 발생하는 힐 타구(생크) 및 탑볼, 엘보 부상 유발.",
      checklist: [
        "팔로스루 때 왼 팔꿈치가 지면을 보지 않고 하늘이나 뒤쪽을 향해 꺾여 있는가?",
        "임팩트 구간에서 왼팔을 의도적으로 구부려 당기며 빠져나가는가?",
        "피니시 때 왼 팔꿈치와 오른 팔꿈치 사이의 간격이 지나치게 벌어지는가?"
      ],
      drill: "• 장갑/수건 끼우기 드릴: 왼쪽 겨드랑이에 골프 장갑이나 수건을 끼우고, 팔로스루 9시 구간까지 떨어지지 않도록 일체화하여 회전합니다.\n• 의식적 포인트: 왼팔을 억지로 펴려 하지 말고, 임팩트 후 왼 손목과 팔뚝이 자연스럽게 바깥으로 회전(수피네이션)하도록 힘을 뺍니다.",
      aiCheckpoint: "임팩트 후 팔로우스루 구간에서 왼팔 전완 롤링 릴리스가 이루어지지 않고 왼팔꿈치가 몸통 뒤쪽으로 구부러져 당겨지는지 여부"
    },
    {
      id: "hanging_back",
      name: "행잉 백 (체중 잔류)",
      cause: "다운스윙 시 왼발 쪽으로 체중 이동이 전혀 이루어지지 않고, 오른발 쪽에 체중이 남은 채로 공을 들어 올리듯 타격하는 동작.",
      result: "클럽 최저점이 공보다 훨씬 뒤에 형성되어 발생하는 심한 뒤땅, 걷어 올리며 발생하는 얇은 탑볼, 높은 푸시 슬라이스.",
      checklist: [
        "피니시를 잡았을 때 오른발에 체중이 여전히 50% 이상 남아 뒤로 넘어질 것 같은가?",
        "피니시 후 왼발 하나만으로 똑바로 서서 3초간 버티기 어려운가?",
        "임팩트 존에서 골반이 타깃 쪽으로 체중을 전달하지 못하고 주저앉는가?"
      ],
      drill: "• 스텝 스루 (걸어 나가기) 드릴: 타격 후 피니시에서 오른발을 타깃 쪽으로 한 걸음 내딛는 방식으로 체중 이동을 체득합니다.\n• 의식적 포인트: 다운스윙의 출발은 상체의 힘이 아닌 왼발 뒤꿈치로 지면을 딛는 신호여야 합니다.",
      aiCheckpoint: "다운스윙부터 임팩트 이후 피니시까지 체중이 왼발로 완전하게 전이되지 못하고 오른발에 남아 뒤로 누워 퍼올리는지 여부"
    },
    {
      id: "flying_elbow",
      name: "플라잉 엘보",
      cause: "백스윙 톱에서 오른쪽 팔꿈치가 지면을 향하지 못하고, 등 뒤쪽이나 위쪽으로 과도하게 벌어져 들리는 닭날개 현상.",
      result: "다운스윙 시 궤도가 가팔라지며 발생하는 엎어치기(오버 더 탑), 심한 슬라이스, 혹은 급격히 보상하며 생기는 악성 훅.",
      checklist: [
        "백스윙 톱에서 오른 팔꿈치가 몸통에서 멀리 떨어져 옆으로 벌어지는가?",
        "백스윙 톱 자세에서 오른 손바닥이 하늘(쟁반 받치듯)을 보지 않고 정면이나 측면을 보는가?",
        "다운스윙 시 클럽이 등 뒤로 완만하게 떨어지지 않고 앞으로 쏟아지는가?"
      ],
      drill: "• 쟁반 받치기 드릴: 백스윙 톱에서 오른손으로 쟁반을 받치는 각도를 만들고 오른 팔꿈치가 지면을 직각으로 가리키는지 확인합니다.\n• 양팔 밴드 착용 연습: 팔꿈치를 고정해 주는 밴드를 착용하거나 미니 볼을 팔 사이에 끼우고 백스윙합니다.",
      aiCheckpoint: "백스윙 탑에서 오른쪽 팔꿈치가 지면을 향하지 않고 몸통 뒤로 과도하게 벌어져 크로스오버 및 엎어치기 궤도를 형성하는지 여부"
    },
    {
      id: "strong_grip",
      name: "과도한 스트롱 그립",
      cause: "슬라이스 방지 목적으로 양손 V자 홈이 오른쪽 어깨 바깥을 향할 정도로 과도하게 틀어쥐어, 셋업 시점부터 클럽 페이스가 닫히기 쉬운 조건 형성.",
      result: "악성 훅, 출발부터 왼쪽으로 향하는 풀 훅(Pull Hook), 탄도가 지나치게 낮아지는 꼬구라짐.",
      checklist: [
        "어드레스 시 내려다보았을 때 왼손 등 주먹 관절(너클)이 3개 이상 보이는가?",
        "양손 엄지와 검지의 V자 홈이 오른쪽 어깨 너머를 가리키고 있는가?",
        "오른손 바닥이 샤프트 밑으로 너무 깊숙이 들어가 위를 향해 있는가?"
      ],
      drill: "• 2-Knuckle 뉴트럴 정렬 드릴: 어드레스 시 왼손 너클이 2개~2.5개만 보이게 조정하고 V자 홈이 오른쪽 쇄골을 향하도록 리셋합니다.\n• 오른손 생명선 덮기: 오른손 생명선으로 왼손 엄지 측면을 감싸 쥐어 손목의 급격한 회전 개입을 제한합니다.",
      aiCheckpoint: "어드레스 시 양손 그립 셋업이 과도한 스트롱 그립으로 인해 임팩트 시 클럽 페이스가 조기 폐쇄되는지 여부"
    },
    {
      id: "wrist_rolling",
      name: "과도한 손목 롤링",
      cause: "다운스윙 임팩트 구간에서 몸통 회전보다 손목 교차(Cross) 속도가 지나치게 빨라 클럽 페이스를 급격하게 덮어버리는 동작.",
      result: "심한 좌측 감김(오버 훅, 좌측 20m 이상 이탈), 페이스 닫힘에 의한 낮은 풀(Pull) 샷.",
      checklist: [
        "임팩트 순간 몸통 회전보다 오른손으로 클럽을 감아 돌리는 힘이 더 강한가?",
        "팔로스루 9시 구간에서 오른손이 왼손 위를 지나치게 일찍 덮어버리는가?",
        "인-아웃 궤도는 좋은데 볼이 타깃보다 한참 왼쪽으로만 휘어져 나가는가?"
      ],
      drill: "• 왼손등 타깃 유지 (바디턴 릴리스) 드릴: 임팩트 후 팔로스루 9시까지 왼손 장갑 로고가 타깃을 보게 유지하며 가슴 회전으로 클럽을 보냅니다.\n• 스플릿 핸드 드릴: 양손을 5cm 띄워 잡고 스윙하여 손목이 급격히 감기지 않는 감각을 익힙니다.",
      aiCheckpoint: "임팩트 존에서 몸통 바디턴 회전 없이 손목의 급격한 교차 롤링으로 인해 페이스 앵글이 급격히 닫혀 악성 풀훅이 유발되는지 여부"
    },
    {
      id: "hip_turn_block",
      name: "힙턴 블록 (회전 지연)",
      cause: "전환 동작(트랜지션) 시 왼쪽 골반이 타깃 뒤쪽으로 과감히 열리지 못하고 회전이 멈추거나 슬라이드만 발생하여 손목 감아치기 보상 동작 유발.",
      result: "팔만 튀어나가며 생기는 풀 훅, 손목이 늦게 따라오며 터지는 푸시 슬라이스(양방향 미스 발생).",
      checklist: [
        "임팩트 순간 벨트 버클(골반)이 타깃 방향으로 45도 열리지 못하고 볼 정면을 보고 있는가?",
        "임팩트 구간에서 팔과 클럽이 빠져나갈 공간이 부족해 상체가 들리거나 손목을 급격히 꺾는가?",
        "다운스윙 시 회전하지 않고 골반이 옆으로 밀리기만 하는 느낌이 드는가?"
      ],
      drill: "• 왼쪽 뒷주머니 벽 터치 드릴: 다운스윙 시작 시 왼발 뒤꿈치로 지면을 누르며 '왼쪽 바지 뒷주머니를 등 뒤 벽 방향으로 과감히 뺀다'는 느낌으로 선행 회전합니다.\n• 오른발 지연 킥 드릴: 오른발 뒤꿈치가 임팩트 전 일찍 들려 회전 공간을 막지 않도록 발바닥 안쪽으로 지면을 지탱합니다.",
      aiCheckpoint: "다운스윙 전환 시 하체 골반 회전이 멈추거나 막혀 상체 덤빔 또는 손목 감아치기 보상 동작이 발생하는지 여부"
    }
  ];

  const ALL_MISS_MAP = {};
  ALL_MISS_REASONS_DATA.forEach((item) => {
    ALL_MISS_MAP[item.name] = item;
  });

  // ==========================================
  // [4. 연습 시간 조절 및 칩 그룹 세팅]
  // ==========================================
  const practiceDateInput = document.getElementById("practice-date-input");
  if (practiceDateInput) practiceDateInput.value = getTodayString();

  let currentDuration = 30;
  const customDurationDisplay = document.getElementById("custom-duration-display");
  const durationGroup = document.getElementById("duration-group");
  const minusBtn = document.getElementById("duration-minus-btn");
  const plusBtn = document.getElementById("duration-plus-btn");

  function setDuration(val) {
    currentDuration = Math.max(10, val);
    if (customDurationDisplay) customDurationDisplay.textContent = currentDuration;
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
      chip.addEventListener("click", () => setDuration(Number(chip.getAttribute("data-val"))));
    });
  }

  if (minusBtn) minusBtn.addEventListener("click", () => setDuration(currentDuration - 10));
  if (plusBtn) plusBtn.addEventListener("click", () => setDuration(currentDuration + 10));

  setupSingleChipGroup("ball-flight-group");
  setupMultiChipGroup("pain-part-group");

  // ==========================================
  // [5. 미스샷 13대 원인 렌더링 & 팝업]
  // ==========================================
  const missReasonContainer = document.getElementById("miss-reason-container");
  const selectedMissReasons = new Set();

  function formatDrillText(rawText) {
    if (!rawText) return "";
    return rawText
      .split("\n")
      .map((line) => `<p class="info-desc" style="margin-bottom:4px;">${line}</p>`)
      .join("");
  }

  function createMissTagElement(item, isFullWidth = false) {
    const chipWrap = document.createElement("div");
    chipWrap.className = `miss-tag-wrap ${isFullWidth ? "miss-full-width" : ""}`;

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
    infoBtn.title = "원인, 결과, 자가점검 및 교정드릴 보기";
    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const checklistHtml =
        item.checklist && item.checklist.length > 0
          ? `
          <div class="info-block" style="margin-top:10px;">
            <span class="info-sub-label" style="color:#64b5f6;">📋 자가 점검 리스트</span>
            <div class="checklist-box">
              ${item.checklist
                .map(
                  (chk) => `
                <div class="check-item">
                  <span class="check-box-icon">☑</span>
                  <span class="check-text">${chk}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
          : "";

      openModal(
        `🔍 ${item.name}`,
        `
        <div class="modal-info-box">
          <div class="info-block">
            <span class="info-sub-label">⚠️ 발생 원인</span>
            <p class="info-desc">${item.cause}</p>
          </div>
          <div class="info-block" style="margin-top:10px;">
            <span class="info-sub-label" style="color:#ff8a80;">🥊 유발 미스샷</span>
            <p class="info-desc" style="color:#ffd1d1;">${item.result}</p>
          </div>
          ${checklistHtml}
          <div class="info-block" style="margin-top:10px;">
            <span class="info-sub-label" style="color:#81c784;">🎯 교정 드릴 및 핵심 포인트</span>
            <div style="margin-top:2px;">${formatDrillText(item.drill)}</div>
          </div>
        </div>
        <button type="button" class="submit-btn" id="modal-select-this-btn" style="margin-top:14px;">
          ${selectedMissReasons.has(item.name) ? "✓ 이미 선택됨 (닫기)" : "+ 이 원인 선택하고 닫기"}
        </button>
      `
      );

      const selThisBtn = document.getElementById("modal-select-this-btn");
      if (selThisBtn) {
        selThisBtn.addEventListener("click", () => {
          selectedMissReasons.add(item.name);
          renderMissReasonChips();
          closeModal();
        });
      }
    });

    chipWrap.appendChild(btn);
    chipWrap.appendChild(infoBtn);
    return chipWrap;
  }

  function renderMissReasonChips() {
    if (!missReasonContainer) return;
    missReasonContainer.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "miss-grid-responsive";

    ALL_MISS_REASONS_DATA.forEach((item, idx) => {
      const isLastOdd = idx === ALL_MISS_REASONS_DATA.length - 1 && ALL_MISS_REASONS_DATA.length % 2 === 1;
      grid.appendChild(createMissTagElement(item, isLastOdd));
    });

    missReasonContainer.appendChild(grid);
  }

  renderMissReasonChips();

  // ==========================================
  // [6. AI 질문 생성기]
  // ==========================================
  function assembleAiPrompt(selectedNames) {
    const namesArray = Array.from(selectedNames);
    const count = namesArray.length;

    let prompt = `골프 스윙 영상을 첨부합니다. 오늘 연습 세션에서 [${namesArray.join(", ")}] 문제가 집중 발생했습니다.\n`;
    prompt += `첨부된 영상의 프레임별 움직임을 바탕으로 아래 항목들을 전문 교습가 관점에서 정밀 진단해 주세요.\n\n`;

    prompt += `1. 주요 결함 집중 체크포인트:\n`;
    namesArray.forEach((name, idx) => {
      const item = ALL_MISS_MAP[name];
      const checkpoint = item ? item.aiCheckpoint : name;
      prompt += `   (${String.fromCharCode(97 + idx)}) [${name}]: ${checkpoint}\n`;
    });

    if (count > 1) {
      prompt += `\n2. 결함 간 인과관계(보상 동작) 분석:\n`;
      prompt += `   - 선행 결함으로 인해 다운스윙 시 나타난 연쇄 보상 동작(Compensatory Movement)인지 분석해 주세요.\n`;
      prompt += `\n3. 최우선 교정 처방 (1순위 One-Thing):\n`;
      prompt += `   - 가장 먼저 고쳐야 할 '단 1가지 핵심 신체 느낌(Feel)'과 추천 드릴 1개를 제시해 주세요.`;
    } else {
      prompt += `\n2. 근본 발생 원인 및 타점 분석:\n`;
      prompt += `   - 해당 결함이 발생할 때 클럽 헤드의 최저점 타점에 미치는 원인을 분석해 주세요.\n`;
      prompt += `\n3. 즉각적인 해결책 (One-Thing 큐):\n`;
      prompt += `   - 타석에서 바로 다음 샷에 적용할 수 있는 핵심 드릴 1개를 알려주세요.`;
    }

    return prompt;
  }

  const generateAiPromptBtn = document.getElementById("generate-ai-prompt-btn");
  if (generateAiPromptBtn) {
    generateAiPromptBtn.addEventListener("click", () => {
      if (selectedMissReasons.size === 0) {
        alert("⚠️ 위 목록에서 오늘 발생한 미스샷 원인을 1개 이상 먼저 선택해 주세요!");
        const missCard = document.getElementById("miss-reason-card");
        if (missCard) missCard.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const promptText = assembleAiPrompt(selectedMissReasons);

      openModal(
        "🎬 AI 스윙 정밀 분석 질문 생성",
        `
        <div class="ai-prompt-modal-wrap">
          <div class="field-label" style="color:#81c784; font-weight:600; margin-bottom:4px;">
            ✓ 감지된 미스샷 (${selectedMissReasons.size}개): ${Array.from(selectedMissReasons).join(", ")}
          </div>
          <div class="ai-guide-tip">
            💡 <strong>사용 팁:</strong> 질문을 복사한 뒤, <strong>ChatGPT, Gemini</strong> 등에 스윙 영상과 함께 붙여넣기 하세요!
          </div>

          <textarea id="ai-prompt-textarea" class="ai-prompt-textarea" rows="8">${promptText}</textarea>
          
          <button type="button" id="copy-main-btn" class="submit-btn" style="margin: 10px 0 6px; background: #2e7d32;">
            📄 질문 복사 (클립보드 저장)
          </button>

          <div class="ai-fast-actions-grid">
            <button type="button" id="open-chatgpt-btn" class="ai-service-btn btn-chatgpt">
              🟢 ChatGPT 열기
            </button>
            <button type="button" id="open-gemini-btn" class="ai-service-btn btn-gemini">
              ✨ Gemini 열기
            </button>
          </div>
        </div>
      `
      );

      const textarea = document.getElementById("ai-prompt-textarea");
      const copyMainBtn = document.getElementById("copy-main-btn");
      const openChatgptBtn = document.getElementById("open-chatgpt-btn");
      const openGeminiBtn = document.getElementById("open-gemini-btn");

      const copyToClipboard = () => {
        if (!textarea) return;
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textarea.value);
      };

      if (copyMainBtn) {
        copyMainBtn.addEventListener("click", () => {
          copyToClipboard();
          alert("✅ 질문이 복사되었습니다!");
        });
      }

      if (openChatgptBtn) {
        openChatgptBtn.addEventListener("click", () => {
          copyToClipboard();
          window.open("https://chatgpt.com", "_blank");
          closeModal();
        });
      }

      if (openGeminiBtn) {
        openGeminiBtn.addEventListener("click", () => {
          copyToClipboard();
          window.open("https://gemini.google.com", "_blank");
          closeModal();
        });
      }
    });
  }

  // 텐션 슬라이더
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
  // [7. 연습 요약 및 복기 카드 갱신]
  // ==========================================
  function updateSummaryAndPrevAction() {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");

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
              <span class="action-item-date">${normalizeDate(l.date)} (${l.duration || 30}분 연습)</span>
              <div class="action-item-text">🎯 ${l.nextAction}</div>
            </div>
          </div>
        `
          )
          .join("");
      } else {
        prevActionDisplay.innerHTML = '<div class="highlight-text">아직 이전 기록이 없습니다. 힘빼고 가볍게 스윙을 시작하세요!</div>';
      }
    }

    const totalCount = logs.length;
    const totalSessionsEl = document.getElementById("sum-total-sessions");
    if (totalSessionsEl) totalSessionsEl.textContent = `${totalCount}회`;

    const currentYearMonth = getTodayString().slice(0, 7);
    const monthLogs = logs.filter((l) => normalizeDate(l.date).startsWith(currentYearMonth));
    const monthCount = monthLogs.length;

    if (totalCount === 0) {
      document.getElementById("sum-draw-rate").textContent = "0%";
      document.getElementById("sum-back-pain-rate").textContent = "0%";
      document.getElementById("sum-avg-tension").textContent = "-";
      document.getElementById("sum-top-miss").textContent = "주요 미스샷 트리거: 데이터 수집 중";
      return;
    }

    const drawCount = logs.filter((l) => l.ballFlight && l.ballFlight.includes("드로우")).length;
    document.getElementById("sum-draw-rate").textContent = `${Math.round((drawCount / totalCount) * 100)}%`;

    const backPainCountTotal = logs.filter(
      (l) => Array.isArray(l.painParts) && (l.painParts.includes("허리") || l.painParts.includes("허리/요추"))
    ).length;
    document.getElementById("sum-back-pain-rate").textContent = `${Math.round((backPainCountTotal / totalCount) * 100)}%`;

    const backPainCountMonth = monthLogs.filter(
      (l) => Array.isArray(l.painParts) && (l.painParts.includes("허리") || l.painParts.includes("허리/요추"))
    ).length;
    const backMonthSubEl = document.getElementById("sum-back-month-sub");
    if (backMonthSubEl) {
      backMonthSubEl.textContent = `당월 ${backPainCountMonth}/${monthCount}회`;
    }

    const totalTension = logs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    document.getElementById("sum-avg-tension").textContent = `${(totalTension / totalCount).toFixed(1)} / 5.0`;

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
  // [8. 연습 일지 저장]
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
        date: selectedDate,
        duration: currentDuration,
        painParts: getActiveMulti("pain-part-group"),
        painLevel: document.getElementById("pain-level").value,
        ballFlight: getActiveSingle("ball-flight-group"),
        tensionLevel: tensionRange ? tensionRange.value : "3",
        weightTransfer: document.getElementById("weight-transfer").value,
        missReasons: Array.from(selectedMissReasons),
        nextAction: document.getElementById("next-action-input").value.trim()
      };

      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      logs.push(newLog);
      logs.sort((a, b) => new Date(normalizeDate(a.date)) - new Date(normalizeDate(b.date)));
      localStorage.setItem("golf_practice_logs", JSON.stringify(logs));

      alert(`✅ [${selectedDate}] 연습 일지가 저장되었습니다!`);
      document.getElementById("next-action-input").value = "";
      selectedMissReasons.clear();
      renderMissReasonChips();
      updateSummaryAndPrevAction();
    });
  }

  // ==========================================
  // [9. 클럽 스펙 & 드릴 관리 모듈 (완전 복구)]
  // ==========================================
  const toggleClubFormBtn = document.getElementById("toggle-club-form-btn");
  const clubForm = document.getElementById("club-form");
  const clubList = document.getElementById("club-list");

  function renderClubs() {
    if (!clubList) return;
    const clubs = JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
    clubList.innerHTML = clubs.length === 0 ? '<div class="empty-notice">등록된 클럽이 없습니다.</div>' : "";
    clubs.forEach((club) => {
      const item = document.createElement("div");
      item.className = "item-card";
      item.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge">${club.type || ""} · ${club.subname || ""}</span>
            <div class="item-main-title">${club.maker ? club.maker + " " : ""}<strong>${club.model || ""}</strong></div>
          </div>
        </div>
      `;
      clubList.appendChild(item);
    });
  }
  renderClubs();

  if (toggleClubFormBtn && clubForm) {
    toggleClubFormBtn.addEventListener("click", () => {
      clubForm.classList.toggle("show");
    });
  }

  const toggleDrillFormBtn = document.getElementById("toggle-drill-form-btn");
  const drillForm = document.getElementById("drill-form");
  const drillList = document.getElementById("drill-list");

  function renderDrills() {
    if (!drillList) return;
    const drills = JSON.parse(localStorage.getItem("golf_drills") || "[]");
    drillList.innerHTML = drills.length === 0 ? '<div class="empty-notice">보관된 드릴이 없습니다.</div>' : "";
    drills.forEach((drill) => {
      const item = document.createElement("div");
      item.className = "item-card";
      item.innerHTML = `
        <div class="item-header">
          <span class="item-badge">${drill.category || "일반"}</span>
          <div class="item-main-title">${drill.title || ""}</div>
        </div>
        <a href="${drill.url || "#"}" target="_blank" class="link-action-btn">▶ Youtube / 레슨 바로가기</a>
      `;
      drillList.appendChild(item);
    });
  }
  renderDrills();

  if (toggleDrillFormBtn && drillForm) {
    toggleDrillFormBtn.addEventListener("click", () => {
      drillForm.classList.toggle("show");
    });
  }
});

// PWA 서비스 워커 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}