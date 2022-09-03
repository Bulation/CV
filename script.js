const hamburger = document.querySelector('.hamburger');
const sideMenu = document.querySelector('.navigation');
const sideMenuItems = document.querySelectorAll(".navigation-list__item");
const containers = document.querySelectorAll('.container')
const mark = document.querySelector('mark')
const closeMenu = document.querySelector('.close')
const sliderContainer = document.querySelector('.project-list');
const sliderImages = document.querySelectorAll('.project');
const bulletsContainer = document.querySelector('.project-pagination');
const bullets = document.querySelectorAll('.project-pagination__item');
const arrows = document.querySelectorAll('.project__control');

closeMenu.addEventListener('click', toggleHamburger);
hamburger.addEventListener('click', toggleHamburger);
for (let item of sideMenuItems)
   item.addEventListener("click", toggleActiveClass);

for (let container of containers) {
  container.addEventListener("click", hideMenuByClickOnBody);
}

function toggleHamburger(e) {
  closeMenu.classList.toggle("hidden");
  sideMenu.classList.toggle("transform");
  for (let container of containers) {
    container.classList.toggle("backFogging");
  }
  for (let item of sideMenuItems)
    item.addEventListener("click", toggleHamburger);
  mark.classList.toggle("black");
}

function hideMenuByClickOnBody(e) {
  if (!e.target.closest(".navigation") && !e.target.closest(".hamburger") && !closeMenu.matches(".hidden"))
    toggleHamburger(e);
}

function toggleActiveClass(e) {
    for (let item of sideMenuItems)
      item.firstChild.classList.remove("active");
    e.target.classList.add('active')
}

class Slider {
	constructor(container, items, bulletsContainer, bullets, arrows, currentNum, activeClass, transformPercent) {
		this.container = container;
		this.items = items;
		this.itemsLength = items.length;
		this.bulletsContainer = bulletsContainer;
		this.bullets = bullets;
		this.arrows = arrows;
		this.currentNum = currentNum || null;
		this.activeClass = activeClass;
		this.transformPercent = transformPercent;
		this.previousSlide = null;
		this.currentSlide = 1;
		this.isEnabled = true;
	}

	clonePrepend(ind) {
		this.container.prepend(this.items[this.items.length - ind].cloneNode(true));
	}

	cloneAppend(ind) {
		this.container.append(this.items[ind].cloneNode(true));
	}

	slideElements(n) {
    console.log(n, this.previousSlide)
		this.previousSlide = this.currentSlide;
		this.currentSlide = n;
		this.activateBullet(this.previousSlide, this.currentSlide);
		if (this.currentNum != null) this.changeSlideNumber(this.currentSlide);
		this.container.classList.add('transition-slider');
		this.container.style.transform = `translate(${-this.transformPercent * this.currentSlide}%, 0)`;
		if (this.currentSlide === this.itemsLength + 1 || this.currentSlide === 0) {
			this.container.addEventListener('transitionend', this.InfiniteLoop.bind(this), { once: true });
		}
	}

	changeSlideNumber(n) {
		if (n === this.itemsLength + 1) n = 1;
		if (n === 0) n = this.itemsLength;
		this.currentNum.innerHTML = '0' + n;
	}

	activateBullet(prev, cur) {
		let previousBullet = (prev - 1 + this.bullets.length) % this.bullets.length;
		let currentBullet = (cur - 1 + this.bullets.length) % this.bullets.length;
		this.bullets[previousBullet].classList.remove(this.activeClass);
		this.bullets[currentBullet].classList.add(this.activeClass);
	}

	InfiniteLoop() {
		if (this.currentSlide === 0) {
			this.container.style.transform = `translate(${-this.transformPercent * this.itemsLength}%, 0)`;
			this.currentSlide = this.itemsLength;
		} else if (this.currentSlide === this.itemsLength + 1) {
			this.container.style.transform = `translate(${-this.transformPercent * 1}%, 0)`;
			this.currentSlide = 1;
		}
	}

	enableSliding() {
		this.isEnabled = !this.isEnabled;
	}

