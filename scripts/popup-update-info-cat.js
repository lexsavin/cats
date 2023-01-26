const popupUpdateInfoCat = document.querySelector("#popupUpdateInfoCat");
const btnCloseUpdateInfoCat = document.querySelector("#btnCloseUpdateInfoCat");
const formUpdateInfoCat = document.querySelector("#formUpdateInfoCat");
const btnUpdateCat = document.querySelector("#btnUpdateCat");
const btnDeleteCat = document.querySelector("#btnDeleteCat");
const imageCat = document.querySelector("#imageCat");
const favouriteInput = formUpdateInfoCat.querySelector(
  "input[name='favourite']"
);

// Устанавливаем обработчики клика для каждой карточки кота
// При нажатии на карточку открывается попап
// Подгружаем информацию о коте из localeStorege
// Если по каким то причинам localeStorage пуст, то делается запрос на сервер
const setEventListenerCardsCats = () => {
  const cardsCats = document.querySelectorAll("#card");

  cardsCats.forEach((card) =>
    card.addEventListener("click", async () => {
      const idCat = card.dataset.id;

      try {
        const dataStorage = localStorage.getItem("cats");
        let cat;

        if (dataStorage) {
          cat = JSON.parse(dataStorage).find((cat) => cat.id === +idCat);
        } else {
          const response = await api.getCat(card.dataset.id);
          const { data } = await response.json();
          cat = data;
        }

        Object.entries(cat).forEach(([key, value]) => {
          if (key === "_id" || key === "id" || key === "__v") return;

          if (key === "favourite") {
            formUpdateInfoCat.elements[key].checked = value;
          } else if (key === "img_link") {
            imageCat.style.backgroundImage = `url(${value})`;
          } else {
            formUpdateInfoCat.elements[key].value = value;
          }
        });

        formUpdateInfoCat.dataset.id = card.dataset.id;

        popupUpdateInfoCat.style.display = "flex";
      } catch (error) {
        console.log(`Произошла ошибка ${error}`);
      }
    })
  );
};

// Обработчик кнопки закрытия попапа с информацией о коте
// Очищаем попап перед закрытием
btnCloseUpdateInfoCat.addEventListener("click", () => {
  formUpdateInfoCat.reset();
  imageCat.style.backgroundImage = "";
  formUpdateInfoCat.dataset.id = "";
  popupUpdateInfoCat.style.display = "";
});

// Обработчик для кнопки обновления информации для кота
// Обновялем на сервере, получаем нового кота с сервера
// И вносим изменения кота в localeStorage
btnUpdateCat.addEventListener("click", async (e) => {
  e.preventDefault();

  const idCat = formUpdateInfoCat.dataset.id;

  try {
    const formData = new FormData(formUpdateInfoCat);
    formData.set("favourite", favouriteInput.checked);

    const updatedCatData = Object.fromEntries(
      [...formData].filter(([key, value]) => value !== "")
    );

    await api.updCat(idCat, updatedCatData);

    const response = await api.getCat(idCat);
    const { data: updatedCat } = await response.json();

    catsData = catsData.map((cat) => {
      if (cat.id === +idCat) {
        return updatedCat;
      } else {
        return cat;
      }
    });

    localStorage.setItem("cats", JSON.stringify(catsData));

    getCats(api, catsData, true);

    btnCloseUpdateInfoCat.click();
  } catch (error) {
    console.log(`Произошла ошибка ${error}`);
  }
});

// Обработчик для удаления кота на сервере, на странице и в localeStorage
btnDeleteCat.addEventListener("click", async (e) => {
  e.preventDefault();

  const idCat = formUpdateInfoCat.dataset.id;

  try {
    await api.delCat(idCat);

    catsData = catsData.filter((cat) => cat.id !== +idCat);

    localStorage.setItem("cats", JSON.stringify(catsData));

    getCats(api, catsData, true);

    btnCloseUpdateInfoCat.click();
  } catch (error) {
    console.log(`Произошла ошибка ${error}`);
  }
});
