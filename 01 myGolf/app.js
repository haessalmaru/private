document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 0. 미스샷 10대 원인 백과 및 AI 진단 체크포인트 데이터
  // ==========================================
  const MISS_REASONS_PAIR = [
    {
      id: "sway",
      name: "스웨이 & 슬라이드",
      cause: "골반과 흉추의 회전(Turn) 가동성이 부족하거나, 체중 이동을 '몸을 옆으로 밀어내는 것'으로 오해하여 백스윙 시 오른쪽 골반이 우측으로 밀리거나(스웨이), 다운스윙 시 왼쪽 골반이 타깃 쪽으로 과하게 밀려남(슬라이드).",
      result: "스윙 회전축 중심이 흔들려 최저점이 불일치해지며 뒤땅, 탑볼, 심한 푸시 블록 유발.",
      drill: "• 오른발 안쪽 에지 밟기: 백스윙 시 오른발 안쪽에 체중과 압력을 가두고, 오른쪽 고관절을 접어 '우측 엉덩이를 뒤쪽 대각선으로 집어넣는다'는 느낌으로 회전합니다.\n• 얼라인먼트 스틱 드릴: 오른쪽 골반 바깥쪽 지면에 스틱을 수직으로 꽂아두고, 백스윙 회전 시 골반이 스틱에 닿지 않도록 제자리 턴을 연습합니다.",
      aiCheckpoint: "백스윙 탑에서 우측 고관절 힌지 유지 여부 및 다운스윙 전환 시 좌측 골반이 회전 대신 타깃 방향으로 과도하게 슬라이드되는지 여부"
    },
    {
      id: "over_the_top",
      name: "오버 더 탑 (엎어치기)",
      cause: "다운스윙 전환(Transition) 시 하체 지면 반력 및 골반 언로딩이 선행되지 않고, 상체(오른쪽 어깨와 팔)에 힘이 과하게 들어가 클럽을 손으로 끌어내리면서 클럽 샤프트가 스윙 플레인 앞쪽으로 쏟아져 나옴.",
      result: "바깥에서 안으로 깎아 치는 아웃-인(Out-to-In) 궤도가 만들어져 극단적인 슬라이스(페이스 열림 시) 또는 당겨 치는 풀 훅(페이스 닫힘 시) 유발.",
      drill: "• 스플릿 핸드 & 수직 낙하 드릴: 다운스윙 전환 시 상체 회전을 멈춘 상태에서 양팔과 그립 끝이 오른쪽 주머니 쪽으로 먼저 툭 떨어지는(Drop) 감각을 익힙니다.\n• 볼 2개 배치 드릴: 타격할 볼의 우측 상단(대각선 앞)에 볼 한 개를 두고, 바깥쪽 볼을 건드리지 않고 안쪽 볼만 치는 훈련을 통해 샬로잉(Shallowing) 인-아웃 궤도를 유도합니다.",
      aiCheckpoint: "다운스윙 시작 시 하체 리드 선행 여부 및 오른쪽 어깨/팔이 앞으로 덤비며 샤프트가 스윙 플레인 바깥에서 쏟아지는 아웃-인 궤도 발생 여부"
    },
    {
      id: "early_extension",
      name: "얼리 익스텐션 (배치기)",
      cause: "다운스윙 시 골반의 후방 경사(Pelvic Tilt) 및 힌지 유지가 무너지고 하체가 타깃 방향 회전 대신 공 방향(전방)으로 전진하여 척추 각도가 조기에 펴짐.",
      result: "손과 팔이 지나갈 회전 공간이 사라져 손목이 일찍 풀리며 생크(넥 타격), 탑볼, 블록성 푸시, 급격한 악성 풀 훅 유발.",
      drill: "• 엉덩이 벽 대기(Wall Drill): 벽에서 주먹 하나 거리만큼 떨어져 어드레스한 뒤 백스윙 때는 우측 엉덩이가, 다운스윙-임팩트 구간에서는 좌측 엉덩이가 벽에 지속적으로 닿아 있도록 유지하며 스윙합니다.\n• 의식적 포인트: 다운스윙 시작 시 '배를 내미는 것'이 아니라 '왼쪽 엉덩이를 뒤로 밀어내며(Hip Hinge 유지) 공간을 확보한다'고 생각합니다.",
      aiCheckpoint: "임팩트 구간에서 어드레스 시 형성된 척추 각도(Spine Angle) 유지 여부 및 골반이 볼 방향으로 전진하며 손목 공간을 좁히는지 여부"
    },
    {
      id: "casting_scooping",
      name: "캐스팅 & 스쿠핑",
      cause: "볼을 강하게 치려 하거나 공중에 띄우려는 본능적 보상으로, 탑에서 래깅(Lagging)을 유지하지 못하고 손목 코킹을 조기에 풀어버리거나(캐스팅), 임팩트 순간 왼 손목이 손등 쪽으로 꺾이며(스쿠핑) 헤드를 걷어 올림.",
      result: "로프트 각도가 누워 스핀량만 증가하고 비거리가 급감하며, 클럽이 공 앞이 아닌 뒤를 가격하는 뒤땅 및 들어 올리면서 맞는 탑볼 유발.",
      drill: "• 왼 손목 보잉(Bowing) 인지: 임팩트 순간 왼 손목 장갑 로고가 타깃을 향하게 하고 손이 헤드보다 앞서 통과하는 핸드퍼스트(Hand-first) 상태를 유지합니다.\n• 수건 타격 드릴: 볼 뒤쪽 15cm 지점에 얇은 수건을 깔아두고, 수건을 건드리지 않고 공만 먼저 깨끗하게 찍어 치는(Compress) 다운블로 연습을 합니다.",
      aiCheckpoint: "다운스윙 초기에 손목 코킹 래깅(Lagging)이 유지되는지 및 임팩트 순간 핸드퍼스트 타격 대신 왼손목이 꺾여 헤드가 손을 앞지르는 스쿠핑 여부"
    },
    {
      id: "head_up",
      name: "헤드업 & 시선 이탈",
      cause: "볼의 비행 궤적을 눈으로 확인하려는 심리적 조급함, 또는 흉추 회전 유연성이 부족해 몸통을 돌리기 위해 머리와 시선을 함께 타깃 쪽으로 들어 올리는 보상 동작.",
      result: "척추 각도가 세워지며 스윙 최저점이 지면보다 높아져 발생하는 탑볼(Topping) 및 클럽 페이스가 스퀘어로 닫히지 못해 생기는 슬라이스 유발.",
      drill: "• 동전/마킹 응시 드릴: 볼 뒤쪽 2~3cm 지점에 동전을 두거나 볼의 특정 로고/딤플 하나를 정해놓고, 임팩트 순간을 지나 클럽 헤드가 볼을 완전히 통과할 때까지 그 지점을 시선으로 지켜봅니다.\n• 의식적 포인트: '머리를 억지로 고정해 목을 굳히는 것'이 아니라, '턱 밑으로 왼쪽 어깨가 들어오고 오른쪽 어깨가 빠져나갈 때까지 가슴의 시선 각도를 유지한다'고 이해해야 목 부상을 방지할 수 있습니다.",
      aiCheckpoint: "임팩트 순간까지 시선과 머리가 어드레스 축에 안정적으로 머무는지 및 임팩트 직전 시선과 머리가 타깃 방향으로 조기 회전/들리는지 여부"
    },
    {
      id: "reverse_pivot",
      name: "리버스 피벗 (역피봇)",
      cause: "체중을 올바르게 우측으로 실어주지 못하고 머리를 고정하려고만 하다가 백스윙 탑에서 상체 척추가 타깃 쪽으로 꺾이며 체중이 왼발에 남고, 반대로 다운스윙 때 몸이 뒤로 자빠지는 역체중 이동.",
      result: "스윙의 회전 밸런스가 완전히 역전되어 클럽이 지면에 먼저 찍히는 뒤땅, 보상으로 상체를 젖히며 발생하는 탑볼 및 심한 풀 슬라이스 유발.",
      drill: "• 스텝 스윙 드릴: 어드레스 후 백스윙을 시작하면서 오른발을 반 걸음 오른쪽으로 딛고, 다운스윙 시 왼발을 타깃 쪽으로 딛으며 스윙하는 야구 배팅 스윙 훈련.\n• 의식적 포인트: 백스윙 탑에서 흉골(명치)이 오른발 허벅지 안쪽 위에 위치한다는 느낌으로 척추 기울기(Spine Tilt)를 타깃 반대편으로 유지합니다.",
      aiCheckpoint: "백스윙 탑에서 척추 중심축이 타깃 방향으로 꺾여 체중이 왼발에 역으로 실리는지 및 다운스윙 시 오른발로 역이동하는 밸런스 붕괴 여부"
    }
  ];

  const MISS_REASONS_ROW = [
    {
      id: "lunging",
      name: "상체 덤빔",
      cause: "비거리를 내기 위해 몸 전체의 힘을 볼에 실으려 하거나, 다운스윙 시 하체 회전 리드 없이 상체(흉곽과 머리)가 타깃 방향으로 통째로 앞으로 돌진하는 동작.",
      result: "어택 앵글이 지나치게 가팔라져 드라이버의 경우 스카이 샷(뽕샷), 아이언의 경우 과도한 찍힘과 호젤 타격으로 인한 생크 및 슬라이스 유발.",
      drill: "• 머리 뒤에 두고 휘두르기: 임팩트 순간 머리 위치는 어드레스 시점의 공 위치보다 뒤(오른쪽)에 머물러 있어야 한다는 기준점을 잡습니다.\n• 오른발 뒤꿈치 늦게 떼기: 임팩트 직전까지 오른발 뒤꿈치를 지면에 최대한 붙여두고 스윙하여 상체가 전방으로 쏠려 나가는 현상을 제어합니다.",
      aiCheckpoint: "임팩트 시 상체(가슴과 머리)가 볼보다 타깃 쪽으로 앞서 돌진하여 지나치게 가파른 입사각(Steep Angle)을 형성하는지 여부"
    },
    {
      id: "chicken_wing",
      name: "치킨 윙",
      cause: "임팩트 이후 포워드 스윙 구간에서 전완근(Forearm)의 자연스러운 외회전/내회전 릴리스(Supination)가 막히고, 손목이나 그립에 과도한 경직이 생겨 당겨치면서 왼팔꿈치가 등 뒤로 빠짐.",
      result: "클럽 페이스가 직각으로 닫히지 못해 슬라이스가 발생하고, 아크 반경이 줄어들어 임팩트 충격 전달이 안 되어 비거리 손실 극대화.",
      drill: "• 양팔 사이 공 끼우고 스윙: 작은 연습용 볼이나 수건을 양 팔뚝 사이에 끼운 채로 하프스윙을 진행하여, 팔로우스루 구간에서도 팔꿈치 사이 간격이 벌어지지 않도록 강제합니다.\n• 의식적 포인트: 왼팔을 억지로 펴려고 힘을 주기보다, 임팩트 후 왼팔 팔꿈치 안쪽 접히는 면이 하늘을 향하도록 전완을 자연스럽게 롤링(회전)해 줍니다.",
      aiCheckpoint: "임팩트 후 팔로우스루 구간에서 왼팔 전완 롤링 릴리스가 이루어지지 않고 왼팔꿈치가 몸통 뒤쪽으로 구부러져 당겨지는지 여부"
    },
    {
      id: "hanging_back",
      name: "행잉 백",
      cause: "다운스윙 시 지면 반력 이동과 좌측 힙 턴이 일어나지 않고, 공을 높게 띄우려는 의도로 상체와 머리가 오른발 위에 머물며 뒤에 누워버리는 동작.",
      result: "스윙의 최저점이 볼 한참 뒤에 형성되어 발생하는 심한 뒤땅(Fat shot) 및 보상 작용으로 손목을 급격히 덮어버리며 발생하는 악성 풀 훅 유발.",
      drill: "• 스텝 스루(Walk Through) 드릴: 임팩트 후 피니시를 잡을 때 자연스럽게 오른발을 떼어 타깃 방향으로 한 걸음 걸어 나가는 연습을 통해 체중이 왼발로 100% 실리도록 만듭니다.\n• 의식적 포인트: 다운스윙 전환의 첫 트리거를 손이나 어깨가 아닌 '왼발 뒤꿈치로 지면을 밟는 것'으로 시작합니다.",
      aiCheckpoint: "다운스윙부터 임팩트 이후 피니시까지 체중이 왼발로 완전하게 전이되지 못하고 오른발에 남아 뒤로 누워 퍼올리는지 여부"
    },
    {
      id: "flying_elbow",
      name: "플라잉 엘보",
      cause: "백스윙 시 흉추와 어깨 회전이 부족한 상태에서 팔로만 클럽을 더 높이 올리려 하거나, 오른팔 회전근개의 외회전 유연성이 부족해 오른쪽 팔꿈치가 몸통 바깥 등 뒤로 벌어짐.",
      result: "백스윙 탑에서 클럽 샤프트가 타깃 오른쪽을 가리키는 크로스 오버(Cross Over)가 발생하여 다운스윙 시 필연적으로 오버 더 탑(엎어치기)을 유발, 심한 풀/슬라이스 직결.",
      drill: "• 웨이터 쟁반 들기 느낌: 백스윙 탑에서 오른손 바닥이 하늘을 향하고, 오른팔 팔꿈치가 지면을 똑바로 가리키는 형태를 인위적으로 만듭니다.\n• 겨드랑이 헤드커버 끼우기: 오른쪽 겨드랑이에 드라이버 헤드커버나 수건을 끼우고 백스윙 탑까지 떨어뜨리지 않고 유지하는 드릴을 수행합니다.",
      aiCheckpoint: "백스윙 탑에서 오른쪽 팔꿈치가 지면을 향하지 않고 몸통 뒤로 과도하게 벌어져 크로스오버 및 엎어치기 궤도를 형성하는지 여부"
    }
  ];

  const ALL_MISS_MAP = {};
  [...MISS_REASONS_PAIR, ...MISS_REASONS_ROW].forEach(item => {
    ALL_MISS_MAP[item.name] = item;
  });

  // ==========================================
  // 0-1. 날짜 표준화 헬퍼
  // ==========================================
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

  // ==========================================
  // 0-2. 릴리즈 노트 히스토리 데이터 정의
  // ==========================================
  const RELEASE_HISTORY = [
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
        "미스샷 10대 원인별 발생원인/유발미스샷/교정드릴 3단계 정밀 가이드 팝업 탑재",
        "미스샷 원인 영역 상단 2열 + 하단 4열 한 줄 양 끝단 정렬 레이아웃 적용",
        "연습 일자 소급 입력 달력 선택기 신설 (과거 누락 연습 기록 완벽 지원)",
        "누적 분석 상단 요약 카드 인터랙티브 모달: 월간 출석 캘린더, 5대 구질 분포 비율, 허리 부상 추이, 평균 텐션 추이",
        "하단 버전 푸터 탭 시 릴리즈 히스토리 모달 보기 기능 탑재"
      ]
    },
    {
      version: "v1.2",
      title: "최근 3개 복기 과제 리스트 & 드릴 실시간 검색/필터 칩",
      features: [
        "일지 탭 직전 복기 과제를 최근 3개 최신순 역순 나열 리스트로 확장",
        "드릴 보관함 상단 실시간 검색창 및 원클릭 카테고리 필터 칩 바(가로 스크롤) 탑재",
        "드릴 추가 폼에 추천 카테고리 빠른 태그 칩 기능 추가"
      ]
    },
    {
      version: "v1.1",
      title: "연습시간 Stepper, 7대 신체부위 정렬 & 드릴 URL 범용화",
      features: [
        "연습 시간 +/- 10분 단위 Stepper 조절 버튼 추가 (자유로운 시간 기록)",
        "신체 통증 부위를 위에서 아래 순(어깨~발목 7개 부위)으로 골퍼 맞춤 재정비",
        "미스샷 원인에 '스웨이' 항목 추가",
        "클럽 입력 라벨의 불필요한 '차수' 텍스트 제거 및 깔끔한 정리",
        "드릴 영상/블로그 URL 안내 문구 및 'Youtube / 레슨 바로가기' 버튼명 개선"
      ]
    },
    {
      version: "v1.0.1",
      title: "클럽 22필드 피팅 무게 체계 정밀 분리 및 요약/확장 아코디언 UI",
      features: [
        "완제품 총중량(토털 웨이트)과 헤드/샤프트/그립 무게 체계 정밀 분리",
        "클럽 스펙 및 드릴 항목의 [수정(Edit)] 기능 전면 도입",
        "클럽 목록 카드 요약 비교뷰(핵심 9개 스펙) 및 클릭 시 아코디언 상세 확장 뷰 적용",
        "클럽 전용 엑셀 CSV 다운로드 기능 탑재"
      ]
    },
    {
      version: "v1.0.0",
      title: "MyGolfNotes 최초 런칭",
      features: [
        "부상 방지 & 상체 힘빼기 중심의 골프 연습 일지 시스템 구축",
        "클럽 장비 스펙 관리 및 유튜브 레슨 아카이빙 기능 탑재",
        "모바일 최적화 오프라인 지원 PWA (Local Storage 기반)"
      ]
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
    if (!modalOverlay) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add("show");
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("show");
    modalBody.innerHTML = "";
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.showReleaseHistoryModal = function () {
    const historyHtml = RELEASE_HISTORY.map((rel) => `
      <div class="release-card">
        <div class="release-card-header">
          <span class="release-ver-badge">${rel.version}</span>
          <strong class="release-card-title">${rel.title}</strong>
        </div>
        <ul class="release-feature-list">
          ${rel.features.map(f => `<li>${f}</li>`).join("")}
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
  // 3. 날짜 선택 기본값 (오늘 날짜)
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
  // 5. 미스샷 10대 원인 렌더링 (원인/결과/드릴 3단 팝업)
  // ==========================================
  const missReasonContainer = document.getElementById("miss-reason-container");
  const selectedMissReasons = new Set();

  function formatDrillText(rawText) {
    if (!rawText) return "";
    return rawText
      .split("\n")
      .map(line => `<p class="info-desc" style="margin-bottom:4px;">${line}</p>`)
      .join("");
  }

  function createMissTagElement(item, isCompact = false) {
    const chipWrap = document.createElement("div");
    chipWrap.className = `miss-tag-wrap ${isCompact ? 'miss-compact' : ''}`;

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
    infoBtn.title = "원인, 결과 및 교정드릴 보기";
    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(
        `🔍 ${item.name}`,
        `
        <div class="modal-info-box">
          <div class="info-block">
            <span class="info-sub-label">⚠️ 발생 원인</span>
            <p class="info-desc">${item.cause}</p>
          </div>
          <div class="info-block" style="margin-top:10px;">
            <span class="info-sub-label" style="color:#ff8a80;">🚨 유발 미스샷</span>
            <p class="info-desc" style="color:#ffd1d1;">${item.result}</p>
          </div>
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
      document.getElementById("modal-select-this-btn").addEventListener("click", () => {
        selectedMissReasons.add(item.name);
        renderMissReasonChips();
        closeModal();
      });
    });

    chipWrap.appendChild(btn);
    chipWrap.appendChild(infoBtn);
    return chipWrap;
  }

  function renderMissReasonChips() {
    if (!missReasonContainer) return;
    missReasonContainer.innerHTML = "";

    // 1. 상단 2열 그리드 (6개)
    const pairGrid = document.createElement("div");
    pairGrid.className = "miss-grid-pair";
    MISS_REASONS_PAIR.forEach((item) => {
      pairGrid.appendChild(createMissTagElement(item, false));
    });
    missReasonContainer.appendChild(pairGrid);

    // 2. 하단 4열 한 줄 그리드 (4개)
    const quadGrid = document.createElement("div");
    quadGrid.className = "miss-grid-quad";
    MISS_REASONS_ROW.forEach((item) => {
      quadGrid.appendChild(createMissTagElement(item, true));
    });
    missReasonContainer.appendChild(quadGrid);
  }

  renderMissReasonChips();

  // ==========================================
  // 5-1. 모듈형 AI 스윙 분석 질문 생성기 (알고리즘)
  // ==========================================
  function assembleAiPrompt(selectedNames) {
    const namesArray = Array.from(selectedNames);
    const count = namesArray.length;

    let prompt = `골프 스윙 영상을 첨부합니다. 오늘 연습 세션에서 [${namesArray.join(", ")}] 문제가 집중 발생했습니다.\n`;
    prompt += `첨부된 영상의 프레임별(어드레스, 백스윙 탑, 다운스윙 전환, 임팩트, 팔로우스루) 움직임을 바탕으로 아래 항목들을 전문 교습가 관점에서 정밀 진단해 주세요.\n\n`;

    prompt += `1. 주요 결함 집중 체크포인트:\n`;
    namesArray.forEach((name, idx) => {
      const item = ALL_MISS_MAP[name];
      const checkpoint = item ? item.aiCheckpoint : name;
      prompt += `   (${String.fromCharCode(97 + idx)}) [${name}]: ${checkpoint}\n`;
    });

    if (count > 1) {
      prompt += `\n2. 결함 간 인과관계(보상 동작) 분석:\n`;
      prompt += `   - 위 결함들이 개별적인 실수인지, 아니면 선행 결함(예: 테이크백/탑 단계)으로 인해 다운스윙 시 불가피하게 나타난 연쇄 보상 동작(Compensatory Movement)인지 명확히 짚어주세요.\n`;
      prompt += `\n3. 최우선 교정 처방 (1순위 One-Thing):\n`;
      prompt += `   - 현재 여러 문제가 복합된 상태입니다. 가장 먼저 고쳐야 다른 문제들이 자연스럽게 해결될 '단 1가지 핵심 신체 느낌(Feel)'과 즉각 적용 가능한 추천 드릴 1개를 제시해 주세요.`;
    } else {
      prompt += `\n2. 근본 발생 원인 및 타점 분석:\n`;
      prompt += `   - 해당 결함이 발생할 때 클럽 헤드의 스윙 궤도와 최저점 타점(뒤땅/탑볼/페이스 열림 등)에 미치는 결정적 원인을 분석해 주세요.\n`;
      prompt += `\n3. 즉각적인 해결책 (One-Thing 큐):\n`;
      prompt += `   - 타석에서 바로 다음 샷에 적용할 수 있는 직관적인 신체 감각 큐(Feel Cue)와 핵심 교정 드릴 1개를 알려주세요.`;
    }

    return prompt;
  }

  // ==========================================
  // 5-2. 범용 AI 질문 생성 모달 (Gemini/ChatGPT/공유하기 지원)
  // ==========================================
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
            💡 <strong>사용 팁:</strong> 생성된 질문을 복사한 뒤, <strong>자주 쓰시는 AI(ChatGPT, Gemini, Claude 등)</strong>에 스윙 영상과 함께 붙여넣기(Ctrl+V) 하세요!
          </div>

          <textarea id="ai-prompt-textarea" class="ai-prompt-textarea" rows="8">${promptText}</textarea>
          
          <!-- 메인 액션 1: 클립보드 복사 (모든 사용자 공통) -->
          <button type="button" id="copy-main-btn" class="submit-btn" style="margin: 10px 0 6px; background: #2e7d32;">
            📄 질문 복사 (클립보드 저장)
          </button>

          <!-- 서브 액션 2: 빠른 AI 바로가기 분기 -->
          <div class="ai-fast-actions-grid">
            <button type="button" id="open-chatgpt-btn" class="ai-service-btn btn-chatgpt">
              🟢 ChatGPT 열기
            </button>
            <button type="button" id="open-gemini-btn" class="ai-service-btn btn-gemini">
              ✨ Gemini 열기
            </button>
          </div>

          <!-- 서브 액션 3: 스마트폰 시스템 공유하기 (카톡, 메모장, 설치된 AI 앱) -->
          <button type="button" id="share-prompt-btn" class="backup-btn" style="background:#263238; color:#90caf9; border:1px solid #37474f; width:100%; margin-top:6px; font-weight:600; padding:10px;">
            📤 다른 앱으로 공유하기 (카톡 / 메모장 등)
          </button>
        </div>
      `
      );

      const textarea = document.getElementById("ai-prompt-textarea");
      const copyMainBtn = document.getElementById("copy-main-btn");
      const openChatgptBtn = document.getElementById("open-chatgpt-btn");
      const openGeminiBtn = document.getElementById("open-gemini-btn");
      const sharePromptBtn = document.getElementById("share-prompt-btn");

      // 클립보드 복사 함수
      const copyToClipboard = () => {
        if (!textarea) return;
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textarea.value);
        } else {
          document.execCommand("copy");
        }
      };

      // 1) 메인 복사
      if (copyMainBtn) {
        copyMainBtn.addEventListener("click", () => {
          copyToClipboard();
          alert("✅ 질문이 클립보드에 복사되었습니다!\n사용하시는 AI 앱이나 메신저에 붙여넣기(Ctrl+V) 하세요.");
        });
      }

      // 2) ChatGPT 바로가기
      if (openChatgptBtn) {
        openChatgptBtn.addEventListener("click", () => {
          copyToClipboard();
          alert("✅ 질문이 복사되었습니다!\nChatGPT 화면에서 스윙 영상과 함께 붙여넣기 하세요.");
          window.open("https://chatgpt.com", "_blank");
          closeModal();
        });
      }

      // 3) Gemini 바로가기
      if (openGeminiBtn) {
        openGeminiBtn.addEventListener("click", () => {
          copyToClipboard();
          alert("✅ 질문이 복사되었습니다!\nGemini 화면에서 스윙 영상과 함께 붙여넣기 하세요.");
          window.open("https://gemini.google.com", "_blank");
          closeModal();
        });
      }

      // 4) 시스템 공유하기
      if (sharePromptBtn) {
        sharePromptBtn.addEventListener("click", async () => {
          const text = textarea ? textarea.value : "";
          if (navigator.share) {
            try {
              await navigator.share({
                title: "MyGolfNotes 스윙 분석 질문",
                text: text
              });
            } catch (err) {
              // 공유 취소 시 무시
            }
          } else {
            copyToClipboard();
            alert("공유하기를 지원하지 않는 브라우저입니다. 대신 질문이 클립보드에 복사되었습니다!");
          }
        });
      }
    });
  }

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
  // 6. 통계 요약 및 직전 연습 복기 로직
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
        prevActionDisplay.innerHTML =
          '<div class="highlight-text">아직 이전 기록이 없습니다. 힘빼고 가볍게 스윙을 시작하세요!</div>';
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
    const drawRate = Math.round((drawCount / totalCount) * 100);
    document.getElementById("sum-draw-rate").textContent = `${drawRate}%`;

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

    const totalTension = logs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgTension = (totalTension / totalCount).toFixed(1);
    document.getElementById("sum-avg-tension").textContent = `${avgTension} / 5.0`;

    const monthTension = monthLogs.reduce((acc, cur) => acc + Number(cur.tensionLevel || 3), 0);
    const avgMonthTension = monthCount > 0 ? (monthTension / monthCount).toFixed(1) : "-";
    const tensionMonthSubEl = document.getElementById("sum-tension-month-sub");
    if (tensionMonthSubEl) {
      tensionMonthSubEl.textContent = `당월 평균 ${avgMonthTension}`;
    }

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
  // 7. 상단 요약 카드 클릭 시 세부 통계 모달
  // ==========================================
  const triggerCalendarModal = document.getElementById("trigger-calendar-modal");
  if (triggerCalendarModal) {
    triggerCalendarModal.addEventListener("click", () => {
      const logs = JSON.parse(localStorage.getItem("golf_practice_logs") || "[]");
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();

      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      const practicedMap = {};
      logs.forEach((l) => {
        const normDate = normalizeDate(l.date);
        if (normDate) {
          practicedMap[normDate] = (practicedMap[normDate] || 0) + Number(l.duration || 30);
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
            <span style="color:#81c784; font-weight:bold;">● 초록 표시: 연습 완료일</span><br>
            <span>💡 날짜를 터치하면 해당 일자로 즉시 연습 일지를 입력할 수 있습니다.</span>
          </div>
        </div>
      `
      );

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
  // 8. 연습 일지 저장
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

      alert(`✅ [${selectedDate}] 연습 일지(${currentDuration}분)가 안전하게 저장되었습니다!`);
      document.getElementById("next-action-input").value = "";
      selectedMissReasons.clear();
      renderMissReasonChips();
      updateSummaryAndPrevAction();
    });
  }

  // ==========================================
  // 9. 일지 CSV & 전체 백업/복원
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
        `"${normalizeDate(l.date)}"`,
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
  // 11. 드릴 & 레슨 관리 모듈
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
      .then(() => console.log("PWA ServiceWorker Ready (v1.4)"))
      .catch((err) => console.log("PWA ServiceWorker Failed:", err));
  });
}