import galleryItems from './reference.js'

const refs  = {
    gallery: document.querySelector('.gallery'),
    lightBox: document.querySelector('.lightbox'),
    button: document.querySelector('[data-action="close-lightbox"]'),
    lightbox__image: document.querySelector('.lightbox__image'),
}

const { gallery, lightBox, button, lightbox__image} = refs

//  1. Создание и рендер разметки по массиву данных galleryItems 
// из app.js и предоставленному шаблону.

function createImageMarkUp(img) {
  return img
    .map(({ preview, original, description }) => {
      return `
      <li class="gallery__item">
  <a
    class="gallery__link"
    href=${original}
  >
    <img
      class="gallery__image"
      src=${preview}
      data-source=${original}
      alt="${description}"
    />
  </a>
</li>
    ` 
    }).join('')
}
// встявляю созданную разметку в HTML
const imageMarkup = createImageMarkUp(galleryItems)
gallery.insertAdjacentHTML('afterbegin', imageMarkup)


// 3. Открытие модального окна по клику на элементе галереи.

// создаю фунцию открытия модального окна и 
// добавляю картинку большого размера
gallery.addEventListener('click', onImageClick) 

function onImageClick(e) {
  e.preventDefault();
  if (e.target.nodeName === 'IMG') {
    lightBox.classList.add('is-open')
    const largeImg = e.target.getAttribute('data-source')
    lightbox__image.setAttribute('src', largeImg);
  lightbox__image.alt = e.target.alt;
  }
}


// создание функции закрытия модального окна
function hideElement() {
  lightBox.classList.remove('is-open')
}

// Закрытие модального окна клавишей ESC
window.addEventListener('keydown', onModalEscClose)

function onModalEscClose(e) {
  if (e.code === 'Escape')
    hideElement()
}


// Закрытие модального окна по классу .lightbox__overlay
lightBox.addEventListener('click', onClickModalClassClose)

function onClickModalClassClose(e) {
  if (e.target.classList
    .contains('lightbox__overlay')) {
    hideElement()
  }
}


// Закрытие модального окна по кнопке x
button.addEventListener('click', onClickModalBtnClose)

function onClickModalBtnClose(e) {
  if (e.currentTarget === e.target) {
    hideElement()
  }
}

// Сделал корявый слайдер
window.addEventListener('keydown', onSliderMove)

function onSliderMove(e) {
  if (lightBox.classList.contains('is-open')) {
    const galleryEl = galleryItems.map(value => value.original)
    const indexOfEl = Number(galleryEl.indexOf(lightbox__image.src))
    const previousEl = indexOfEl - 1
    const nextEl = indexOfEl + 1
    if (e.code === 'ArrowLeft') {
      lightbox__image.src = galleryEl[previousEl]
    }
    if (e.code === 'ArrowRight') {
      lightbox__image.src = galleryEl[nextEl]
    }
  }
}

// Снимаем слушателей 
if (lightBox.classList.contains('is-open')) {
  window.removeEventListener('keydown', onModalEscClose);
  lightBox.removeEventListener('click', onClickModalClassClose);
  button.removeEventListener('click', onClickModalBtnClose);
  window.addEventListener('keydown', onSliderMove)
}