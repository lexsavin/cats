const greeting = document.querySelector("#greeting");
const popupWrapperAuthorization = document.querySelector(
  "#popupWrapperAuthorization"
);
const formAuthorization = document.querySelector("#formAuthorization");
const btnIn = document.querySelector("#btnIn");
const btnOut = document.querySelector("#btnOut");

// Подключена библиотека js-cookie через cdn-ссылку,
// Здесь используем глобальный объект Cookies
// Проверяем, есть ли авторизованный пользователь
const hasAuthorizationCookies = Cookies.get("user");

popupWrapperAuthorization.style.display = hasAuthorizationCookies ? "none" : "";

if (!hasAuthorizationCookies) {
  greeting.style.display = "none";
} else {
  greeting.firstElementChild.innerText = `Здравствуйте, ${Cookies.get("user")}`;
}

// Обработчик для кнопки авторизации пользователя
btnIn.addEventListener("click", (e) => {
  e.preventDefault();

  const login = formAuthorization.elements.login.value;
  const password = formAuthorization.elements.password.value;

  if (login && password) {
    Cookies.set("user", login);
    Cookies.set("password", password);

    popupWrapperAuthorization.style.display = "none";

    greeting.firstElementChild.innerText = `Здравствуйте, ${Cookies.get(
      "user"
    )}`;
    greeting.style.display = "";

    getCats(api, catsData, true);
  } else {
    alert("Введите логин и пароль!");
  }
});

// Обработчик для кнопки выхода из аккаунта пользователя
btnOut.addEventListener("click", (e) => {
  Cookies.remove("user");
  Cookies.remove("password");
  localStorage.clear();

  popupWrapperAuthorization.style.display = "";
  greeting.style.display = "none";
  document.querySelector("main").innerHTML = "";
});
