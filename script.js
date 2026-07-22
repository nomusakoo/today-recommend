const DATA = {
  activity: {
    tag: "할 일",
    items: [
      { emoji: "🚶", text: "근처 공원 한 바퀴 산책하기" },
      { emoji: "☕", text: "안 가본 카페 찾아가기" },
      { emoji: "🧹", text: "미뤄뒀던 방 정리하기" },
      { emoji: "📖", text: "읽고 싶었던 책 한 챕터 읽기" },
      { emoji: "💻", text: "온라인 클래스 하나 들어보기" },
      { emoji: "📞", text: "오랜만에 친구에게 연락하기" },
      { emoji: "🚴", text: "자전거로 동네 한 바퀴 돌기" },
      { emoji: "😴", text: "낮잠 30분 자기" },
      { emoji: "🎵", text: "새로운 플레이리스트 만들기" },
      { emoji: "✍️", text: "손편지 써보기" },
      { emoji: "🖼️", text: "근처 전시회나 팝업스토어 가보기" },
      { emoji: "🧘", text: "스트레칭 15분 하기" },
      { emoji: "📸", text: "사진첩 정리하기" },
      { emoji: "🍳", text: "새로운 레시피에 도전하기" },
      { emoji: "🪴", text: "화분에 물 주고 창문 열기" },
      { emoji: "🗂️", text: "서랍 하나 비우기" },
    ],
  },
  food: {
    tag: "음식",
    items: [
      { emoji: "🍜", text: "얼큰한 짬뽕" },
      { emoji: "🍱", text: "든든한 돈까스" },
      { emoji: "🌶️", text: "매콤한 떡볶이" },
      { emoji: "🍝", text: "고소한 파스타" },
      { emoji: "🍲", text: "얼큰한 순두부찌개" },
      { emoji: "🍚", text: "든든한 국밥" },
      { emoji: "🍗", text: "바삭한 치킨" },
      { emoji: "🍣", text: "신선한 초밥" },
      { emoji: "🍲", text: "향긋한 쌀국수" },
      { emoji: "🔥", text: "얼얼한 마라탕" },
      { emoji: "🥘", text: "든든한 제육볶음" },
      { emoji: "🍜", text: "시원한 냉면" },
      { emoji: "🍖", text: "달콤짭짤한 떡갈비" },
      { emoji: "🥘", text: "얼큰한 김치찌개" },
      { emoji: "🥓", text: "고소한 삼겹살" },
      { emoji: "🍲", text: "새콤달콤한 부대찌개" },
    ],
  },
  movie: {
    tag: "영화/컨텐츠",
    items: [
      { emoji: "🎨", text: "마음 편해지는 힐링 애니메이션" },
      { emoji: "😱", text: "손에 땀을 쥐게 하는 스릴러" },
      { emoji: "💔", text: "눈물 버튼 로맨스 영화" },
      { emoji: "🕵️", text: "두뇌 풀가동 미스터리물" },
      { emoji: "💥", text: "킬링타임 액션 블록버스터" },
      { emoji: "🎬", text: "잔잔한 인생 다큐멘터리" },
      { emoji: "😂", text: "웃음 터지는 코미디" },
      { emoji: "🔫", text: "몰입감 최고의 범죄 느와르" },
      { emoji: "🚀", text: "상상력을 자극하는 SF" },
      { emoji: "🎶", text: "감성 충전 음악 영화" },
      { emoji: "📺", text: "정주행각인 드라마 시리즈" },
      { emoji: "🏆", text: "밤새 볼만한 서바이벌 예능" },
    ],
  },
};

let currentCategory = "all";
let lastPick = null;

const tabs = document.getElementById("tabs");
const card = document.getElementById("card");
const cardEmoji = document.getElementById("cardEmoji");
const cardText = document.getElementById("cardText");
const cardTag = document.getElementById("cardTag");
const drawBtn = document.getElementById("drawBtn");

function poolFor(category) {
  if (category === "all") {
    return Object.values(DATA).flatMap((group) =>
      group.items.map((item) => ({ ...item, tag: group.tag }))
    );
  }
  return DATA[category].items.map((item) => ({ ...item, tag: DATA[category].tag }));
}

function draw() {
  const pool = poolFor(currentCategory);
  let pick = pool[Math.floor(Math.random() * pool.length)];

  if (pool.length > 1 && lastPick && pick.text === lastPick.text) {
    pick = pool[(pool.indexOf(pick) + 1) % pool.length];
  }
  lastPick = pick;

  cardEmoji.textContent = pick.emoji;
  cardText.textContent = pick.text;
  cardTag.textContent = pick.tag;

  card.classList.remove("pop");
  void card.offsetWidth;
  card.classList.add("pop");
  reportHeight();
}

