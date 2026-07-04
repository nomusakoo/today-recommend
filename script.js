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
}

tabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;

  tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = btn.dataset.category;
  lastPick = null;
});

drawBtn.addEventListener("click", draw);
