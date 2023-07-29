let data = [];
const endpoint = "https://ht18.github.io/learning_languages/data.json";

async function fetchApi(url) {
  const response = await fetch(url);
  const result = await response.json();
  data = result;
  return result;
}

(async function app() {
  await fetchApi(endpoint);
  const englishData = data.filter((elt) => elt.language === "english");
  const russianData = data.filter((elt) => elt.language === "russian");
  const hebrewData = data.filter((elt) => elt.language === "hebrew");
  const japaneseData = data.filter((elt) => elt.language === "japanese");

  const h1 = document.querySelector("h1");
  let dataList = [];
  let isList = true;
  const wantNote = false;
  let previousNoteOpen;

  const find = document.querySelector(".find");
  const solution = document.getElementById("solution");
  const btnSolution = document.getElementById("btnSolution");
  const btnNext = document.getElementById("btnNext");
  const btnPronunciation = document.getElementById("btnPronunciation");
  const btnEnglish = document.getElementById("btnEnglish");
  const btnRussian = document.getElementById("btnRussian");
  const btnHebrew = document.getElementById("btnHebrew");
  const btnJapanese = document.getElementById("btnJapanese");
  const pronunciationDiv = document.querySelector("#pronunciation");
  const cardDiv = document.querySelector("#cardDiv");
  const listDiv = document.querySelector("#listDiv");
  const btnList = document.querySelector("#btnList");
  const btnCard = document.querySelector("#btnCard");
  const table = document.getElementById("table");
  const findDiv = document.getElementById("findDiv");
  const noteDiv = document.getElementById("noteDiv");
  const prio1 = document.getElementById("prio1");
  const prio2 = document.getElementById("prio2");
  const prio3 = document.getElementById("prio3");
  const prio0 = document.getElementById("prio0");
  const inputLessonId = document.getElementById("inputLessonId");

  btnSolution.addEventListener("click", changeVisibility);
  btnList.addEventListener("click", changeToList);
  btnNext.addEventListener("click", nextData);
  btnPronunciation.addEventListener("click", seePronunciation);
  btnEnglish.addEventListener("click", () => {
    changeLanguage(englishData, "English", "english", "English Words");
  });
  btnRussian.addEventListener("click", () => {
    changeLanguage(russianData, "Русский", "russian", "Russian Words");
  });
  btnHebrew.addEventListener("click", () => {
    changeLanguage(hebrewData, "עִברִית", "hebrew", "Hebrew Words");
  });
  btnJapanese.addEventListener("click", () => {
    changeLanguage(japaneseData, "日本語", "japanese", "Japanese Words");
  });
  btnCard.addEventListener("click", changeToCard);
  prio1.addEventListener("click", changePrio);
  prio2.addEventListener("click", changePrio);
  prio3.addEventListener("click", changePrio);
  prio0.addEventListener("click", changePrio);
  inputLessonId.addEventListener("change", changeLessonId);

  let lessonId;
  let prio;
  let isLesson;

  function changeLessonId(e) {
    lessonId = e.target.value;
    if (isList) {
      changeToList(lessonId, prio, true);
    } else {
      changeTocard();
    }
  }
  function changePrio(e) {
    prio = e.target.value;
    if (isList) {
      changeToList(lessonId, prio, false);
    } else {
      changeTocard();
    }
  }

  function changeToCard() {
    cardDiv.style.display = "inherit";
    listDiv.style.display = "none";
    findDiv.style.visibility = "visible";
    isList = false;
  }

  let sortData = [];

  function changeToList(lessonId, prio, isLesson) {
    isList = true;
    listDiv.style.display = "inherit";
    cardDiv.style.display = "none";
    findDiv.style.visibility = "hidden";
    const rows = document.querySelectorAll("table tr");
    for (row of rows) {
      if (row.id !== "legend") {
        row.remove();
      }
    }

    if (lessonId && isLesson) {
      sortData = dataList.filter((word) => word.lesson_id == lessonId);
    } else if (prio && !isLesson) {
      console.log(prio);
      sortData = dataList.filter((word) => word.priority == prio);
    } else {
      sortData = dataList;
    }
    sortData.forEach((element, index) => {
      const row = table.insertRow(-1);
      const word = row.insertCell(0);
      const pronunciation = row.insertCell(1);
      const translation = row.insertCell(2);
      const note = row.insertCell(3);

      word.innerHTML = element.word;
      row.style.fontSize = "small";
      pronunciation.innerHTML = element.pronunciation;
      pronunciation.style.fontStyle = "italic";
      translation.innerHTML = element.translation;
      note.innerHTML = `<button data-row-id=${index} id="btn_${element.id}" class="btnPlus">+</button>`;
    });

    const btnPlus = getBtnPlus();

    for (let i = 0; i < btnPlus.length; i++) {
      btnPlus[i].addEventListener("click", btnPlusClick);
    }
  }

  function getBtnPlus() {
    const btnPlus = document.querySelectorAll(".btnPlus");
    return btnPlus;
  }

  function changeLanguage(data, language, langu, table) {
    h1.innerHTML = language;
    document.title = language;
    solution.style.visibility = "hidden";
    console.log(data, language, langu);
    dataList = data;
    if (isList) {
      changeToList();
    } else {
      changeToCard();
    }
    distribute(data);
  }

  function btnPlusClick(e) {
    const noteRows = document.querySelectorAll(".noteRow");
    const tr = document.getElementsByTagName("tr");
    const btnId = e.target.id;
    const id = btnId.replace("btn_", "");

    console.log(tr);
    for (let i = 1; i < tr.length; i++) {
      tr[i].style.fontSize = "small";
      tr[i].style.fontWeight = "normal";
    }

    if (noteRows) {
      noteRows.forEach((elt) => elt.remove());
    }

    previousNoteOpen = `note_${id}`;
    const { rowId } = e.target.dataset;
    const rowNote = table.insertRow(parseInt(rowId, 10) + 2);
    rowNote.className = "noteRow";

    const noteDesc = rowNote.insertCell(0);
    noteDesc.colSpan = "4";
    noteDesc.style.fontSize = "small";
    noteDesc.id = `note_${id}`;
    noteDesc.innerHTML = "test note";

    tr[parseInt(rowId, 10) + 1].style.fontWeight = "bold";
    tr[parseInt(rowId, 10) + 1].style.fontSize = "medium";
  }

  function nextData() {
    getRandomData(sortData);
    solution.style.visibility = "hidden";
    pronunciationDiv.style.visibility = "hidden";
    noteDiv.style.visibility = "hidden";
  }

  function seePronunciation() {
    pronunciationDiv.style.visibility = "visible";
  }

  function changeVisibility() {
    solution.style.visibility = "visible";
    noteDiv.style.visibility = "visible";
  }
  function setData(dataArr) {
    data.push(dataArr);
    return data;
  }

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getRandomData(arr) {
    const randomBoolean = Math.random() < 0.5;
    const rndInt = randomIntFromInterval(0, arr.length - 1);
    const { word } = arr[rndInt];
    const { translation } = arr[rndInt];
    const { pronunciation } = arr[rndInt];
    const { note } = arr[rndInt];
    noteDiv.innerHTML = note;
    noteDiv.style.fontSize = "small";
    pronunciationDiv.innerHTML = pronunciation;
    if (randomBoolean === true) {
      find.innerHTML = word;
      solution.innerHTML = translation;
    } else {
      find.innerHTML = translation;
      solution.innerHTML = word;
    }
  }

  function distribute(dataToDistribute) {
    getRandomData(dataToDistribute);
    btnNext.addEventListener("click", getRandomData(dataToDistribute));
  }

  dataList = englishData;
  changeToList();
  getBtnPlus();
})();
