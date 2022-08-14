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