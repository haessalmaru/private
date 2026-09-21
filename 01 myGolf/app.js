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

  // ==========================================
  // [릴리즈 히스토리 (v1.5 통합)]
  // ==========================================
  const RELEASE_HISTORY = [
    {
      version: "v1.5",
      title: "초보자용 역추적 나침반, 13대 미스샷 점검 & 월간 출석부 네비게이션 완비",
      features: [
        "🧭 '구질 & 타점 역추적 나침반' 신설: 볼 비행/타점/센서 수치로 유력 원인 자동 추출 및 원클릭 일지 반영",
        "📅 '월간 출석부 캘린더 네비게이션' 탑재: 이전달/다음달(◀, ▶) 자유로운 이동 및 과거 연습 기록 소급 조회 완비",
        "클럽 22종 정밀 스펙 아코디언 드로어 및 드릴 실시간 검색/필터 칩 복원 안정화",
        "미스샷 원인 13종 확충 (과도한 스트롱 그립, 과도한 손목 롤링, 힙턴 블록 신설)",
        "미스샷 팝업 4단계 구조화: 발생원인 / 유발미스샷 / 📋자가점검 리스트(체크박스형) / 교정드릴",
        "범용 AI 지원 (클립보드 메인 복사 + ChatGPT/Gemini 바로가기 + 스마트폰 공유하기)"
      ]
    },
    {
      version: "v1.4",
      title: "AI 스윙 정밀 분석 질문 자동 생성기 & 범용 AI(ChatGPT/Gemini/공유) 연동",
      features: [
        "미스샷 자가 진단 기반 모듈형 프롬프트 조립(Modular Prompt) 엔진 신설",
        "미스샷 0개 선택 시 직관적 유도 안내 / 1개 이상 선택 시 전문 질문지 즉시 생성",
        "단일 결함 분석 및 복수 결함 시 '보상 동작 인과관계 추적 & 1순위 교정 처방' 자동 결합",
        "범용 AI 친화적 구성: 메인 질문 복사 + ChatGPT/Gemini 원터치 열기 + 스마트폰 기본 앱 공유하기 탑재"
      ]
    },
    {
      version: "v1.3",
      title: "9대 미스샷 백과, 과거일자 소급 달력 & 인터랙티브 분석 모달",
      features: [
        "미스샷 원인별 상세 가이드 팝업 탑재 및 2열 정렬 레이아웃 적용",
        "연습 일자 소급 입력 달력 선택기 신설 (과거 누락 연습 기록 지원)",
        "누적 분석 상단 요약 카드 인터랙티브 모달 연동"
      ]
    },
    {
      version: "v1.2",
      title: "최근 3개 복기 과제 리스트 & 드릴 실시간 검색/필터 칩",
      features: [
        "일지 탭 직전 복기 과제를 최근 3개 최신순 역순 나열 리스트로 확장",
        "드릴 보관함 상단 실시간 검색창 및 원클릭 카테고리 필터 칩 바 탑재"
      ]
    },
    {
      version: "v1.1",
      title: "연습시간 Stepper, 7대 신체부위 정렬 & 드릴 URL 범용화",
      features: [
        "연습 시간 +/- 10분 단위 Stepper 조절 버튼 추가",
        "신체 통증 부위를 위에서 아래 순(7개 부위)으로 골퍼 맞춤 재정비"
      ]
    },
    {
      version: "v1.0.0",
      title: "MyGolfNotes 최초 런칭",
      features: [
        "부상 방지 & 상체 힘빼기 중심의 골프 연습 일지 시스템 구축",
        "클럽 장비 스펙 관리 및 유튜브 레슨 아카이빙 기능 탑재"
      ]
    }
  ];

  window.showReleaseHistoryModal = function () {
    const historyHtml = RELEASE_HISTORY.map((rel) => `
      <div class="release-card">
        <div class="release-card-header">
          <span class="release-ver-badge">${rel.version}</span>
          <strong class="release-card-title">${rel.title}</strong>
        </div>
        <ul class="release-feature-list">
          ${rel.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    `).join("");

    openModal("🚀 MyGolfNotes 릴리즈 이력 (최신순)", `
      <div class="release-history-wrap">
        <p class="field-label" style="margin-bottom:10px;">Monk Studio 골프 앱의 버전별 업데이트 기록입니다.</p>
        ${historyHtml}
      </div>
    `);
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
  // [3. 13대 미스샷 원인 백과 및 역추적 태그 데이터]
  // ==========================================
  const ALL_MISS_REASONS_DATA = [
    {
      id: "sway",
      name: "스웨이 & 슬라이드",
      cause: "백스윙 시 척추 축을 중심으로 회전하지 못하고 골반과 상체가 오른쪽으로 밀리거나(스웨이), 다운스윙 시 타깃 방향으로 하체가 과도하게 옆으로 밀려 나가는(슬라이드) 현상.",
      result: "스윙 최저점이 일정하지 않아 발생하는 뒤땅(Fat shot), 탑볼(Thin shot), 푸시 슬라이스 및 심한 훅.",
      checklist: [
        "백스윙 시 오른발 바깥쪽으로 체중이 쏠리며 오른 무릎이 펴지거나 바깥으로 밀리는가?",
        "다운스윙 시 왼쪽 골반이 회전하지 않고 타깃 쪽으로 평행 이동만 심하게 되는가?",
        "임팩트 순간 머리가 어드레스 위치보다 과도하게 좌우로 이동해 있는가?"
      ],
      drill: "• 오른발 바깥쪽 볼 밟기 드릴: 오른발 바깥쪽에 골프공이나 웨지를 밟고 백스윙하여 체중이 잡히는 회전 감각을 익힙니다.",
      aiCheckpoint: "백스윙 탑에서 우측 고관절 힌지 유지 여부 및 다운스윙 전환 시 좌측 골반이 회전 대신 타깃 방향으로 과도하게 슬라이드되는지 여부",
      tags: { flights: ["슬라이스", "푸시", "훅"], contacts: ["뒤땅", "탑볼"], sensors: ["페이스 열림", "아웃-인"] }
    },
    {
      id: "over_the_top",
      name: "오버 더 탑 (엎어치기)",
      cause: "다운스윙 전환 시 하체 선행 없이 상체와 오른쪽 어깨, 손이 먼저 타깃 쪽으로 덤벼들며 클럽이 스윙 플레인 바깥쪽에서 안쪽으로 가파르게 들어오는 동작.",
      result: "악성 슬라이스(페이스 오픈 시), 풀 훅(페이스 클로즈 시), 심한 비거리 손실 및 찍혀 맞는 샷(뽕샷).",
      checklist: [
        "백스윙 톱에서 첫 동작으로 오른쪽 어깨나 오른팔이 공 쪽으로 튀어나오는가?",
        "다운스윙 궤도 데이터가 Out-to-In으로 마이너스 값을 지속적으로 기록하는가?",
        "드라이버 샷 시 헤드 윗부분(크라운)에 볼 자국이 나거나 가파르게 찍혀 맞는가?"
      ],
      drill: "• 오른쪽 팔꿈치 갈비뼈 붙이기 드릴: 백스윙 톱에서 다운스윙 시작 시 오른 팔꿈치가 오른쪽 옆구리를 향해 수직으로 떨어지는 샬로윙 연습.",
      aiCheckpoint: "다운스윙 시작 시 하체 리드 선행 여부 및 오른쪽 어깨/팔이 앞으로 덤비며 샤프트가 스윙 플레인 바깥에서 쏟아지는 아웃-인 궤도 발생 여부",
      tags: { flights: ["슬라이스", "푸시", "훅"], contacts: ["뽕샷", "정타", "탑볼"], sensors: ["아웃-인"] }
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
      drill: "• 엉덩이 의자 터치 드릴: 등 뒤에 의자나 벽을 대고 어드레스 후 임팩트 직전까지 엉덩이가 벽에서 떨어지지 않게 회전하는 연습.",
      aiCheckpoint: "임팩트 구간에서 어드레스 시 형성된 척추 각도 유지 여부 및 골반이 볼 방향으로 전진하며 손목 공간을 좁히는지 여부",
      tags: { flights: ["푸시", "슬라이스", "훅"], contacts: ["생크", "탑볼", "뒤땅"], sensors: ["인-아웃", "페이스 열림"] }
    },
    {
      id: "casting_scooping",
      name: "캐스팅 & 스쿠핑",
      cause: "다운스윙 시작 시 코킹이 일찍 풀려 헤드가 손보다 먼저 내려오거나(캐스팅), 임팩트 구간에서 볼을 띄우려고 손목으로 퍼올리는 동작(스쿠핑).",
      result: "유효 로프트 증가로 인한 과도하게 높은 탄도, 비거리 손실, 심한 뒤땅 및 탑볼.",
      checklist: [
        "다운스윙 허리 높이에서 이미 코킹 각도가 풀려 손목과 샤프트가 일직선이 되는가?",
        "임팩트 순간 손목이 볼보다 뒤에 위치하는가(핸드 레이트)?",
        "왼 손목이 타깃 반대 방향으로 꺾이며(커핑) 공을 걷어 올리는 느낌이 나는가?"
      ],
      drill: "• 스틱 연장선 유지 드릴: 그립 끝에 얼라인먼트 스틱을 겹쳐 잡고 팔로스루 시 스틱이 왼쪽 옆구리를 때리지 않도록 손목 각을 유지합니다.",
      aiCheckpoint: "다운스윙 초기에 손목 코킹 래깅이 유지되는지 및 임팩트 순간 핸드퍼스트 타격 대신 왼손목이 꺾여 헤드가 손을 앞지르는 스쿠핑 여부",
      tags: { flights: ["높은 뽕샷", "훅", "거리손실"], contacts: ["뒤땅", "탑볼"], sensors: ["페이스 열림"] }
    },
    {
      id: "head_up",
      name: "헤드업 & 시선 이탈",
      cause: "볼의 비행 궤적을 눈으로 확인하려는 심리적 조급함, 또는 흉추 회전 유연성이 부족해 머리와 시선을 함께 타깃 쪽으로 들어 올리는 보상 동작.",
      result: "척추 각도가 세워지며 스윙 최저점이 높아져 발생하는 탑볼 및 클럽 페이스 조기 닫힘 방해.",
      checklist: [
        "임팩트 타구음을 듣기도 전에 머리가 이미 타깃 방향으로 돌아가 있는가?",
        "어드레스 때 정해둔 시선의 초점이 임팩트 전에 허공으로 분산되는가?",
        "볼의 출발 탄도를 직접 눈으로 보려고 상체가 조기에 벌떡 일어나는가?"
      ],
      drill: "• 동전/마킹 응시 드릴: 볼 뒤쪽 지점에 마크를 정해놓고 클럽 헤드가 볼을 완전히 통과할 때까지 시선을 고정합니다.",
      aiCheckpoint: "임팩트 순간까지 시선과 머리가 어드레스 축에 안정적으로 머무는지 및 임팩트 직전 시선과 머리가 타깃 방향으로 조기 회전/들리는지 여부",
      tags: { flights: ["슬라이스", "푸시"], contacts: ["탑볼"], sensors: ["페이스 열림"] }
    },
    {
      id: "reverse_pivot",
      name: "리버스 피벗 (역피봇)",
      cause: "백스윙 시 체중이 오른발이 아닌 왼발로 역으로 쏠리고, 상체가 타깃 쪽으로 뒤집어지듯 기울어지는 현상.",
      result: "다운스윙 시 반작용으로 오른발에 체중이 남으며 발생하는 치명적인 뒤땅, 탑볼, 스카잉(뽕샷).",
      checklist: [
        "백스윙 톱에서 머리와 상체가 타깃 방향(왼쪽)으로 기울어져 있는가?",
        "백스윙 완료 시 왼 무릎이 앞으로 심하게 튀어나오고 오른발에 하중이 전혀 없는가?",
        "다운스윙 시 뒤로 누우면서 올려치듯 타격하는가?"
      ],
      drill: "• 스텝 스윙 드릴: 백스윙 시 오른발을 오른쪽으로 반 발자국 디디며 회전하고 다운스윙 시 왼발을 디디며 스윙하는 야구 배팅 스윙 훈련.",
      aiCheckpoint: "백스윙 탑에서 척추 중심축이 타깃 방향으로 꺾여 체중이 왼발에 역으로 실리는지 및 다운스윙 시 오른발로 역이동하는 밸런스 붕괴 여부",
      tags: { flights: ["슬라이스", "높은 뽕샷", "푸시"], contacts: ["뒤땅", "탑볼", "뽕샷"], sensors: ["아웃-인"] }
    },
    {
      id: "lunging",
      name: "상체 덤빔 (런징)",
      cause: "비거리를 늘리려는 과도한 힘으로 인해 다운스윙 전환 시 머리와 상체 전체가 타깃 앞쪽으로 밀고 나가며 공을 가격하려는 동작.",
      result: "급격한 다운블로 형성으로 인한 심한 뽕샷, 드라이버 비거리 급감, 심한 풀 훅 또는 슬라이스.",
      checklist: [
        "임팩트 순간 머리 위치가 어드레스 때 머리 위치보다 타깃 쪽(왼쪽)으로 크게 튀어나가 있는가?",
        "다운스윙 시 상체와 머리가 지면 쪽으로 고꾸라지는 느낌이 드는가?",
        "피니시 때 척추가 타깃 반대쪽으로 활처럼 꺾이며 허리에 과도한 긴장이 오는가?"
      ],
      drill: "• 오른발 뒤꿈치 머리 고정 드릴: 임팩트 순간 머리가 볼 뒤에 머물러 있는 느낌을 유지하며 하체만 턴해줍니다.",
      aiCheckpoint: "임팩트 시 상체(가슴과 머리)가 볼보다 타깃 쪽으로 앞서 돌진하여 지나치게 가파른 입사각을 형성하는지 여부",
      tags: { flights: ["높은 뽕샷", "슬라이스", "훅"], contacts: ["뽕샷", "생크", "뒤땅"], sensors: ["아웃-인"] }
    },
    {
      id: "chicken_wing",
      name: "치킨 윙",
      cause: "임팩트 후 팔로스루 구간에서 왼팔이 자연스럽게 회전되지 못하고 팔꿈치가 바깥쪽으로 구부러지며 당겨지는 현상.",
      result: "페이스가 열린 채 맞아 생기는 슬라이스, 클럽이 당겨지며 발생하는 힐 타구(생크) 및 탑볼.",
      checklist: [
        "팔로스루 때 왼 팔꿈치가 지면을 보지 않고 하늘이나 뒤쪽을 향해 꺾여 있는가?",
        "임팩트 구간에서 왼팔을 의도적으로 구부려 당기며 빠져나가는가?",
        "피니시 때 왼 팔꿈치와 오른 팔꿈치 사이의 간격이 지나치게 벌어지는가?"
      ],
      drill: "• 장갑/수건 끼우기 드릴: 왼쪽 겨드랑이에 수건을 끼우고 팔로스루 구간까지 떨어지지 않도록 일체화하여 회전합니다.",
      aiCheckpoint: "임팩트 후 팔로우스루 구간에서 왼팔 전완 롤링 릴리스가 이루어지지 않고 왼팔꿈치가 몸통 뒤쪽으로 구부러져 당겨지는지 여부",
      tags: { flights: ["슬라이스", "푸시"], contacts: ["생크", "탑볼"], sensors: ["페이스 열림"] }
    },
    {
      id: "hanging_back",
      name: "행잉 백 (체중 잔류)",
      cause: "다운스윙 시 왼발 쪽으로 체중 이동이 전혀 이루어지지 않고 오른발 쪽에 체중이 남은 채로 공을 들어 올리듯 타격하는 동작.",
      result: "클럽 최저점이 공보다 훨씬 뒤에 형성되어 발생하는 심한 뒤땅, 얇은 탑볼, 높은 푸시 슬라이스.",
      checklist: [
        "피니시를 잡았을 때 오른발에 체중이 여전히 50% 이상 남아 뒤로 넘어질 것 같은가?",
        "피니시 후 왼발 하나만으로 똑바로 서서 3초간 버티기 어려운가?",
        "임팩트 존에서 골반이 타깃 쪽으로 체중을 전달하지 못하고 주저앉는가?"
      ],
      drill: "• 스텝 스루 드릴: 타격 후 피니시에서 오른발을 타깃 쪽으로 한 걸음 내딛는 방식으로 체중 이동 완벽 체득.",
      aiCheckpoint: "다운스윙부터 임팩트 이후 피니시까지 체중이 왼발로 완전하게 전이되지 못하고 오른발에 남아 뒤로 누워 퍼올리는지 여부",
      tags: { flights: ["높은 뽕샷", "훅", "슬라이스"], contacts: ["뒤땅", "탑볼"], sensors: ["인-아웃"] }
    },
    {
      id: "flying_elbow",
      name: "플라잉 엘보",
      cause: "백스윙 톱에서 오른쪽 팔꿈치가 지면을 향하지 못하고 등 뒤쪽이나 위쪽으로 과도하게 벌어져 들리는 닭날개 현상.",
      result: "다운스윙 시 궤도가 가팔라지며 발생하는 엎어치기, 심한 슬라이스, 혹은 급격히 보상하며 생기는 악성 훅.",
      checklist: [
        "백스윙 톱에서 오른 팔꿈치가 몸통에서 멀리 떨어져 옆으로 벌어지는가?",
        "백스윙 톱 자세에서 오른 손바닥이 하늘을 보지 않고 정면이나 측면을 보는가?",
        "다운스윙 시 클럽이 등 뒤로 완만하게 떨어지지 않고 앞으로 쏟아지는가?"
      ],
      drill: "• 쟁반 받치기 드릴: 백스윙 톱에서 오른손으로 쟁반을 받치는 각도를 만들고 오른 팔꿈치가 지면을 직각으로 가리키는지 확인합니다.",
      aiCheckpoint: "백스윙 탑에서 오른쪽 팔꿈치가 지면을 향하지 않고 몸통 뒤로 과도하게 벌어져 크로스오버 및 엎어치기 궤도를 형성하는지 여부",
      tags: { flights: ["슬라이스", "훅"], contacts: ["탑볼", "정타"], sensors: ["아웃-인"] }
    },
    {
      id: "strong_grip",
      name: "과도한 스트롱 그립",
      cause: "슬라이스 방지 목적으로 양손 V자 홈이 오른쪽 어깨 바깥을 향할 정도로 과도하게 틀어쥐어 셋업 시점부터 클럽 페이스가 닫히기 쉬운 조건 형성.",
      result: "악성 훅, 출발부터 왼쪽으로 향하는 풀 훅, 탄도가 지나치게 낮아지는 꼬구라짐.",
      checklist: [
        "어드레스 시 내려다보았을 때 왼손 등 주먹 관절(너클)이 3개 이상 보이는가?",
        "양손 엄지와 검지의 V자 홈이 오른쪽 어깨 너머를 가리키고 있는가?",
        "오른손 바닥이 샤프트 밑으로 너무 깊숙이 들어가 위를 향해 있는가?"
      ],
      drill: "• 2-Knuckle 뉴트럴 정렬 드릴: 어드레스 시 왼손 너클이 2~2.5개만 보이게 조정하고 V자 홈이 오른쪽 쇄골을 향하도록 리셋.",
      aiCheckpoint: "어드레스 시 양손 그립 셋업이 과도한 스트롱 그립으로 인해 임팩트 시 클럽 페이스가 조기 폐쇄되는지 여부",
      tags: { flights: ["훅"], contacts: ["정타", "뒤땅"], sensors: ["페이스 닫힘"] }
    },
    {
      id: "wrist_rolling",
      name: "과도한 손목 롤링",
      cause: "다운스윙 임팩트 구간에서 몸통 회전보다 손목 교차 속도가 지나치게 빨라 클럽 페이스를 급격하게 덮어버리는 동작.",
      result: "심한 좌측 감김(오버 훅), 페이스 닫힘에 의한 낮은 풀 샷.",
      checklist: [
        "임팩트 순간 몸통 회전보다 오른손으로 클럽을 감아 돌리는 힘이 더 강한가?",
        "팔로스루 9시 구간에서 오른손이 왼손 위를 지나치게 일찍 덮어버리는가?",
        "인-아웃 궤도는 좋은데 볼이 타깃보다 한참 왼쪽으로만 휘어져 나가는가?"
      ],
      drill: "• 왼손등 타깃 유지 드릴: 임팩트 후 팔로스루 9시까지 왼손 장갑 로고가 타깃을 보게 유지하며 가슴 회전으로 클럽 보냄.",
      aiCheckpoint: "임팩트 존에서 몸통 바디턴 회전 없이 손목의 급격한 교차 롤링으로 인해 페이스 앵글이 급격히 닫혀 악성 풀훅이 유발되는지 여부",
      tags: { flights: ["훅"], contacts: ["정타", "탑볼"], sensors: ["인-아웃", "페이스 닫힘"] }
    },
    {
      id: "hip_turn_block",
      name: "힙턴 블록 (회전 지연)",
      cause: "전환 동작 시 왼쪽 골반이 타깃 뒤쪽으로 과감히 열리지 못하고 회전이 멈추거나 슬라이드만 발생하여 손목 감아치기 보상 동작 유발.",
      result: "팔만 튀어나가며 생기는 풀 훅, 손목이 늦게 따라오며 터지는 푸시 슬라이스.",
      checklist: [
        "임팩트 순간 벨트 버클(골반)이 타깃 방향으로 45도 열리지 못하고 볼 정면을 보고 있는가?",
        "임팩트 구간에서 팔과 클럽이 빠져나갈 공간이 부족해 상체가 들리거나 손목을 꺾는가?",
        "다운스윙 시 회전하지 않고 골반이 옆으로 밀리기만 하는 느낌이 드는가?"
      ],
      drill: "• 왼쪽 뒷주머니 벽 터치 드릴: 다운스윙 시작 시 왼발 뒤꿈치로 지면을 누르며 왼쪽 뒷주머니를 등 뒤 벽 방향으로 과감히 뺌.",
      aiCheckpoint: "다운스윙 전환 시 하체 골반 회전이 멈추거나 막혀 상체 덤빔 또는 손목 감아치기 보상 동작이 발생하는지 여부",
      tags: { flights: ["슬라이스", "푸시", "훅"], contacts: ["생크", "정타", "뒤땅"], sensors: ["페이스 열림", "페이스 닫힘"] }
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
  // [5-1. 🧭 역추적 나침반]
  // ==========================================
  function runReverseCompass(flight, contact, sensor) {
    const scores = ALL_MISS_REASONS_DATA.map((item) => {
      let score = 0;
      let reasons = [];

      if (item.tags.flights.some((f) => flight.includes(f))) {
        score += 35;
        reasons.push(`구질(${flight})`);
      }
      if (item.tags.contacts.some((c) => contact.includes(c))) {
        score += 45;
        reasons.push(`타점(${contact})`);
      }
      if (sensor !== "모름" && item.tags.sensors.some((s) => sensor.includes(s))) {
        score += 25;
        reasons.push(`센서수치(${sensor})`);
      }

      return {
        item: item,
        score: score,
        reasonText: reasons.join(" + ")
      };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.filter((s) => s.score >= 35).slice(0, 3);
  }

  const openCompassBtn = document.getElementById("open-compass-btn");
  if (openCompassBtn) {
    openCompassBtn.addEventListener("click", () => {
      openModal(
        "🧭 미스샷 원인 역추적 나침반",
        `
        <div class="compass-modal-wrap">
          <p class="field-label" style="margin-bottom:8px; line-height:1.4;">
            스윙 결함을 잘 몰라도 괜찮습니다! 방금 친 공의 <strong>비행 궤적과 타점 느낌</strong>을 고르면 유력한 스윙 원인을 찾아드립니다.
          </p>

          <div class="compass-step-title">1단계: 볼 비행 궤적 (공이 어디로 휘나요?)</div>
          <div class="chip-group compass-group" id="compass-flight-group">
            <button type="button" class="chip-btn active" data-val="슬라이스">우측 밀림/슬라이스</button>
            <button type="button" class="chip-btn" data-val="훅">좌측 감김/악성 훅</button>
            <button type="button" class="chip-btn" data-val="높은 뽕샷">높게 떠서 거리손실</button>
            <button type="button" class="chip-btn" data-val="직진">방향은 똑바로</button>
          </div>

          <div class="compass-step-title" style="margin-top:12px;">2단계: 임팩트 타점 (어디에 맞았나요?)</div>
          <div class="chip-group compass-group" id="compass-contact-group">
            <button type="button" class="chip-btn active" data-val="뒤땅">뒤땅 (매트 먼저 침)</button>
            <button type="button" class="chip-btn" data-val="탑볼">탑볼 (공 윗부분 타격)</button>
            <button type="button" class="chip-btn" data-val="생크">생크 (헤드 목/안쪽)</button>
            <button type="button" class="chip-btn" data-val="뽕샷">뽕샷 (헤드 윗면 찍힘)</button>
            <button type="button" class="chip-btn" data-val="정타">정타 (중앙에 맞음)</button>
          </div>

          <div class="compass-step-title" style="margin-top:12px;">3단계: 연습장 모니터 수치 (선택 사항)</div>
          <div class="chip-group compass-group" id="compass-sensor-group">
            <button type="button" class="chip-btn active" data-val="모름">수치 모름/선택 안 함</button>
            <button type="button" class="chip-btn" data-val="아웃-인">Out-In 궤도 (깎아침)</button>
            <button type="button" class="chip-btn" data-val="인-아웃">In-Out 궤도 (밀어침)</button>
            <button type="button" class="chip-btn" data-val="페이스 열림">페이스 열림 (Open)</button>
            <button type="button" class="chip-btn" data-val="페이스 닫힘">페이스 닫힘 (Closed)</button>
          </div>

          <button type="button" id="execute-compass-btn" class="submit-btn" style="margin-top:16px; background:#1b5e20;">
            🔍 내 스윙 결함 역추적 분석하기
          </button>

          <div id="compass-result-area" style="display:none; margin-top:14px;"></div>
        </div>
      `
      );

      setupSingleChipGroup("compass-flight-group");
      setupSingleChipGroup("compass-contact-group");
      setupSingleChipGroup("compass-sensor-group");

      const executeBtn = document.getElementById("execute-compass-btn");
      const resultArea = document.getElementById("compass-result-area");

      if (executeBtn && resultArea) {
        executeBtn.addEventListener("click", () => {
          const selFlight = document.querySelector("#compass-flight-group .chip-btn.active")?.getAttribute("data-val") || "슬라이스";
          const selContact = document.querySelector("#compass-contact-group .chip-btn.active")?.getAttribute("data-val") || "정타";
          const selSensor = document.querySelector("#compass-sensor-group .chip-btn.active")?.getAttribute("data-val") || "모름";

          const topMatches = runReverseCompass(selFlight, selContact, selSensor);

          if (topMatches.length === 0) {
            resultArea.innerHTML = `
              <div class="empty-notice" style="padding:12px; background:#181818; border-radius:6px;">
                일치하는 결함을 찾지 못했습니다. 타점과 구질을 다시 확인해 보세요.
              </div>
            `;
          } else {
            resultArea.innerHTML = `
              <div class="field-label" style="color:#81c784; font-weight:700; font-size:0.85rem; margin-bottom:6px;">
                🎯 분석 완료: 가장 유력한 스윙 원인 Top ${topMatches.length}
              </div>
              <div class="compass-results-list">
                ${topMatches.map((m, idx) => `
                  <div class="compass-match-card">
                    <div class="compass-card-header">
                      <span class="match-rank-badge">${idx + 1}순위</span>
                      <strong>${m.item.name}</strong>
                      <span class="match-reason-tag">${m.reasonText} 일치</span>
                    </div>
                    <p class="compass-card-desc">${m.item.cause}</p>
                  </div>
                `).join("")}
              </div>
              <button type="button" id="apply-compass-to-form-btn" class="submit-btn" style="margin-top:10px;">
                ✓ 위 ${topMatches.length}개 원인을 내 일지에 자동 선택하고 닫기
              </button>
            `;

            document.getElementById("apply-compass-to-form-btn").addEventListener("click", () => {
              topMatches.forEach((m) => selectedMissReasons.add(m.item.name));
              renderMissReasonChips();
              closeModal();
              alert(`✅ [${topMatches.map((m) => m.item.name).join(", ")}] 원인이 자가 진단에 자동 선택되었습니다!`);
              const missCard = document.getElementById("miss-reason-card");
              if (missCard) missCard.scrollIntoView({ behavior: "smooth", block: "center" });
            });
          }

          resultArea.style.display = "block";
          resultArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    });
  }

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
  // [7-1. 월간 출석부 캘린더 네비게이션 (◀, ▶ 월 이동)]
  // ==========================================
  let currentCalYear = new Date().getFullYear();
  let currentCalMonth = new Date().getMonth();

  function renderCalendarContent(year, month) {
    const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const practicedMap = {};
    logs.forEach((l) => {
      const normDate = normalizeDate(l.date);
      if (normDate) practicedMap[normDate] = (practicedMap[normDate] || 0) + Number(l.duration || 30);
    });

    let daysHtml = "";
    for (let i = 0; i < firstDayIndex; i++) daysHtml += `<div class="cal-day empty"></div>`;
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

    return `
      <div class="calendar-wrap">
        <div class="cal-nav-row">
          <button type="button" class="cal-nav-btn" id="cal-prev-month-btn">◀ 이전달</button>
          <strong class="cal-nav-title" id="cal-current-month-title">${year}년 ${month + 1}월</strong>
          <button type="button" class="cal-nav-btn" id="cal-next-month-btn">다음달 ▶</button>
        </div>

        <div class="cal-header-row">
          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
        </div>
        <div class="cal-grid" id="cal-grid-body">${daysHtml}</div>
        <div class="cal-guide">
          <span style="color:#81c784; font-weight:bold;">● 초록 표시: 연습 완료일 (시간 표기)</span><br>
          <span>💡 날짜를 터치하면 해당 일자로 즉시 연습 일지를 입력할 수 있습니다.</span>
        </div>
      </div>
    `;
  }

  function attachCalendarNavEvents() {
    const prevBtn = document.getElementById("cal-prev-month-btn");
    const nextBtn = document.getElementById("cal-next-month-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentCalMonth--;
        if (currentCalMonth < 0) {
          currentCalMonth = 11;
          currentCalYear--;
        }
        updateCalendarModalView();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentCalMonth++;
        if (currentCalMonth > 11) {
          currentCalMonth = 0;
          currentCalYear++;
        }
        updateCalendarModalView();
      });
    }

    document.querySelectorAll(".cal-day[data-date]").forEach((el) => {
      el.addEventListener("click", () => {
        const selectedDate = el.getAttribute("data-date");
        if (practiceDateInput) practiceDateInput.value = selectedDate;
        closeModal();
        practiceDateInput.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function updateCalendarModalView() {
    if (!modalBody) return;
    modalTitle.textContent = `📅 ${currentCalYear}년 ${currentCalMonth + 1}월 연습 출석부`;
    modalBody.innerHTML = renderCalendarContent(currentCalYear, currentCalMonth);
    attachCalendarNavEvents();
  }

  const triggerCalendarModal = document.getElementById("trigger-calendar-modal");
  if (triggerCalendarModal) {
    triggerCalendarModal.addEventListener("click", () => {
      const today = new Date();
      currentCalYear = today.getFullYear();
      currentCalMonth = today.getMonth();
      openModal(`📅 ${currentCalYear}년 ${currentCalMonth + 1}월 연습 출석부`, renderCalendarContent(currentCalYear, currentCalMonth));
      attachCalendarNavEvents();
    });
  }

  const triggerFlightModal = document.getElementById("trigger-flight-modal");
  if (triggerFlightModal) {
    triggerFlightModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const counts = { "드로우(성공)": 0, "스트레이트": 0, "푸시 발생": 0, "훅 발생": 0, "슬라이스": 0 };
      logs.forEach((l) => {
        if (counts[l.ballFlight] !== undefined) counts[l.ballFlight]++;
      });

      const rowsHtml = Object.entries(counts).map(([name, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
          <div class="stat-bar-row">
            <div class="stat-bar-label"><span>${name}</span><strong>${count}회 (${pct}%)</strong></div>
            <div class="stat-progress-track"><div class="stat-progress-fill" style="width: ${pct}%;"></div></div>
          </div>
        `;
      }).join("");

      openModal("🎯 나의 5대 구질 누적 분포", `<div class="stat-detail-box"><p class="field-label">총 ${total}회 연습 세션 동안의 구질 분포 현황입니다.</p>${rowsHtml}</div>`);
    });
  }

  const triggerPainModal = document.getElementById("trigger-pain-modal");
  if (triggerPainModal) {
    triggerPainModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const currentYearMonth = getTodayString().slice(0, 7);
      const monthLogs = logs.filter((l) => normalizeDate(l.date).startsWith(currentYearMonth));

      const partsCount = {};
      logs.forEach((l) => {
        if (Array.isArray(l.painParts)) {
          l.painParts.forEach((p) => {
            partsCount[p] = (partsCount[p] || 0) + 1;
          });
        }
      });
      const partsHtml = Object.entries(partsCount).sort((a, b) => b[1] - a[1]).map(([part, c]) => `
        <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #282828;">
          <span>🩹 ${part}</span><strong style="color:#ff8a80;">${c}회 (${total > 0 ? Math.round((c / total) * 100) : 0}%)</strong>
        </div>
      `).join("");

      openModal("🩹 통증 빈도 & 부상 예방 추이", `
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
      `);
    });
  }

  const triggerTensionModal = document.getElementById("trigger-tension-modal");
  if (triggerTensionModal) {
    triggerTensionModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const total = logs.length;
      const currentYearMonth = getTodayString().slice(0, 7);
      const monthLogs = logs.filter((l) => normalizeDate(l.date).startsWith(currentYearMonth));

      const tensionCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      logs.forEach((l) => {
        const val = Number(l.tensionLevel || 3);
        if (tensionCounts[val] !== undefined) tensionCounts[val]++;
      });
      const totalT = logs.reduce((acc, c) => acc + Number(c.tensionLevel || 3), 0);
      const avgT = total > 0 ? (totalT / total).toFixed(2) : "-";
      const monthT = monthLogs.reduce((acc, c) => acc + Number(c.tensionLevel || 3), 0);
      const avgMonthT = monthLogs.length > 0 ? (monthT / monthLogs.length).toFixed(2) : "-";

      const barsHtml = [1, 2, 3, 4, 5].map((lvl) => {
        const c = tensionCounts[lvl];
        const pct = total > 0 ? Math.round((c / total) * 100) : 0;
        return `
          <div class="stat-bar-row">
            <div class="stat-bar-label"><span>레벨 ${lvl}: ${tensionLabels[lvl]}</span><strong>${c}회 (${pct}%)</strong></div>
            <div class="stat-progress-track"><div class="stat-progress-fill" style="width: ${pct}%; background-color:#81c784;"></div></div>
          </div>
        `;
      }).join("");

      openModal("⚖️ 힘빼기 & 상체 텐션 변화 추이", `
        <div class="stat-detail-box">
          <div class="summary-grid" style="margin-bottom:12px;">
            <div class="summary-item"><span class="summary-label">전체 평균 텐션</span><span class="summary-val" style="color:#81c784;">${avgT} / 5.0</span></div>
            <div class="summary-item"><span class="summary-label">당월(${currentYearMonth}) 평균</span><span class="summary-val" style="color:#64b5f6;">${avgMonthT} / 5.0</span></div>
          </div>
          <div class="field-label">텐션 레벨별 분포 현황</div>
          ${barsHtml}
        </div>
      `);
    });
  }

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
  // [9. 클럽 스펙 모듈 (문법 오류 제거 및 안전 렌더링)]
  // ==========================================
  const clubForm = document.getElementById("club-form");
  const toggleClubFormBtn = document.getElementById("toggle-club-form-btn");
  const clubList = document.getElementById("club-list");
  const cancelClubEditBtn = document.getElementById("cancel-club-edit-btn");
  const clubEditIdInput = document.getElementById("club-edit-id");
  const clubFormTitle = document.getElementById("club-form-title");
  const submitClubBtn = document.getElementById("submit-club-btn");

  const clubTypeSelect = document.getElementById("club-type");
  const wedgeSpecGroup = document.getElementById("wedge-spec-group");

  if (clubTypeSelect && wedgeSpecGroup) {
    clubTypeSelect.addEventListener("change", (e) => {
      wedgeSpecGroup.style.display = e.target.value === "웨지" ? "flex" : "none";
    });
  }

  if (toggleClubFormBtn && clubForm) {
    toggleClubFormBtn.addEventListener("click", () => {
      clubForm.classList.toggle("show");
      if (!clubForm.classList.contains("show")) resetClubForm();
    });
  }

  function resetClubForm() {
    if (!clubForm) return;
    clubForm.reset();
    if (clubEditIdInput) clubEditIdInput.value = "";
    if (clubFormTitle) clubFormTitle.textContent = "신규 클럽 상세 스펙 등록";
    if (submitClubBtn) submitClubBtn.textContent = "클럽 정밀 스펙 저장";
    if (cancelClubEditBtn) cancelClubEditBtn.style.display = "none";
    if (wedgeSpecGroup) wedgeSpecGroup.style.display = "none";
  }

  if (cancelClubEditBtn) {
    cancelClubEditBtn.addEventListener("click", () => {
      resetClubForm();
      if (clubForm) clubForm.classList.remove("show");
    });
  }

  function getClubsData() {
    return JSON.parse(localStorage.getItem("golf_my_clubs") || "[]");
  }

  function saveClubsData(data) {
    localStorage.setItem("golf_my_clubs", JSON.stringify(data));
  }

  function renderClubs() {
    if (!clubList) return;
    const clubs = getClubsData();
    clubList.innerHTML = "";

    if (clubs.length === 0) {
      clubList.innerHTML = '<div class="empty-notice">등록된 클럽이 없습니다. [+ 클럽 추가]를 눌러 22가지 정밀 스펙을 기록해 보세요!</div>';
      return;
    }

    clubs.forEach((club) => {
      const card = document.createElement("div");
      card.className = "item-card club-expandable-card";

      const badgeColor = club.status === "사용" ? "#2b3a2b" : (club.status === "방출" ? "#382323" : "#2a2d36");
      const badgeTextColor = club.status === "사용" ? "#81c784" : (club.status === "방출" ? "#ef9a9a" : "#90caf9");

      // 백틱 내부 중첩 따옴표 문법 에러를 방지하기 위해 변수로 분리
      const totalWeightStr = club.totalWeight ? club.totalWeight + "g" : "-";
      const cpmStr = club.cpm ? club.cpm + "cpm" : "-";
      const flexStr = club.flex ? club.flex : "-";
      const priceStr = club.price ? Number(club.price).toLocaleString() + "원" : "-";

      card.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge" style="background-color: ${badgeColor}; color: ${badgeTextColor};">${club.status || "사용"} · ${club.type} · ${club.subname}</span>
            <div class="item-main-title">${club.maker ? club.maker + " " : ""}<strong>${club.model}</strong></div>
          </div>
          <div class="card-action-group" onclick="event.stopPropagation();">
            <button type="button" class="action-text-btn edit-club-btn" data-id="${club.id}">수정</button>
            <button type="button" class="action-text-btn delete-club-btn" data-id="${club.id}">삭제</button>
          </div>
        </div>

        <div class="spec-grid">
          <div>🎯 비거리: <strong style="color:#81c784;">${club.distance || "-"}</strong></div>
          <div>⚖️ 총중량: <strong>${totalWeightStr}</strong></div>
          <div>⚡ 강도/CPM: <strong>${flexStr}/${cpmStr}</strong></div>
          <div>⚖️ 스윙웨이트: <strong>${club.swingweight || "-"}</strong></div>
        </div>

        <div class="club-detail-drawer" id="drawer-${club.id}">
          <div class="detail-divider"></div>
          <div class="spec-grid spec-detail-grid">
            <div>📐 로프트각: <strong>${club.loft || "-"}</strong></div>
            <div>📐 라이각: <strong>${club.lie || "-"}</strong></div>
            <div>🏌️ 클럽길이: <strong>${club.length || "-"}</strong></div>
            <div>📦 체적(cc): <strong>${club.headVolume || "-"}</strong></div>
            <div>🔩 헤드무게: <strong>${club.headWeight || "-"}</strong></div>
            <div>🔩 무게추: <strong>${club.headWeightScrew || "-"}</strong></div>
            <div>🪵 샤프트: <strong>${club.shaftMaterial || ""} ${club.shaftName || "-"}</strong></div>
            <div>🪵 샤프트무게: <strong>${club.shaftWeight || "-"}</strong></div>
            <div>🔄 토크: <strong>${club.torque || "-"}</strong></div>
            <div>🎯 킥포인트: <strong>${club.kickpoint || "-"}</strong></div>
            <div>🖐️ 그립: <strong>${club.gripType || "-"}</strong></div>
            <div>🖐️ 그립규격: <strong>${club.gripSize || "-"}</strong></div>
            <div>🖐️ 그립무게: <strong>${club.gripWeight || "-"}</strong></div>
            ${club.type === "웨지" ? `<div>⛳ 바운스: <strong>${club.wedgeBounce \vert{}\vert{} "-"}</strong></div><div>⛳ 그라인드: <strong>${club.wedgeGrind || "-"}</strong></div>` : ""}
            <div>💰 구입가: <strong>${priceStr}</strong></div>
            <div>📅 구입일: <strong>${club.buyDate || "-"}</strong></div>
          </div>
        </div>
        <div class="expand-hint">▼ 터치하여 상세 스펙 펼치기 / 접기</div>
      `;

      card.addEventListener("click", () => {
        const drawer = card.querySelector(".club-detail-drawer");
        const hint = card.querySelector(".expand-hint");
        if (drawer) {
          drawer.classList.toggle("open");
          if (hint) {
            hint.textContent = drawer.classList.contains("open") ? "▲ 터치하여 상세 스펙 접기" : "▼ 터치하여 상세 스펙 펼치기 / 접기";
          }
        }
      });

      const editBtn = card.querySelector(".edit-club-btn");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          const targetClub = clubs.find((c) => c.id === Number(club.id));
          if (!targetClub) return;

          document.getElementById("club-distance").value = targetClub.distance || "";
          document.getElementById("club-status").value = targetClub.status || "사용";
          document.getElementById("club-type").value = targetClub.type || "드라이버";
          document.getElementById("club-subname").value = targetClub.subname || "";
          document.getElementById("club-maker").value = targetClub.maker || "";
          document.getElementById("club-model").value = targetClub.model || "";
          document.getElementById("club-head-volume").value = targetClub.headVolume || "";
          document.getElementById("club-head-weight").value = targetClub.headWeight || "";
          document.getElementById("club-head-weight-screw").value = targetClub.headWeightScrew || "";
          document.getElementById("club-loft").value = targetClub.loft || "";
          document.getElementById("club-lie").value = targetClub.lie || "";
          document.getElementById("club-wedge-bounce").value = targetClub.wedgeBounce || "";
          document.getElementById("club-wedge-grind").value = targetClub.wedgeGrind || "";
          document.getElementById("club-shaft-material").value = targetClub.shaftMaterial || "그라파이트";
          document.getElementById("club-shaft-name").value = targetClub.shaftName || "";
          document.getElementById("club-shaft-weight").value = targetClub.shaftWeight || "";
          document.getElementById("club-flex").value = targetClub.flex || "S";
          document.getElementById("club-cpm").value = targetClub.cpm || "";
          document.getElementById("club-torque").value = targetClub.torque || "";
          document.getElementById("club-kickpoint").value = targetClub.kickpoint || "";
          document.getElementById("club-grip-type").value = targetClub.gripType || "";
          document.getElementById("club-grip-size").value = targetClub.gripSize || "";
          document.getElementById("club-grip-weight").value = targetClub.gripWeight || "";
          document.getElementById("club-total-weight").value = targetClub.totalWeight || "";
          document.getElementById("club-swingweight").value = targetClub.swingweight || "";
          document.getElementById("club-length").value = targetClub.length || "";
          document.getElementById("club-price").value = targetClub.price || "";
          document.getElementById("club-buy-date").value = targetClub.buyDate || "";

          if (wedgeSpecGroup) wedgeSpecGroup.style.display = targetClub.type === "웨지" ? "flex" : "none";

          clubEditIdInput.value = targetClub.id;
          clubFormTitle.textContent = `클럽 스펙 수정: [${targetClub.subname}] ${targetClub.model}`;
          submitClubBtn.textContent = "수정 내용 갱신";
          cancelClubEditBtn.style.display = "block";
          clubForm.classList.add("show");
          clubForm.scrollIntoView({ behavior: "smooth" });
        });
      }

      const delBtn = card.querySelector(".delete-club-btn");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          if (confirm(`[${club.subname} - ${club.model}] 클럽 스펙을 정말 삭제하시겠습니까?`)) {
            const updated = clubs.filter((c) => c.id !== Number(club.id));
            saveClubsData(updated);
            renderClubs();
          }
        });
      }

      clubList.appendChild(card);
    });
  }

  if (clubForm) {
    clubForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const editId = clubEditIdInput.value;
      const clubs = getClubsData();

      const newClub = {
        id: editId ? Number(editId) : Date.now(),
        distance: document.getElementById("club-distance").value.trim(),
        status: document.getElementById("club-status").value,
        type: document.getElementById("club-type").value,
        subname: document.getElementById("club-subname").value.trim(),
        maker: document.getElementById("club-maker").value.trim(),
        model: document.getElementById("club-model").value.trim(),
        headVolume: document.getElementById("club-head-volume").value.trim(),
        headWeight: document.getElementById("club-head-weight").value.trim(),
        headWeightScrew: document.getElementById("club-head-weight-screw").value.trim(),
        loft: document.getElementById("club-loft").value.trim(),
        lie: document.getElementById("club-lie").value.trim(),
        wedgeBounce: document.getElementById("club-wedge-bounce").value.trim(),
        wedgeGrind: document.getElementById("club-wedge-grind").value.trim(),
        shaftMaterial: document.getElementById("club-shaft-material").value,
        shaftName: document.getElementById("club-shaft-name").value.trim(),
        shaftWeight: document.getElementById("club-shaft-weight").value.trim(),
        flex: document.getElementById("club-flex").value,
        cpm: document.getElementById("club-cpm").value.trim(),
        torque: document.getElementById("club-torque").value.trim(),
        kickpoint: document.getElementById("club-kickpoint").value.trim(),
        gripType: document.getElementById("club-grip-type").value.trim(),
        gripSize: document.getElementById("club-grip-size").value.trim(),
        gripWeight: document.getElementById("club-grip-weight").value.trim(),
        totalWeight: document.getElementById("club-total-weight").value.trim(),
        swingweight: document.getElementById("club-swingweight").value.trim(),
        length: document.getElementById("club-length").value.trim(),
        price: document.getElementById("club-price").value.replace(/,/g, "").trim(),
        buyDate: document.getElementById("club-buy-date").value
      };

      if (editId) {
        const idx = clubs.findIndex((c) => c.id === Number(editId));
        if (idx !== -1) clubs[idx] = newClub;
      } else {
        clubs.push(newClub);
      }

      saveClubsData(clubs);
      renderClubs();
      resetClubForm();
      clubForm.classList.remove("show");
      alert(editId ? "✅ 클럽 스펙이 성공적으로 수정되었습니다!" : "✅ 신규 클럽 스펙이 안전하게 저장되었습니다!");
    });
  }

  // 클럽 CSV 다운로드
  const exportClubCsvBtn = document.getElementById("export-club-csv-btn");
  if (exportClubCsvBtn) {
    exportClubCsvBtn.addEventListener("click", () => {
      const clubs = getClubsData();
      if (clubs.length === 0) {
        alert("내보낼 클럽 데이터가 없습니다.");
        return;
      }

      const headers = ["구분", "클럽종류", "넘버/각도", "메이커", "모델명", "목표비거리", "로프트", "라이각", "헤드체적", "헤드본체무게", "무게추", "샤프트소재", "샤프트모델", "샤프트무게", "강도", "CPM", "토크", "킥포인트", "그립모델", "그립사이즈", "그립무게", "총중량", "스윙웨이트", "길이", "웨지바운스", "웨지그라인드", "구입가격", "구입일자"];
      const rows = clubs.map((c) => [
        `"${c.status || '사용'}"`, `"${c.type || ''}"`, `"${c.subname || ''}"`, `"${c.maker || ''}"`, `"${c.model || ''}"`,
        `"${c.distance || ''}"`, `"${c.loft || ''}"`, `"${c.lie || ''}"`, `"${c.headVolume || ''}"`, `"${c.headWeight || ''}"`, `"${c.headWeightScrew || ''}"`,
        `"${c.shaftMaterial || ''}"`, `"${c.shaftName || ''}"`, `"${c.shaftWeight || ''}"`, `"${c.flex || ''}"`, `"${c.cpm || ''}"`, `"${c.torque || ''}"`, `"${c.kickpoint || ''}"`,
        `"${c.gripType || ''}"`, `"${c.gripSize || ''}"`, `"${c.gripWeight || ''}"`, `"${c.totalWeight || ''}"`, `"${c.swingweight || ''}"`, `"${c.length || ''}"`,
        `"${c.wedgeBounce || ''}"`, `"${c.wedgeGrind || ''}"`, `"${c.price || ''}"`, `"${c.buyDate || ''}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MyClubs_Spec_${getTodayString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  renderClubs();

  // ==========================================
  // [10. 드릴 & 레슨 모듈 (검색/필터 칩/카드 UI 완벽 동작)]
  // ==========================================
  const drillForm = document.getElementById("drill-form");
  const toggleDrillFormBtn = document.getElementById("toggle-drill-form-btn");
  const drillList = document.getElementById("drill-list");
  const cancelDrillEditBtn = document.getElementById("cancel-drill-edit-btn");
  const drillEditIdInput = document.getElementById("drill-edit-id");
  const drillFormTitle = document.getElementById("drill-form-title");
  const submitDrillBtn = document.getElementById("submit-drill-btn");
  const drillSearchInput = document.getElementById("drill-search-input");
  const drillFilterChips = document.getElementById("drill-filter-chips");
  const drillCategoryInput = document.getElementById("drill-category");

  let currentDrillCategory = "전체";
  let currentDrillSearchQuery = "";

  if (toggleDrillFormBtn && drillForm) {
    toggleDrillFormBtn.addEventListener("click", () => {
      drillForm.classList.toggle("show");
      if (!drillForm.classList.contains("show")) resetDrillForm();
    });
  }

  function resetDrillForm() {
    if (!drillForm) return;
    drillForm.reset();
    if (drillEditIdInput) drillEditIdInput.value = "";
    if (drillFormTitle) drillFormTitle.textContent = "신규 레슨/드릴 저장";
    if (submitDrillBtn) submitDrillBtn.textContent = "드릴 저장";
    if (cancelDrillEditBtn) cancelDrillEditBtn.style.display = "none";
  }

  if (cancelDrillEditBtn) {
    cancelDrillEditBtn.addEventListener("click", () => {
      resetDrillForm();
      if (drillForm) drillForm.classList.remove("show");
    });
  }

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (drillCategoryInput) drillCategoryInput.value = chip.getAttribute("data-cat");
    });
  });

  function getDrillsData() {
    return JSON.parse(localStorage.getItem("golf_drills") || "[]");
  }

  function saveDrillsData(data) {
    localStorage.setItem("golf_drills", JSON.stringify(data));
  }

  function renderDrillFilterChips() {
    if (!drillFilterChips) return;
    const drills = getDrillsData();
    const categories = ["전체"];
    drills.forEach((d) => {
      if (d.category && !categories.includes(d.category)) categories.push(d.category);
    });

    drillFilterChips.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `filter-chip-btn ${currentDrillCategory === cat ? "active" : ""}`;
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        currentDrillCategory = cat;
        renderDrillFilterChips();
        renderDrills();
      });
      drillFilterChips.appendChild(btn);
    });
  }

  if (drillSearchInput) {
    drillSearchInput.addEventListener("input", (e) => {
      currentDrillSearchQuery = e.target.value.toLowerCase().trim();
      renderDrills();
    });
  }

  function renderDrills() {
    if (!drillList) return;
    const drills = getDrillsData();

    const filtered = drills.filter((drill) => {
      const matchesCategory = currentDrillCategory === "전체" || drill.category === currentDrillCategory;
      const q = currentDrillSearchQuery;
      const matchesQuery =
        !q ||
        (drill.title && drill.title.toLowerCase().includes(q)) ||
        (drill.memo && drill.memo.toLowerCase().includes(q)) ||
        (drill.category && drill.category.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });

    drillList.innerHTML = "";

    if (filtered.length === 0) {
      drillList.innerHTML = '<div class="empty-notice">조건에 맞는 레슨/드릴이 없습니다.</div>';
      return;
    }

    filtered.forEach((drill) => {
      const card = document.createElement("div");
      card.className = "item-card";

      card.innerHTML = `
        <div class="item-header">
          <div>
            <span class="item-badge">${drill.category || "일반"}</span>
            <div class="item-main-title">${drill.title}</div>
          </div>
          <div class="card-action-group">
            <button type="button" class="action-text-btn edit-drill-btn" data-id="${drill.id}">수정</button>
            <button type="button" class="action-text-btn delete-drill-btn" data-id="${drill.id}">삭제</button>
          </div>
        </div>
        ${drill.memo ? `<p class="field-label" style="color: #cccccc; margin: 4px 0 6px;">💡 ${drill.memo}</p>` : ""}
        <a href="${drill.url}" target="_blank" rel="noopener noreferrer" class="link-action-btn">▶ Youtube / 레슨 바로가기</a>
      `;

      const editBtn = card.querySelector(".edit-drill-btn");
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          const target = drills.find((d) => d.id === Number(drill.id));
          if (!target) return;

          document.getElementById("drill-category").value = target.category || "";
          document.getElementById("drill-title").value = target.title || "";
          document.getElementById("drill-url").value = target.url || "";
          document.getElementById("drill-memo").value = target.memo || "";

          drillEditIdInput.value = target.id;
          drillFormTitle.textContent = `드릴 수정: ${target.title}`;
          submitDrillBtn.textContent = "수정 내용 저장";
          cancelDrillEditBtn.style.display = "block";
          drillForm.classList.add("show");
          drillForm.scrollIntoView({ behavior: "smooth" });
        });
      }

      const delBtn = card.querySelector(".delete-drill-btn");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          if (confirm(`[${drill.title}] 레슨을 보관함에서 삭제하시겠습니까?`)) {
            const updated = drills.filter((d) => d.id !== Number(drill.id));
            saveDrillsData(updated);
            renderDrillFilterChips();
            renderDrills();
          }
        });
      }

      drillList.appendChild(card);
    });
  }

  if (drillForm) {
    drillForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const editId = drillEditIdInput.value;
      const drills = getDrillsData();

      const newDrill = {
        id: editId ? Number(editId) : Date.now(),
        category: document.getElementById("drill-category").value.trim(),
        title: document.getElementById("drill-title").value.trim(),
        url: document.getElementById("drill-url").value.trim(),
        memo: document.getElementById("drill-memo").value.trim()
      };

      if (editId) {
        const idx = drills.findIndex((d) => d.id === Number(editId));
        if (idx !== -1) drills[idx] = newDrill;
      } else {
        drills.push(newDrill);
      }

      saveDrillsData(drills);
      renderDrillFilterChips();
      renderDrills();
      resetDrillForm();
      drillForm.classList.remove("show");
      alert(editId ? "✅ 드릴 내용이 성공적으로 수정되었습니다!" : "✅ 새로운 드릴이 보관함에 저장되었습니다!");
    });
  }

  renderDrillFilterChips();
  renderDrills();

  // ==========================================
  // [11. 일지 CSV/JSON 백업 및 복원]
  // ==========================================
  const exportCsvBtn = document.getElementById("export-csv-btn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      if (logs.length === 0) {
        alert("내보낼 연습 일지 데이터가 없습니다.");
        return;
      }

      const headers = ["일자", "연습시간(분)", "통증부위", "통증정도", "주요구질", "텐션레벨", "체중이동", "미스샷원인", "One-Thing과제"];
      const rows = logs.map((l) => [
        `"${normalizeDate(l.date)}"`, `"${l.duration || 30}"`, `"${(l.painParts || []).join(';')}"`,
        `"${l.painLevel || 0}"`, `"${l.ballFlight || ''}"`, `"${l.tensionLevel || 3}"`, `"${l.weightTransfer || ''}"`,
        `"${(l.missReasons || []).join(';')}"`, `"${(l.nextAction || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `GolfPractice_Logs_${getTodayString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const exportJsonBtn = document.getElementById("export-json-btn");
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", () => {
      const backupData = {
        exportDate: getTodayString(),
        version: "v1.5",
        practiceLogs: JSON.parse(localStorage.getItem("golf_practice_logs") || "[]"),
        clubs: getClubsData(),
        drills: getDrillsData()
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MyGolfNotes_Backup_${getTodayString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  const importFileInput = document.getElementById("import-file");
  if (importFileInput) {
    importFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.practiceLogs) localStorage.setItem("golf_practice_logs", JSON.stringify(parsed.practiceLogs));
          if (parsed.clubs) localStorage.setItem("golf_my_clubs", JSON.stringify(parsed.clubs));
          if (parsed.drills) localStorage.setItem("golf_drills", JSON.stringify(parsed.drills));

          alert("✅ 전체 데이터가 성공적으로 복원되었습니다!");
          location.reload();
        } catch (err) {
          alert("❌ 올바른 백업 JSON 파일이 아닙니다.");
        }
      };
      reader.readAsText(file);
    });
  }
});

// PWA 서비스 워커 등록
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}