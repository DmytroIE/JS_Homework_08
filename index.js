/* eslint linebreak-style: ['error', 'windows'] */


const galleryItems = [
  {
    preview: 'img/preview-1.jpg',
    fullview: 'img/fullview-1.jpg',
    alt: 'alt text 1',
  },
  {
    preview: 'img/preview-2.jpg',
    fullview: 'img/fullview-2.jpg',
    alt: 'alt text 2',
  },
  {
    preview: 'img/preview-3.jpg',
    fullview: 'img/fullview-3.jpg',
    alt: 'alt text 3',
  },
  {
    preview: 'img/preview-4.jpg',
    fullview: 'img/fullview-4.jpg',
    alt: 'alt text 4',
  },
  {
    preview: 'img/preview-5.jpg',
    fullview: 'img/fullview-5.jpg',
    alt: 'alt text 5',
  },
  {
    preview: 'img/preview-6.jpg',
    fullview: 'img/fullview-6.jpg',
    alt: 'alt text 6',
  },
  {
    preview: 'img/preview-7.jpg',
    fullview: 'img/fullview-7.jpg',
    alt: 'alt text 7',
  },
  {
    preview: 'img/preview-8.jpg',
    fullview: 'img/fullview-8.jpg',
    alt: 'alt text 8',
  },
];