function activateTab(tablist, btn) {
  tablist.querySelectorAll('[role="tab"]').forEach((t) => {
    const isActive = t === btn;
    t.classList.toggle("active", isActive);
    t.setAttribute("aria-selected", String(isActive));
    t.tabIndex = isActive ? 0 : -1;
  });
  btn.focus();
}

function setupTabKeyboardNav(tablist, onActivate) {
  tablist.addEventListener("click", (e) => {
    const btn = e.target.closest('[role="tab"]');
    if (!btn) return;
    activateTab(tablist, btn);
    onActivate(btn);
  });

  tablist.addEventListener("keydown", (e) => {
    const tabEls = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const currentIndex = tabEls.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabEls.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabEls.length) % tabEls.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabEls.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextBtn = tabEls[nextIndex];
      activateTab(tablist, nextBtn);
      onActivate(nextBtn);
    }
  });
}

setupTabKeyboardNav(tabs, (btn) => {
  currentCategory = btn.dataset.category;
  lastPick = null;
});

drawBtn.addEventListener("click", draw);

// ---- 메인 탭 전환 (랜덤 추천 / 서울 행사) ----

const mainTabs = document.getElementById("mainTabs");
const randomView = document.getElementById("randomView");
const seoulView = document.getElementById("seoulView");

setupTabKeyboardNav(mainTabs, (btn) => {
  const view = btn.dataset.view;
  randomView.classList.toggle("active", view === "random");
  seoulView.classList.toggle("active", view === "seoul");

  if (view === "seoul") {
    loadSeoulEvents();
  }
  reportHeight();
});

// ---- 서울시 문화행사 정보 (data.seoul.go.kr) ----

const guSelect = document.getElementById("guSelect");
const eventList = document.getElementById("eventList");
const eventStatus = document.getElementById("eventStatus");
const srStatus = document.getElementById("srStatus");
const updatedAtEl = document.getElementById("updatedAt");
const seoulMap = document.getElementById("seoulMap");
const mapWrap = document.getElementById("mapWrap");

const SVG_NS = "http://www.w3.org/2000/svg";

let seoulEvents = null;

function renderSkeleton(count = 6) {
  eventStatus.hidden = true;
  mapWrap.classList.add("is-loading");
  eventList.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "event-card skeleton-card";
    sk.setAttribute("aria-hidden", "true");
    eventList.appendChild(sk);
  }
  srStatus.textContent = "행사 정보를 불러오는 중입니다.";
}

async function loadSeoulEvents() {
  if (seoulEvents) return;

  renderSkeleton();

  try {
    const res = await fetch("data/events.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    seoulEvents = data.items || [];

    const guList = Object.keys(SEOUL_DISTRICTS.paths).sort();
    guList.forEach((gu) => {
      const opt = document.createElement("option");
      opt.value = gu;
      opt.textContent = gu;
      guSelect.appendChild(opt);
    });

    if (data.updatedAt) {
      const d = new Date(data.updatedAt);
      updatedAtEl.textContent = `${d.toLocaleString("ko-KR")} 기준 · 매일 자동 업데이트`;
    }

    mapWrap.classList.remove("is-loading");
    renderMap();
    renderEvents();
  } catch (err) {
    mapWrap.classList.remove("is-loading");
    eventList.innerHTML = "";
    eventStatus.textContent = "행사 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.";
    eventStatus.hidden = false;
    srStatus.textContent = "행사 정보를 불러오지 못했습니다.";
    reportHeight();
  }
}

function colorForCount(count) {
  if (!count) return "#f2eee9";
  if (count <= 2) return "#f2c9a4";
  if (count <= 5) return "#e2895a";
  return "#c0532a";
}

function shortGuName(gu) {
  return gu.endsWith("구") ? gu.slice(0, -1) : gu;
}

function renderMap() {
  const counts = {};
  seoulEvents.forEach((e) => {
    if (e.gu) counts[e.gu] = (counts[e.gu] || 0) + 1;
  });

  seoulMap.innerHTML = "";
  seoulMap.setAttribute("viewBox", `0 0 ${SEOUL_DISTRICTS.width} ${SEOUL_DISTRICTS.height}`);

  const pathGroup = document.createElementNS(SVG_NS, "g");
  const labelGroup = document.createElementNS(SVG_NS, "g");
  labelGroup.setAttribute("class", "gu-labels");

  Object.entries(SEOUL_DISTRICTS.paths).forEach(([gu, d]) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "gu-path");
    path.setAttribute("data-gu", gu);
    path.setAttribute("fill", colorForCount(counts[gu]));
    path.setAttribute("role", "button");
    path.setAttribute("tabindex", "0");
    path.setAttribute("aria-label", `${gu}, 행사 ${counts[gu] || 0}건`);
    path.setAttribute("aria-pressed", "false");

    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = `${gu} (${counts[gu] || 0}건)`;
    path.appendChild(title);

    path.addEventListener("click", () => selectGu(gu));
    path.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        selectGu(gu);
      }
    });
    pathGroup.appendChild(path);

    const [cx, cy] = SEOUL_DISTRICTS.centroids[gu];
    const label = document.createElementNS(SVG_NS, "text");
    label.setAttribute("class", "gu-label");
    label.setAttribute("data-gu", gu);
    label.setAttribute("x", cx);
    label.setAttribute("y", cy);
    label.textContent = shortGuName(gu);
    label.style.pointerEvents = "none";
    labelGroup.appendChild(label);
  });

  seoulMap.appendChild(pathGroup);
  seoulMap.appendChild(labelGroup);

  syncMapSelection();
}

