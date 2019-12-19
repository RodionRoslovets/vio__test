import './scss/new.scss';

window.addEventListener('DOMContentLoaded', () => {
    let getCollButton = document.querySelectorAll('.get-button'),
        collectionsDiv = document.querySelectorAll('.app__collection'),
        photosDiv = document.querySelectorAll('.app__photos'),
        imageDiv = document.querySelectorAll('.app__image'),
        slickSettings = {
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000
        },
        fetchSettings = {
            method: 'GET',
            headers: {
                authorization: 'Client-ID 2b823b5bccbab0f9fd9891104e86e60945a14151ab7540e46e4a3284cec53699'
            }
        };

    let collectionData,
        collectionElems = [],
        photosData,
        photosElems = [];

    getCollButton.forEach(el => {
        el.addEventListener('click', () => {
            fetch('https://api.unsplash.com/collections', fetchSettings)
                .then(response => response.json())
                .then(res => {
                    collectionData = res;

                    collectionsDiv.forEach(element => {

                        if (element.children.length !== 0) {
                            //Удаляем слайдер
                            $('.app__collection').slick('unslick');
                            element.classList.remove(['slick-initialized', 'slick-slider']);
                        }
                        element.innerHTML = '';

                        collectionData.forEach(responseElem => {
                            let div = document.createElement('div'),
                                img = document.createElement('img'),
                                name = document.createElement('p'),
                                photosCount = document.createElement('p');

                            img.src = responseElem.preview_photos[0].urls.raw + '&w=200';
                            name.innerText = responseElem.title;
                            photosCount.innerText = `${responseElem.total_photos} photos`;

                            div.appendChild(img);
                            div.appendChild(name);
                            div.appendChild(photosCount);
                            div.classList.add('collection__item');

                            element.appendChild(div);

                            div.ident = responseElem.id;

                            collectionElems.push(div);

                        });
                    });

                    $('.app__collection').slick(slickSettings);
                })
                .then(() => {
                    collectionElems.forEach(el => {
                        el.addEventListener('click', () => {
                            fetch(`https://api.unsplash.com/collections/${el.ident}/photos`, fetchSettings)
                                .then(response => response.json())
                                .then(res => {
                                    photosData = res;

                                    photosDiv.forEach(element => {
                                        if (element.children.length !== 0) {
                                            //Удаляем слайдер
                                            $('.app__photos').slick('unslick');
                                            element.classList.remove(['slick-initialized', 'slick-slider']);
                                        }
                                        element.innerHTML = '';

                                        photosData.forEach(responseElem => {
                                            let div = document.createElement('div'),
                                                img = document.createElement('img'),
                                                name = document.createElement('p');

                                            img.src = responseElem.urls.raw + '&w=200';
                                            name.innerText = responseElem.title;


                                            div.appendChild(img);

                                            element.appendChild(div);

                                            div.ident = responseElem.id;
                                            div.url = responseElem.urls.raw;
                                            div.likes = responseElem.likes;
                                            div.author = responseElem.user.name;
                                            div.authorAvatar = responseElem.user.profile_image.small;

                                            photosElems.push(div);

                                        });
                                    });

                                    $('.app__photos').slick(slickSettings);

                                }).then(
                                    () => {
                                        photosElems.forEach(el => {
                                            el.addEventListener('click', () => {
                                                imageDiv.forEach((element) => {
                                                    element.innerHTML = '';

                                                    let img = document.createElement('img'),
                                                        info = document.createElement('p');

                                                    info.innerHTML = `${el.likes} likes<br> <img src="${el.authorAvatar}">Photo by ${el.author}`;
                                                    img.src = el.url;

                                                    element.appendChild(img);
                                                    element.appendChild(info);
                                                });
                                            });
                                        });
                                    }
                                );
                        });
                    });
                });
        });
    });
});