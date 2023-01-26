let addBtn = document.querySelector("#add");

let popupForm = document.querySelector("#popup-form");

let closePopupForm = popupForm.querySelector(".popup-close");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!popupForm.classList.contains("active")) {
    popupForm.classList.add("active");
    popupForm.parentElement.classList.add("active");
  }
});

closePopupForm.addEventListener("click", () => {
  popupForm.classList.remove("active");
  popupForm.parentElement.classList.remove("active");
});

let form = document.forms[0];

form.img_link.addEventListener("change", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});

form.img_link.addEventListener("input", (e) => {
  form.firstElementChild.style.backgroundImage = `url(${e.target.value})`;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let body = {};

  for (let i = 0; i < form.elements.length; i++) {
    let inp = form.elements[i];
    if (inp.type === "checkbox") {
      body[inp.name] = inp.checked;
    } else if (inp.name && inp.value) {
      if (inp.type === "number") {
        body[inp.name] = +inp.value;
      } else {
        body[inp.name] = inp.value;
      }
    }
  }

  api
    .addCat(body)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "ok") {
        form.reset();
        closePopupForm.click();
        api
          .getCat(body.id)
          .then((res) => res.json())
          .then((cat) => {
            if (cat.message === "ok") {
              catsData.push(cat.data);
              localStorage.setItem("cats", JSON.stringify(catsData));
              getCats(api, catsData, true);
            } else {
              console.log(cat);
            }
          });
      } else {
        console.log(data);
        api
          .getIds()
          .then((r) => r.json())
          .then((d) => console.log(d));
      }
    });
});
