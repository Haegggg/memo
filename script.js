let currentOpenPaper = null;

function addPapers(paperList = papers) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  let totalHeight = 0;
  const isMobile = window.innerWidth <= 600;

paperList.forEach((entry, index) => {

    console.log(entry); // ✅ 이거 추가해서 확인해보세요
    const paper = document.createElement("div");
    paper.classList.add("paper");
  

    // 각도 제한
    const maxRotation = isMobile ? -8 : -40;
    const minRotation = isMobile ? 8 : 0;
    let randomRotation = (
      Math.random() * (minRotation - maxRotation) + maxRotation
    ).toFixed(2);

    // 수직 간격 + 랜덤 흩어짐
    let bottomPosition = totalHeight + 50;
    bottomPosition += Math.floor(Math.random() * 30) - 15;
    totalHeight += 100;

    paper.style.setProperty("--rotation", `${randomRotation}deg`);
    paper.style.transform = `translateX(-50%) rotate(${randomRotation}deg)`;
    paper.style.bottom = `${bottomPosition}px`;
    paper.style.zIndex = index;

    let textClass = entry.release === "no" ? "unreleased" : "";
    paper.innerHTML = `<div class="dateAndtitle">${entry.date}   &nbsp;&nbsp;&nbsp;&nbsp;${entry.title}</div>
    <p class="${textClass}">${entry.text}</p>`;

        // ✅ 여기부터 key 설정 + 클릭 이벤트
    paper.classList.add("releasedPaper");

    // key 설정
    const paperKey = `${entry.date}-${entry.title}`;
    paper.dataset.key = paperKey;
    
    // 클릭 시 열고/닫기
    paper.addEventListener("click", () => {
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

    // 마우스 효과
    paper.addEventListener("mouseover", () => {
      paper.style.cursor = "pointer";
      const hoverRotation = (
        parseFloat(randomRotation) - (isMobile ? 1 : 3)
      ).toFixed(2);
      paper.style.transform = `translateX(-50%) rotate(${hoverRotation}deg)`;
    });

    paper.addEventListener("mouseleave", () => {
      paper.style.transform = `translateX(-50%) rotate(${randomRotation}deg)`;
    });

    container.appendChild(paper);

  });

  container.style.height = `${totalHeight + 50}px`;
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



// 배경 클릭 시 닫기
document.getElementById("modal-overlay").addEventListener("click", closeModal);

// 페이지 로드 시 실행
window.onload = addPapers;