	swipeDetect(el) {
		let startX;
		let finishX;
		let finishY;
		let startY;
		let startTime;
		let finishTime;
		let allowedTime = 100;
		let distanceX;
		let distanceY;
		let allowedDistanceY = 300;
		let allowedDistanceX = 50;
		el.addEventListener('mousedown', (e) => {
			e.preventDefault();
			startX = e.pageX;
			startY = e.pageY;
			startTime = new Date();
		});
		el.addEventListener('touchstart', (e) => {
			startX = e.changedTouches[0].pageX;
			startY = e.changedTouches[0].pageY;
			startTime = new Date();
		});
		el.addEventListener('touchend', (e) => {
			finishX = e.changedTouches[0].pageX;
			finishY = e.changedTouches[0].pageY;
			distanceX = Math.abs(finishX - startX);
			distanceY = Math.abs(finishY - startY);
			finishTime = new Date();
			if (distanceX > allowedDistanceX && distanceY < allowedDistanceY && finishTime - startTime > allowedTime && this.isEnabled) {
				if (distanceX === finishX - startX) this.slideElements(this.currentSlide - 1);
				else this.slideElements(this.currentSlide + 1);
			}
		});
		el.addEventListener('mouseup', (e) => {
			finishX = e.pageX;
			finishY = e.pageY;
			distanceX = Math.abs(finishX - startX);
			distanceY = Math.abs(finishY - startY);
			finishTime = new Date();
			if (distanceX > allowedDistanceX && distanceY < allowedDistanceY && finishTime - startTime > allowedTime && this.isEnabled) {
				if (distanceX === finishX - startX) this.slideElements(this.currentSlide + 1);
				else this.slideElements(this.currentSlide - 1);
			}
		});
	}
}
let activeClass = 'project-pagination__item_active';
let slider = new Slider(
	sliderContainer,
	sliderImages,
	bulletsContainer,
	bullets,
	arrows,
	null,
	activeClass,
	100
);

slider.cloneAppend(0);
slider.clonePrepend(1);
sliderContainer.addEventListener("transitionstart", () => {
  slider.enableSliding();
});
sliderContainer.addEventListener("transitionend", () => {
  slider.enableSliding();
  sliderContainer.classList.remove("transition-slider");
});
bulletsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("project-pagination__item"))
    slider.slideElements(
      Number(e.target.dataset.count)
    );
});

arrows[0].addEventListener("click", () => {
  if (!sliderContainer.classList.contains("transition-slider"))
    slider.slideElements(
      slider.currentSlide - 1
    );
});
arrows[1].addEventListener("click", () => {
  if (!sliderContainer.classList.contains("transition-slider"))
    slider.slideElements(
      slider.currentSlide + 1
    );
});
slider.swipeDetect(sliderContainer);


