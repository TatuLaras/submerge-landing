// ***  hero section ***
const bgImageDOM = document.querySelector('#background-image');
const mainHeaderDOM = document.querySelector('#main-header');
const bgImages = [
    '../landing/langphotos/chinese1.jpg',
    '../landing/langphotos/chinese2.jpg',
    '../landing/langphotos/japanese1.jpg',
    '../landing/langphotos/korean1.jpg',
];

// Preload
bgImages.forEach((i) => {
    new Image().src = i;
});

const languages = ['Immersion', '沉浸式教學', '投入法', '몰입하는 게'];
var imgIndex = 0;
var langIndex = 0;

const displayNextImage = () => {
    if (imgIndex >= bgImages.length) imgIndex = 0;
    bgImageDOM.style.backgroundImage = `url('${bgImages[imgIndex]}')`;
    bgImageDOM.style.animationName = `none`;

    setTimeout(() => {
        bgImageDOM.style.animationName = `bg-move`;
    }, 1);

    imgIndex++;
};

const displayNextLanguage = () => {
    if (langIndex >= languages.length) langIndex = 0;

    mainHeaderDOM.setAttribute('data-nextheader', languages[langIndex]);
    mainHeaderDOM.classList.remove('animate-textchange');
    mainHeaderDOM.innerHTML = mainHeaderDOM.getAttribute('data-currentheader');
    setTimeout(() => {
        mainHeaderDOM.innerHTML = '';
        mainHeaderDOM.classList.add('animate-textchange');
    }, 1);
    langIndex++;
};

displayNextImage();
displayNextLanguage();

bgImageDOM.onanimationend = (e) => {
    displayNextImage();
    displayNextLanguage();
};

mainHeaderDOM.onanimationend = (e) => {
    mainHeaderDOM.setAttribute('data-currentheader', mainHeaderDOM.getAttribute('data-nextheader'));
    mainHeaderDOM.style.content = mainHeaderDOM.getAttribute('data-nextheader');
};

// ***  content entry animation ***

const elmsAffected = document.querySelectorAll('.entry-effect');

const checkAnimatable = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return;

    elmsAffected.forEach((x) => {
        const bounding = x.getBoundingClientRect();
        const distanceFromView =
            (window.innerHeight || document.documentElement.clientHeight) - bounding.top; // > 0 = above screen bottom
        const range = 200; // range during which animation is happening

        if (distanceFromView > 0 && distanceFromView < range) {
            let effectMultiplier = distanceFromView / range; // 0 to 1
            let maxBlur = 10; //px
            let maxMove = 100; //px

            x.style.filter = `blur(${Math.floor(-maxBlur * effectMultiplier + maxBlur)}px)`;
            x.style.transform = `translateX(${maxMove * effectMultiplier - maxMove}px)`;
        } else {
            x.style.filter = `blur(0px)`;
            x.style.transform = `translateX(0)`;
        }
    });
};

window.onscroll = (e) => {
    checkAnimatable();
};

checkAnimatable();