function syncMapSelection() {
  const selected = guSelect.value;
  const hasSelection = selected !== "all";

  seoulMap.querySelectorAll(".gu-path").forEach((path) => {
    const isSelected = hasSelection && path.dataset.gu === selected;
    path.classList.toggle("selected", isSelected);
    path.classList.toggle("dimmed", hasSelection && !isSelected);
    path.setAttribute("aria-pressed", String(isSelected));
    if (isSelected) path.parentNode.appendChild(path);
  });

  seoulMap.querySelectorAll(".gu-label").forEach((label) => {
    const isSelected = hasSelection && label.dataset.gu === selected;
    label.classList.toggle("selected", isSelected);
    label.classList.toggle("dimmed", hasSelection && !isSelected);
    if (isSelected) label.parentNode.appendChild(label);
  });
}

function selectGu(gu) {
  guSelect.value = guSelect.value === gu ? "all" : gu;
  syncMapSelection();
  renderEvents();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderEvents() {
  const selectedGu = guSelect.value;
  const filtered =
    selectedGu === "all" ? seoulEvents : seoulEvents.filter((e) => e.gu === selectedGu);

  eventList.innerHTML = "";

  if (filtered.length === 0) {
    const status = document.createElement("p");
    status.className = "event-status";
    status.textContent = "진행 중인 행사가 없어요.";
    eventList.appendChild(status);
    srStatus.textContent = "진행 중인 행사가 없습니다.";
    reportHeight();
    return;
  }

  srStatus.textContent = `행사 ${filtered.length}건을 찾았습니다.`;

  filtered.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";

    const period =
      event.startDate === event.endDate
        ? event.startDate
        : `${event.startDate} ~ ${event.endDate}`;

    const safeLink = /^https?:\/\//i.test(event.link || "") ? event.link : "";

    card.innerHTML = `
      <div class="event-card-top">
        <span class="event-badge ${event.isFree ? "free" : ""}">${event.isFree ? "무료" : "유료"}</span>
        <span class="event-gu">${escapeHtml(event.gu)} · ${escapeHtml(event.category)}</span>
      </div>
      <p class="event-title">${escapeHtml(event.title)}</p>
      <p class="event-meta">${escapeHtml(event.place)} · ${escapeHtml(period)}</p>
      ${safeLink ? `<a class="event-link" href="${escapeHtml(safeLink)}" target="_blank" rel="noopener noreferrer">자세히 보기</a>` : ""}
    `;
    eventList.appendChild(card);
  });

  reportHeight();
}

guSelect.addEventListener("change", () => {
  syncMapSelection();
  renderEvents();
});

loadSeoulEvents();

// ---- 블로거 등 iframe에 삽입됐을 때, 부모 창에 실제 콘텐츠 높이 전달 ----

function reportHeight() {
  if (window.parent === window) return;
  window.parent.postMessage(
    { type: "today-recommend-resize", height: document.body.scrollHeight },
    "*"
  );
}

if (window.ResizeObserver) {
  new ResizeObserver(reportHeight).observe(document.body);
}
window.addEventListener("load", reportHeight);
window.addEventListener("resize", reportHeight);
[100, 500, 1500].forEach((delay) => setTimeout(reportHeight, delay));