class Translator {
  constructor(nodes, langsContainer) {
    this.textNodes = nodes;
    this.en = document.querySelector('.text');
    this.langsContainer = langsContainer;
    this.en = this.langsContainer.querySelector('.langs__en');
    this.ru = this.langsContainer.querySelector('.langs__ru');
    this.i18Obj = {
      en: [ "Bulat Garipov",
            "About",
            "Contacts",
            "Skills",
            "English",
            "Education",
            "Projects",
            "Code",
            "About me",
            "My name is Bulat and I'm 20 years old. I'm interesting in programming from childhood, so first lines of code I wrote in Java when I was 13 years old. For many years I have been trying to find sphere of programming that will be interesting for me and now I decided to start career in IT on frontend. My goal now is to become a good specialist in frontend and with this experience develop further in IT",
            "My strenghs",
            "Diligence",
            "Patience",
            "Good memory",
            "Skill of finding information quickly",
            "Ability to solve problems indepedently",
            "Work experience",
            "2020-2021: Informatics USE Mentor in online-school. In this work I checked homeworks of school students, mostly on Python language, explained them how to solve some particular tasks in the USE, answered their questions about exam and etc",
            "Contact information",
            "Location: Saint-Petersburg",
            "Skills",
            "HTML, CSS, SCSS, BEM, basic knowledge of Bootstrap",
            "JavaScript, TypeScript, basic knowledge of Python and Node.js",
            "Basic knowledge of OOP, MVC pattern",
            "Level of English",
            "Between A2 and B1",
            "Education",
            "RSSchool March 2022 — September 2022",
            "My Projects",
            "Virtual Keyboard",
            "Another project where I used MVC pattern. There I also separated code on modules and separated them to different folders. Project was assembled by Webpack, also used ESLint Airbnb config here.",
            "Another project on TypeScript. There I worked with REST API, created interface for CRUD requests, worked with asynchronous JS, created animations with RequestAnimationFrame, saved state of pages. App was created with using MVC pattern.",
            "My first project on TypeScript. I created app, where user can filter, sort and search books, add them to cart and removing from cart. Filters and sorting state save in local storage, so after reloading page filters and sorting remain the same. Also user can reset filters and sorting. App was created with using MVC pattern.",
            "It is SPA that i made entirely on pure JS with empty HTML, styles were written on SCSS, entirely adaptive and with BEM methodology. In this site I implemented endless slider with randomly generated slides, pagination in \"Our pets\" section and modal windows with info about pets.",
            "Tic-Tac Toe",
            "Game where i tried implement MVC pattern. I created game model, where i save game state, game view that triggered game model and binded model and view on controller. Also I implemented settings game and modal windows. Project was written on JS, using classes",
            "Virtual Keyboard",
            "Another project where I used MVC pattern. There I also separated code on modules and separated them to different folders. Project was assembled by Webpack, also used ESLint Airbnb config here.",
            "Another project on TypeScript. There I worked with REST API, created interface for CRUD requests, worked with asynchronous JS, created animations with RequestAnimationFrame, saved state of pages. App was created with using MVC pattern.",
            "Code example",
            'My solution of <a href="https://www.codewars.com/kata/53583765d5493bfdf5001b35">this codewars kata</a>',
            "Problem: Make a Cat constructor that takes arguments name and weight to instantiate a new cat object. The constructor should also have an averageWeight method that returns the average weight of cats created with the constructor.",
            "Solution on JavaScript:"
      ],
      ru: [
        'Булат Гарипов',
        'Обо мне',
        'Контакты',
        'Умения',
        'Уровень английского',
        'Образование',
        'Проекты',
        'Пример кода',
        'Обо мне',
        'Меня зовут Булат, мне 20 лет. Я интересуюсь программированием с детства, так что первые строчки кода я написал уже в 13 лет на языке Java. Все эти годы я искал область программирования, которая была бы мне интересна и сейчас я решил начать карьеру в IT во фронтенд разработке. Сейчас моя цель - стать хорошим специалистом во фронтенде и с этим опытом развиваться дальше в IT сфере',
        'Мои сильные стороны',
        'Исполнительность',
        'Терпеливость',
        'Хорошая память',
        'Умение быстро находить нужную информацию',
        'Способность решать проблемы самостоятельно',
        'Опыт работы',
        "2020-2021: Куратор ЕГЭ по информатике в онлайн-школе. Проверял домашние работы по программированию у 11-классников, в основном на языке Python, оставлял под работами замечания, предложения по исправлению, советы по тому, как лучше писать код. Также отвечал на их вопросы касаемо заданий ЕГЭ, помогал в решениях и отвечал на все вопросы, касаемо организации экзамена",
        "Контактная информация",
        "Место проживания: Санкт-Петербург",
        "Умения",
        "HTML, CSS, SCSS, БЭМ, начальные знания Bootstrap",
        "JavaScript, TypeScript, начальные знания Python и Node.js",
        "Начальные знания ООП, паттерна MVC и дата-биндинга",
        "Уровень английского",
        "Между A2 и B1",
        "Образование",
        "RSSchool Март 2022 — Сентябрь 2022",
        "Мои проекты",
        "Виртуальная клавиатура",
        "Проект с использованием паттерна MVC. Код разбит на независмые модули. Проект собран на вебпаке, использован eslint airbnb конфиг",
        "Проект на TS. В нем я работал с REST API, создал интерфейс для работы с CRUD-операциями, работал с асинхронностью, создавал анимации с использованием requestAnimationFrame, сохранял состояние страниц при переключении страниц. Приложение создано с использованием MVC",
        "Мой первый проект на TS, в котором пользователь может фильтровать, сорртировать и искать книги, добавлять их в корзину и удалять оттуда. Фильтры и сортировка сохраняются в Local Storage, так что после перезагрузки страницы состояние фильтров и сортировки остается тем же.",
        "Лендинг созданный на чистом JS, с пустым HTML, стили были написаны на SCSS, верстка адаптивная до 320px, использован БЭМ. В этом лендинге я реализовал бесконечный слайдер с рандомно генерирующимися слайдами, пагинацию на странице Our Pets и модальные окна с информацией о животных",
        "Крестики-нолики",
        "Игра с попыткой реализации паттерна MVC. В этом проекте я создал модель, где я сохранял состояние, вьюшку, которая триггерила модель и все это связывалось в контроллере. Также реализованы настройки, модальные окна, таблица рекордов с сохранением результатов последних 10 игр.",
        "Виртуальная клавиатура",
        "Проект с использованием паттерна MVC. Код разбит на независмые модули. Проект собран на вебпаке, использован eslint airbnb конфиг",
        "Проект на TS. В нем я работал с REST API, создал интерфейс для работы с CRUD-операциями, работал с асинхронностью, создавал анимации с использованием requestAnimationFrame, сохранял состояние страниц при переключении страниц. Приложение создано с использованием MVC",
        "Пример кода",
        'Мое решение <a href="https://www.codewars.com/kata/53583765d5493bfdf5001b35">этой каты из кодварс</a>',
        "Задача: реализовать конструктор Cat, которые принимает в качестве аргументов имя и вес для создания объекта кота. Конструктор также должен иметь метод averageWeight, который возвращает средний вес котов, созданных в конструкторе",
        "Решение на JavaScript:"
      ],
    };
  }

  translate(lang) {
    for (let i = 0; i < this.textNodes.length; i += 1) {
      this.textNodes[i].innerHTML = this.i18Obj[lang][i];
    }
  }
}

const translator = new Translator(document.querySelectorAll('.text'), document.querySelector('.langs'));
translator.en.oninput = () => {
  translator.translate(translator.en.value);
};
translator.ru.oninput = () => {
  translator.translate(translator.ru.value);
};