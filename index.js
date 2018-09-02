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

    const previewLine = document.createElement("div");
    previewLine.className = "gallery__preview-line";
    previewContainer.appendChild(previewLine);

    items.forEach((item) => {
      const img = document.createElement("img");
      img.setAttribute("src", item.preview);
      img.setAttribute("alt", item.alt);
      img.setAttribute("data-fullview", item.fullview);
      img.className = "gallery__preview-img";
      previewLine.appendChild(img);
    });

    const prevBtn = document.createElement("div");
    prevBtn.className = "gallery__button gallery__button--prev";
    previewContainer.appendChild(prevBtn);

    const nextBtn = document.createElement("div");
    nextBtn.className = "gallery__button gallery__button--next";
    previewContainer.appendChild(nextBtn);

    this.parentNode = parentNode;
    // --------------------------------------Обработчики событий----------------------------
    function onClickPrev(e) {
      if (!e.target.matches(".gallery__button--prev")) {
        return;
      }
      const previewLineCompStyle = getComputedStyle(previewLine);
      let previewLineMarginLeft = previewLineCompStyle.marginLeft;
      previewLineMarginLeft = parseInt(previewLineMarginLeft) + 100;
      if (previewLineMarginLeft > 0) previewLineMarginLeft = 0;
      previewLine.style.marginLeft = previewLineMarginLeft + "px";
    }

    prevBtn.addEventListener("click", onClickPrev.bind(this));

    // --------------
    function onClickNext(e) {
      if (!e.target.matches(".gallery__button--next")) {
        return;
      }
      const previewLineCompStyle = getComputedStyle(previewLine);
      let previewLineMarginLeft = previewLineCompStyle.marginLeft;
      previewLineMarginLeft = parseInt(previewLineMarginLeft) - 100;
      // вычисление длины превью-элемента
      let previewLineWidth = 0;
      // вначале ширИны всех изображений с учетом боковых margin и padding
      const previewImages = this.parentNode.querySelectorAll('.gallery__preview-img');
      
      previewImages.forEach((item) => {
        const previewImageStyle = getComputedStyle(item);
        previewLineWidth += item.offsetWidth + parseInt(previewImageStyle.marginLeft) + parseInt(previewImageStyle.marginRight)
        + parseInt(previewImageStyle.paddingLeft) + parseInt(previewImageStyle.paddingRight);
      });
      // к этой длине еще нужно добавить паддинги элемента previewLine

      previewLineWidth += parseInt(previewLineCompStyle.paddingLeft) + parseInt(previewLineCompStyle.paddingRight)
      // вычисление длины превью-контейнера
      const previewContainerWidth = this.parentNode.querySelector('.gallery__preview-container').offsetWidth;
      // сравнение - чтобы line далеко влево не убежал, 10px - запас на всякий случай
      if (previewLineMarginLeft < - previewLineWidth + previewContainerWidth) {
        previewLineMarginLeft = - previewLineWidth + previewContainerWidth;
      }

      previewLine.style.marginLeft = previewLineMarginLeft + 'px';
    }

    nextBtn.addEventListener('click', onClickNext.bind(this));
    // ------------

    function selectPicture(e){
      if (!e.target.matches('.gallery__preview-img')) {
        return;
      }
      fullImage.setAttribute("src", `${e.target.dataset.fullview}`);
    }
    previewContainer.addEventListener('click', selectPicture.bind(this));

  }
}

const container = document.querySelector("#gallery");
const gallery = new PictureGallery(galleryItems, container, 1);
