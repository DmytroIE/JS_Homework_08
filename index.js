/* eslint linebreak-style: ['error', 'windows'] */


const galleryItems = [
  {
    preview: "img/preview-1.jpg",
    fullview: "img/fullview-1.jpg",
    alt: "alt text 1"
  },
  {
    preview: "img/preview-2.jpg",
    fullview: "img/fullview-2.jpg",
    alt: "alt text 2"
  },
  {
    preview: "img/preview-3.jpg",
    fullview: "img/fullview-3.jpg",
    alt: "alt text 3"
  },
  {
    preview: "img/preview-4.jpg",
    fullview: "img/fullview-4.jpg",
    alt: "alt text 4"
  },
  {
    preview: "img/preview-5.jpg",
    fullview: "img/fullview-5.jpg",
    alt: "alt text 5"
  },
  {
    preview: "img/preview-6.jpg",
    fullview: "img/fullview-6.jpg",
    alt: "alt text 6"
  }
];

class PictureGallery {
  constructor(items, parentNode, defaultActiveItem = 1) {
    parentNode.className = "gallery";

    const fullViewContainer = document.createElement("div");
    fullViewContainer.className = "gallery__fullview-container";
    parentNode.appendChild(fullViewContainer);

    const fullImage = document.createElement("img");
    fullImage.className = "gallery__fullimage";
    fullImage.setAttribute("src", `img/fullview-${defaultActiveItem}.jpg`);
    fullViewContainer.appendChild(fullImage);

    const previewContainer = document.createElement("div");
    previewContainer.className = "gallery__preview-container";
    parentNode.appendChild(previewContainer);

    //const previewLine = document.createElement("div");
    //previewLine.className = "gallery__preview-line";
    //previewContainer.appendChild(previewLine);
    const previewImages = [];
    items.forEach((item, idx) => {
      const img = document.createElement("img");
      img.setAttribute("src", item.preview);
      img.setAttribute("alt", item.alt);
      img.setAttribute("data-fullview", item.fullview);
      img.className = "gallery__preview-img";
      if (idx===0){ // защита от дурака
        img.style.marginLeft = '0';
      }
      if (idx===items.length-1){ // и это тоже защита от дурака
        img.style.marginRight = '0';
      }
      previewContainer.appendChild(img);
      previewImages[idx] = img; // делаем масив ссылок на превью-картинки, чтобы было удобно с ним работать
    });

    const prevBtn = document.createElement("div");
    prevBtn.className = "gallery__button gallery__button--prev";
    previewContainer.appendChild(prevBtn);

    const nextBtn = document.createElement("div");
    nextBtn.className = "gallery__button gallery__button--next";
    previewContainer.appendChild(nextBtn);

    // --------------------------------------Обработчики событий----------------------------
    function onClickPrev(e) {
      if (!e.target.matches(".gallery__button--prev")) {
        return;
      }
      // работаем с margin 1й превью -картинки
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      let previewFirstImageMarginLeft = parseFloat(previewFirstImageCompStyle.marginLeft);
      previewFirstImageMarginLeft = previewFirstImageMarginLeft + 100;
      if (previewFirstImageMarginLeft > 0) previewFirstImageMarginLeft = 0;
      previewImages[0].style.marginLeft = previewFirstImageMarginLeft + "px";
    }

    prevBtn.addEventListener("click", onClickPrev.bind(this));

    // ---------------------------------------------------------------------------------------------------------------------
    
    function onClickNext(e) {
      if (!e.target.matches(".gallery__button--next")) {
        return;
      }
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      //let previewFirstImageMarginLeft = parseFloat(previewFirstImageCompStyle.marginLeft);

      // вычисление длины превью-элемента
      
      // вначале ширИны всех изображений с учетом боковых margin
      let previewLineWidth = 0;
      previewImages.forEach((item, idx) => {
        const previewImageStyle = getComputedStyle(item);
        if (idx!==0){
          previewLineWidth +=parseFloat(previewImageStyle.marginLeft); // не считаем отрицательный margin первой картинки
        }
        previewLineWidth += item.offsetWidth + parseFloat(previewImageStyle.marginRight);
      });

      const previewContainerCompStyle = getComputedStyle(previewContainer);
      // если полоса с превью-картинками помещается в контентном поле контейнера по ширине, то ничего не делаем
      if (previewLineWidth < previewContainer.clientWidth - parseFloat(previewContainerCompStyle.paddingLeft) - parseFloat(previewContainerCompStyle.paddingRight)){
        return;
      }
      // иначе
 
      if (previewImages[previewImages.length-1].offsetLeft - 100 < previewContainer.clientWidth - previewImages[previewImages.length-1].offsetWidth - parseFloat(previewContainerCompStyle.paddingRight)){
        previewImages[0].style.marginLeft =
        parseFloat(previewFirstImageCompStyle.marginLeft) 
        - (previewImages[previewImages.length-1].offsetLeft + previewImages[previewImages.length-1].offsetWidth - previewContainer.clientWidth) 
        - parseFloat(previewContainerCompStyle.paddingRight) 
        + 'px';}
      else{
        previewImages[0].style.marginLeft = parseFloat(previewImages[0].style.marginLeft) - 100 + 'px';
      }
    }

    nextBtn.addEventListener('click', onClickNext.bind(this));

    // -------------------------------------------------------------------------------------------------------------------

    function selectPicture(e){
      if (!e.target.matches('.gallery__preview-img')) {
        return;
      }
      fullImage.setAttribute("src", `${e.target.dataset.fullview}`);
      // если картинка частично скрыта, то при клике ее нужно показать
      const previewFirstImageCompStyle = getComputedStyle(previewImages[0]);
      const previewContainerCompStyle = getComputedStyle(previewContainer);
      // картинка слева
      if (e.target.offsetLeft < parseFloat(previewContainerCompStyle.paddingLeft) /*&& e.target.offsetLeft > -e.target.offsetWidth*/){ // если картинка "застряла" слева
        previewImages[0].style.marginLeft = parseFloat(previewFirstImageCompStyle.marginLeft) + Math.abs(e.target.offsetLeft) 
        + parseFloat(previewContainerCompStyle.paddingLeft) + 'px'; // учитывается только левый padding, border не учитывается
      }
      // картинка справа

      if(e.target.offsetLeft > previewContainer.clientWidth - e.target.offsetWidth - parseFloat(previewContainerCompStyle.paddingRight)){
        previewImages[0].style.marginLeft = 
        parseFloat(previewFirstImageCompStyle.marginLeft) 
        - (e.target.offsetLeft + e.target.offsetWidth - previewContainer.clientWidth) 
        - parseFloat(previewContainerCompStyle.paddingRight) 
        + 'px';
      
      }
    }
    previewContainer.addEventListener('click', selectPicture.bind(this));

  }
}

const container = document.querySelector("#gallery");
const gallery = new PictureGallery(galleryItems, container, 1);