class PictureGallery {
  constructor(items, parentNode, defaultActiveItem = 1) {
    parentNode.className = 'gallery';

    const fullViewContainer = document.createElement('div');
    fullViewContainer.className = 'gallery__fullview-container';
    parentNode.appendChild(fullViewContainer);

    const fullImage = document.createElement('img');
    fullImage.className = 'gallery__fullimage';
    fullImage.setAttribute('src', `img/fullview-${defaultActiveItem}.jpg`);
    fullViewContainer.appendChild(fullImage);

    const previewContainer = document.createElement('div');
    previewContainer.className = 'gallery__preview-container';
    parentNode.appendChild(previewContainer);

    const previewImages = [];
    items.forEach((item, idx) => {
      const img = document.createElement('img');
      img.setAttribute('src', item.preview);
      img.setAttribute('alt', item.alt);
      img.setAttribute('data-fullview', item.fullview);
      img.className = 'gallery__preview-img';
      if (idx === 0) { // защита от дурака
        img.style.marginLeft = '0';
      }
      if (idx===items.length-1) { // и это тоже защита от дурака
        img.style.marginRight = '0';
      }
      previewContainer.appendChild(img);
      previewImages[idx] = img; // делаем масив ссылок на превью-картинки, чтобы было удобно с ними работать
    });

    const prevBtn = document.createElement('div');
    prevBtn.className = 'gallery__button gallery__button--prev';
    previewContainer.appendChild(prevBtn);

    const nextBtn = document.createElement('div');
    nextBtn.className = 'gallery__button gallery__button--next';
    previewContainer.appendChild(nextBtn);

    // --------------------------------------Обработчики событий----------------------------
    this._step = 50;

    function onClickPrev(e) {
      if (!e.target.matches('.gallery__button--prev')) {
        return;
      }
      // работаем с margin 1й превью -картинки
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      const previewFirstImageMarginLeft = parseFloat(previewFirstImageCompStyle.marginLeft);

      if (previewFirstImageMarginLeft + this._step > 0) {
        previewImages[0].style.marginLeft = '0';
      }
      else {
        previewImages[0].style.marginLeft = previewFirstImageMarginLeft + this._step + 'px';
      }
    }

    prevBtn.addEventListener('click', onClickPrev.bind(this));

    // ---------------------------------------------------------------------------------------------------------------------

    function onClickNext(e) {
      if (!e.target.matches('.gallery__button--next')) {
        return;
      }
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      const previewFirstImageMarginLeft = parseFloat(previewFirstImageCompStyle.marginLeft);
      const previewContainerCompStyle = getComputedStyle(previewContainer);
      const previewContainerPaddingLeft = parseFloat(previewContainerCompStyle.paddingLeft);
      const previewContainerPaddingRight = parseFloat(previewContainerCompStyle.paddingRight);
      
      // вычисление длины превью-элемента
      
      const previewLineWidth = previewImages.reduce((acc, curr, idx) => {
        const previewImageStyle = getComputedStyle(curr);
        if (idx !== 0) {
          acc += parseFloat(previewImageStyle.marginLeft); // не считаем отрицательный margin первой картинки
        }
        acc += curr.offsetWidth; 
        if (idx !== previewImages.length-1) {
          acc += parseFloat(previewImageStyle.marginRight); // не считаем последний правый марджин (его не должно быть, но вдруг он есть)
        }
        return acc;
      }, 0);


      // если полоса с превью-картинками помещается в контентном поле контейнера по ширине, то ничего не делаем
      const contentWidth = previewContainer.clientWidth - previewContainerPaddingLeft - previewContainerPaddingRight;
      if (previewLineWidth < contentWidth) {
        return;
      }
      // иначе
      const lowestMarginLeft = contentWidth - previewLineWidth; // самая маленькая (большая по модулю) left margin, которая вообще возможна
      if (previewFirstImageMarginLeft - this._step < lowestMarginLeft) {
        previewImages[0].style.marginLeft = lowestMarginLeft + 'px';}
      else {
        previewImages[0].style.marginLeft = previewFirstImageMarginLeft - this._step + 'px';
      }
    }

    nextBtn.addEventListener('click', onClickNext.bind(this));

    // -------------------------------------------------------------------------------------------------------------------

    function selectPicture(e) {
      if (!e.target.matches('.gallery__preview-img')) {
        return;
      }
      fullImage.setAttribute('src', `${e.target.dataset.fullview}`);
      // если картинка частично скрыта, то при клике ее нужно показать
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      const previewFirstImageMarginLeft = parseFloat(previewFirstImageCompStyle.marginLeft);
      const previewContainerCompStyle = getComputedStyle(previewContainer);
      const previewContainerPaddingLeft = parseFloat(previewContainerCompStyle.paddingLeft);
      const previewContainerPaddingRight = parseFloat(previewContainerCompStyle.paddingRight);

      const targetIdx = previewImages.indexOf(e.target);

      const imagesFromLeft = previewImages.filter((item, idx) => idx < targetIdx);
      const widthFromLeft = imagesFromLeft.reduce((acc, curr, idx) => {
        const currCompStyle = getComputedStyle(curr);
        if (idx!==0) {
          acc += parseFloat(currCompStyle.marginLeft);
        }
        acc += curr.offsetWidth + parseFloat(currCompStyle.marginRight);
        return acc;
      }, 0);

      // если картинка 'застряла' слева
      if (previewFirstImageMarginLeft + widthFromLeft < 0) { 
        previewImages[0].style.marginLeft = previewFirstImageMarginLeft - (previewFirstImageMarginLeft + widthFromLeft) + 'px'; // учитывается только левый padding, border не учитывается
      }
      // если картинка справа
      const contentWidth = previewContainer.clientWidth - previewContainerPaddingLeft - previewContainerPaddingRight;
      if (widthFromLeft + e.target.offsetWidth > contentWidth - previewFirstImageMarginLeft) {
        previewImages[0].style.marginLeft = previewFirstImageMarginLeft - ((widthFromLeft + e.target.offsetWidth) - (contentWidth - previewFirstImageMarginLeft))
        + 'px';
      
      }
    }
    previewContainer.addEventListener('click', selectPicture.bind(this));
  }
  get step() {
    return this._step;
  }

  set step(value) {
    this._step = value;
    if (this._step < 20){
      this._step = 20;
    }
    const maxStep = Math.floor(document.querySelector('.gallery__preview-container').clientWidth / 3);
    if (this._step > maxStep) {
      this._step = maxStep;
    }
  }
}

const container = document.querySelector('#gallery');
const gallery = new PictureGallery(galleryItems, container, 1);
gallery.step = 100;
