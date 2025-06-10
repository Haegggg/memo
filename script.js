let dragging = false;
let dragJustFinished = false;
let currentOpenPaper = null;

function addPapers(paperList = papers) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const isMobile = window.innerWidth <= 600;

// 1. tempPaper를 body에 붙여서 실제 크기 측정
  const tempPaper = document.createElement('div');
  tempPaper.className = 'paper';
  tempPaper.style.visibility = 'hidden';
  tempPaper.style.position = 'absolute';
  tempPaper.innerHTML = `<div class="dateAndtitle">테스트</div><p>테스트</p>`;
  container.appendChild(tempPaper); // 반드시 container에 붙여!
  const paperWidth = tempPaper.offsetWidth;
  const paperHeight = tempPaper.offsetHeight;
  container.removeChild(tempPaper);


// 2. container 기준 랜덤 좌표 범위
  //const sidebarWidth = 110; // ← 실제 sidebar의 width
const minX = 0;
const minY = 0;
const maxX = container.offsetWidth - paperWidth;
const maxY = container.offsetHeight - paperHeight;
//각 메모 생성 때 
const randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
const randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;



// 3. forEach로 메모 반복 생성
  paperList.forEach((entry, index) => {
    const paper = document.createElement("div");
    paper.classList.add("paper");

// 각도 랜덤
    // 랜덤 각도 (ex: -15도~15도)
    const randomRotation = (Math.random() * 30 - 15).toFixed(2);
    paper.dataset.rotate = randomRotation;
    paper.style.transform = `rotate(${randomRotation}deg)`;


// 랜덤 좌표 할당 (container 기준)
    const randX = Math.floor(Math.random() * (maxX + 1));
    const randY = Math.floor(Math.random() * (maxY + 1));
    paper.style.position = "absolute";
    paper.style.left = `${randX}px`;
    paper.style.top = `${randY}px`;

    let textClass = entry.release === "no" ? "unreleased" : "";
    paper.innerHTML = `<div class="dateAndtitle">${entry.date}   &nbsp;&nbsp;&nbsp;&nbsp;${entry.title}</div>
    <p class="${textClass}">${entry.text}</p>`;

// 이하 기존 이벤트, append 등 동일
    paper.classList.add("releasedPaper");
    const paperKey = `${entry.date}-${entry.title}`;
    paper.dataset.key = paperKey;
    paper.addEventListener("click", () => {
      if (dragJustFinished) {
        dragJustFinished = false;
        return;
      }
      if (dragging) return;
      const clickedKey = paper.dataset.key;
      if (currentOpenPaper === clickedKey) {
        closeModal();
        currentOpenPaper = null;
      } else {
        const formattedText = entry.text.replace(/\n/g, "<br>");
        openModal(entry.date, entry.title, formattedText);
        currentOpenPaper = clickedKey;
      }
    });
// 마우스 오버 효과 parsFloat가 각도. 모바일과 데스크톱 순
  paper.addEventListener("mouseover", () => {
  if (dragging) return;
  paper.style.cursor = "pointer";
  const hoverRotation = (
    parseFloat(paper.dataset.rotate) - (isMobile ? 1 : 3)
  ).toFixed(2);
  paper.style.transform = `rotate(${hoverRotation}deg)`;
});
paper.addEventListener("mouseleave", () => {
  if (dragging) return;
  paper.style.transform = `rotate(${paper.dataset.rotate}deg)`;
});

    container.appendChild(paper);
  });
}



function showAll() {
  addPapers(papers);
}
function openModal(date, title, text) {
  document.getElementById("modal-date").innerText = date;
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-text").innerHTML = text;
  document.getElementById("modal-overlay").style.display = "block";
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("modal").style.display = "none";
  currentOpenPaper = null;
}
function filterByCategory(category) {
  const filtered = papers.filter(p => p.category === category);
  addPapers(filtered);
}

//마우스로 메모 드래그
interact('.paper').draggable({
  inertia: false,
  listeners: {
    start(event) {
      dragging = true;
    },
    move(event) {
      const target = event.target;
      let left = parseFloat(target.style.left) || 0;
      let top = parseFloat(target.style.top) || 0;
      left += event.dx;
      top += event.dy;
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
      target.style.transform = `rotate(${target.dataset.rotate || "0"}deg)`;
    },
    end(event) {
      dragging = false;
      dragJustFinished = true;

    }
  }
});


//모달 클릭시 닫기 추가
document.getElementById("modal").addEventListener("click", closeModal);


// 배경 클릭 시 닫기
document.getElementById("modal-overlay").addEventListener("click", closeModal);

// 페이지 로드 시 실행
window.onload = () => addPapers(papers);
