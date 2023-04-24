const url = "https://hp-api.onrender.com/api/characters";

async function getHPData() {
  const response = await fetch(url);
  const data = await response.json();
  const hasImg = data.filter((img) => img.image);
  characterAttributes(hasImg);
}

function characterAttributes(data) {
  data.forEach((character, index) => {
    const id = character.id;
    const name = character.name;
    const house = character.house;
    const ancestry = character.ancestry;
    const staff = character.hogwartsStaff === true ? "Staff" : "Student";
    const image = character.image;
    createPortfolio(id, name, house, ancestry, staff, image, index);
  });
  favsCount();
}

function createPortfolio(id, name, house, ancestry, staff, image, index) {
  const portMain = document.getElementById("main");
  const portFavs = document.getElementById("favs");
  const portCard = document.createElement("div");
  const lsFavoritesData = localStorage.getItem("favorites");

  portCard.classList.add("portfolio-card");
  portCard.setAttribute("id", name.replace(/ +/g, ""));
  portCard.dataset.house = house.toLowerCase();
  portCard.dataset.open = `${house}-${index}`;

  const collection =
    lsFavoritesData != null && lsFavoritesData.includes(portCard.id)
      ? portFavs
      : portMain;

  collection.appendChild(portCard);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  portCard.appendChild(cardBody);

  const imgTag = document.createElement("img");
  imgTag.src = image;
  imgTag.alt = `${name} image`;

  cardBody.appendChild(imgTag);

  const popUpBox = document.createElement("div");
  popUpBox.className = "card-popup-box";

  cardBody.appendChild(popUpBox);
  const divFavorite = document.createElement("div");
  divFavorite.className = "favorite-icon";
  const iFavorite = document.createElement("i");

  collection === portMain
    ? (iFavorite.className = "fa-regular fa-heart heart-icon")
    : (iFavorite.className = "fa-solid fa-heart heart-icon");

  const divHouse = document.createElement("div");
  divHouse.innerHTML = house;
  const divAncestry = document.createElement("div");
  divAncestry.innerHTML = ancestry;
  const divStaff = document.createElement("div");
  divStaff.innerHTML = staff;
  const charName = document.createElement("h3");
  charName.innerHTML = name;
  popUpBox.appendChild(divFavorite);
  popUpBox.appendChild(divHouse);
  popUpBox.appendChild(divAncestry);
  popUpBox.appendChild(divStaff);
  popUpBox.appendChild(charName);
  divFavorite.append(iFavorite);
}

function sortData(direction) {
  const mainContainer = document.getElementById("main");
  const mainPortCards = mainContainer.querySelectorAll(".portfolio-card");
  const mainItemArr = Array.from(mainPortCards);

  const favsContainer = document.getElementById("favs");
  const favsPortCards = favsContainer.querySelectorAll(".portfolio-card");
  const favsItemArr = Array.from(favsPortCards);

  const sortCB = (a, b) => {
    if (a.id > b.id) return direction === "asc" ? 1 : -1;
    else if (a.id < b.id) return direction === "asc" ? -1 : 1;
    else return 0;
  };

  mainItemArr.sort(sortCB);
  favsItemArr.sort(sortCB);

  mainItemArr.forEach((item) => {
    mainContainer.append(item);
  });
  favsItemArr.forEach((item) => {
    favsContainer.append(item);
  });
}

function LocalStorageUpdate(storageData, card) {
  if (storageData.includes(card.id)) {
    const storageArr = localStorage.getItem("favorites").split(",");
    storageArr.splice(storageArr.indexOf(card.id), 1).join(",");

    localStorage.setItem("favorites", storageArr);
  } else {
    storageData === ""
      ? (storageData += `${card.id}`)
      : (storageData += `,${card.id}`);
    localStorage.setItem("favorites", storageData);
  }
}

function updateCollections(target, direction) {
  const heart = target.querySelector(".heart-icon");
  const outline = "fa-regular";
  const solid = "fa-solid";

  const card = target.parentElement.parentElement.id;

  const targetCard = document.getElementById(`${card}`);

  const newCollection = direction === "toMain" ? main : favs;

  direction === "toMain"
    ? (heart.classList.remove(solid), heart.classList.add(outline))
    : (heart.classList.remove(outline), heart.classList.add(solid));

  newCollection.appendChild(targetCard);
}

function favsCount() {
  const favs = document.getElementById("favs");
  const favCards = favs.querySelectorAll(".portfolio-card");
  const gryfItem = document.getElementById("gryffindor");
  const huffItem = document.getElementById("hufflepuff");
  const raveItem = document.getElementById("ravenclaw");
  const slytItem = document.getElementById("slytherin");
  const houseArr = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];
  let gryffindor = 0;
  let hufflepuff = 0;
  let ravenclaw = 0;
  let slytherin = 0;

  favCards.forEach((card) => {
    if (card.dataset.house === houseArr[0]) {
      gryffindor++;
    } else if (card.dataset.house === houseArr[1]) {
      hufflepuff++;
    } else if (card.dataset.house === houseArr[2]) {
      ravenclaw++;
    } else if (card.dataset.house === houseArr[3]) {
      slytherin++;
    }
  });

  gryfItem.innerHTML = ` - ${gryffindor}`;
  huffItem.innerHTML = ` - ${hufflepuff}`;
  raveItem.innerHTML = ` - ${ravenclaw}`;
  slytItem.innerHTML = ` - ${slytherin}`;
  console.log(gryffindor);
  console.log(hufflepuff);
  console.log(ravenclaw);
  console.log(slytherin);
}

getHPData();

const sortBtn = document.querySelectorAll(".sort-btn");

for (let i = 0; i < sortBtn.length; i++) {
  sortBtn[i].addEventListener("click", function () {
    const direction = this.dataset.sortdir;
    sortData(direction);
  });
}

if (localStorage.getItem("favorites") === null) {
  localStorage.setItem("favorites", "");
}

document.addEventListener("click", (e) => {
  const target = e.target;
  const card = target.parentElement.parentElement;
  const container = card.parentElement.id;
  const direction = container === "main" ? "toFavs" : "toMain";

  let storageData = localStorage.getItem("favorites");

  if (target.classList.contains("card-popup-box")) {
    updateCollections(target, direction);
    LocalStorageUpdate(storageData, card);
    favsCount();
  } else {
    console.log("something went wrong");
  }
});
