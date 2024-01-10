var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var searchForm = document.querySelector("#search_form");
var searchInput = document.querySelector("#search_input");
var searchDate = document.querySelector("#search_date");
var searchBtn = document.querySelector("#search_btn");
var keyword;
var page = 1;
var newsBox = document.querySelector(".news_box");
var newsList = document.querySelector(".news_list");
var modal_wrap = document.querySelector('.modal_wrap');
var newsDate = new Date().toISOString().substring(0, 10);
searchDate.value = newsDate;
searchForm.addEventListener("submit", handleForm);
function handleForm(event) {
    event.preventDefault();
    keyword = searchInput.value;
    if (keyword === "") {
        alert("Enter a search term");
    }
    else if (keyword.length < 3) {
        alert("Please enter at least 3 characters");
    }
    console.log(event);
    newsList.innerHTML = '';
    page = 1;
    printNews(keyword);
}
;
function printNews(keyword) {
    var apiKey = "06d0e3a5b3dd44ce9f4b3f011d79c3e2";
    var url = "https://newsapi.org/v2/everything?q=".concat(keyword, "&to=").concat(newsDate, "&pageSize=5&page=").concat(page, "&sortBy=popularity&apiKey=").concat(apiKey);
    fetch(url)
        .then(function (response) {
        console.log(response);
        return response.json();
    })
        .then(function (data) {
        console.log(data.articles);
        //data.articles은 뉴스기사들을 모아 놓은 배열
        var newsArray = data.articles.map(function (article) {
            var li = createListElement(article);
            li.addEventListener('click', function () { return createModal(article); });
            return li;
        });
        newsArray.forEach(function (element) { return newsList.appendChild(element); }); //여기서 element들은 li.news_li
        return newsArray;
    }).then(function (newsArray) {
        observerItem(observer, newsArray);
    }).catch(function (error) { return console.error(error.message); });
}
function createListElement(article) {
    // ul 안에 그려 줄 new item 
    var li = createElement("li", { class: "news_li" });
    //기사 이미지 링크
    var thumbnail_box = createElement('div', { class: 'thumbnail_box' });
    thumbnail_box.addEventListener("click", modalOpen);
    li.appendChild(thumbnail_box);
    var thumbnail_img = createElement('img', { class: 'thumbnail_img' });
    if (article.urlToImage !== null) {
        thumbnail_img.setAttribute('src', article.urlToImage);
    }
    else if (article.urlToImage == null) {
        var imgPath = "./img/no_img.jpg";
        thumbnail_img.setAttribute('src', imgPath);
    }
    thumbnail_box.appendChild(thumbnail_img);
    //기사 제목 링크
    var title_box = createElement('div', { class: 'title_box' });
    li.appendChild(title_box);
    //뉴스 타이틀
    var title = createElement('h2', { class: "news_title" });
    title.innerText = article.title;
    title_box.appendChild(title);
    title.addEventListener("click", modalOpen);
    //뉴스 내용(description)
    var content = createElement('p', { class: "" });
    content.innerText = article.description;
    title_box.appendChild(content);
    return li;
}
function createModal(article) {
    //모달창 
    var modal_content = createElement('div', { class: 'modal_content', });
    var mNews_title = createElement('h3', { class: 'mNews_title', children: article.title });
    var mNews_author = createElement('p', { class: 'mNews_author', children: article.author });
    var mNews_content = createElement('p', { class: 'mNews_content', children: article.description.slice(0, 100) + "..." });
    var mNews_view = createElement('a', { class: 'mNews_view', href: article.url, children: 'view' });
    var modal_close = createElement('button', { class: 'modal_close', children: "X" });
    modal_close.addEventListener("click", modalClose);
    if (modal_wrap !== null) {
        modal_wrap.appendChild(modal_content);
        modal_content.appendChild(modal_close);
        modal_content.appendChild(mNews_title);
        modal_content.appendChild(mNews_author);
        modal_content.appendChild(mNews_content);
        modal_content.appendChild(mNews_view);
    }
}
// {className, onClick, src, innerText}
function createElement(elementTag, attributes) {
    var element = document.createElement(elementTag);
    var _a = attributes !== null && attributes !== void 0 ? attributes : {}, children = _a.children, rest = __rest(_a, ["children"]);
    Object.keys(rest !== null && rest !== void 0 ? rest : {}).forEach(function (key) {
        var value = rest[key];
        element.setAttribute(key, value);
    });
    if (children) {
        element.innerHTML = children;
    }
    return element;
}
function modalClose(event) {
    var modal_content = document.querySelector(".modal_content");
    var target = event.target;
    if (target && target.className === "modal_close") {
        modal_wrap.removeChild(modal_content);
        modal_wrap.style.display = 'none';
    }
}
function modalOpen(event) {
    var target = event.target;
    if (target && target.className) {
        modal_wrap.style.display = "block";
    }
}
//intersection observer
var observer = new IntersectionObserver(callback, { threshold: 0.5 });
function callback(entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            console.log("뷰포트가 뉴스리스트의 50%까지 교차 되었음");
            printNews(keyword);
            observer.disconnect();
        }
    });
}
function observerItem(observe, newsArray) {
    console.log(newsArray.length);
    var lastItem = newsArray[Math.ceil(newsArray.length - Number(newsArray.length / 2))];
    observe.observe(lastItem);
    page++;
}
