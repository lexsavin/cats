let main = document.querySelector("main");

const updCards = function (data) {
  main.innerHTML = "";

  data.forEach(function (cat) {
    if (cat.id) {
      let card = `<div class="${
        cat.favourite ? "card like" : "card"
      }" style="background-image:  url(${
        cat.img_link || "images/cat.jpg"
      })" id="card" data-id=${cat.id}> 
  <span>${cat.name}</span> 
  </div>`;
      main.innerHTML += card;
    }
  });

  let cards = document.getElementsByClassName("card");

  for (let i = 0, cnt = cards.length; i < cnt; i++) {
    const width = cards[i].offsetWidth;
    cards[i].style.height = width * 0.6 + "px";
  }

  setEventListenerCardsCats();
};

const getCats = function (api, store, authorization) {
  if (!authorization) {
    return;
  }

  if (!store.length) {
    api
      .getCats()
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          localStorage.setItem("cats", JSON.stringify(data.data));
          catsData = [...data.data];
          updCards(data.data);
        }
      });
  } else {
    updCards(store);
  }
};

getCats(api, catsData, hasAuthorizationCookies);
