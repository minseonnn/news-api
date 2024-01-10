const searchForm = document.querySelector("#search_form");
const searchInput = searchForm.querySelector("#search_input");
const searchDate = searchForm.querySelector("#search_date");
const searchBtn = searchForm.querySelector("#search_btn");

const newsBox = document.querySelector(".news_box");
const newsList =document.querySelector(".news_list");

const modal_wrap = document.querySelector('.modal_wrap');
const modal_content = document.querySelector('modal_content');
const modal_close = document.querySelector(".modal_close");
const goToNews = document.querySelector('.goToNews');

// 날짜 오늘로 변경하기
let newsDate = new Date().toISOString().substring(0, 10);
searchDate.value = newsDate;

//form의 기본적인 기능을 막는 기능.(submit 기능을 막아야) form 검색 인식하면 이벤트 실행
// 
function handleForm(event) {
  event.preventDefault();
  console.log(event);

  let keyword = searchInput.value;

  if(keyword === "") {
    alert("Enter a search term");
  } else if (keyword.length < 3) {
    alert("Please enter at least 3 characters");
  }

  const apiKey = "06d0e3a5b3dd44ce9f4b3f011d79c3e2";
  const url = `https://newsapi.org/v2/everything?q=${keyword}&to=${newsDate}&sortBy=popularity&apiKey=${apiKey}`;

  fetch(url)
  .then((response) => {
    console.log(response);
    return response.json()
  })
  .then((data) => {
    console.log(data.articles);
    newsList.innerHTML = '';
    // console.log(article_list);
    
    data.articles.map(article => createListElement(article)).forEach(element => newsList.appendChild(element));
  }
  ).catch(error => console.error(error.message));
;
};

function createListElement (article) {
  // ul 안에 그려 줄 new item 
  let li = createElement("li", "news_li");
  
  //기사 이미지 링크
  let thumbnail_box = createElement('div','thumbnail_box');
  thumbnail_box.addEventListener("click", modalOpen);
  li.appendChild(thumbnail_box);
  
  let thumbnail_img = createElement('img','thumbnail_img');
  if (article.urlToImage !== null) {
    thumbnail_img.setAttribute('src', article.urlToImage);
  } else if (article.urlToImage == null) {
    const imgPath = "./img/no_img.jpg";
    thumbnail_img.setAttribute('src', imgPath);
  }
  thumbnail_box.appendChild(thumbnail_img);
  
  //기사 제목 링크
  let title_box = createElement('div','title_box');
  li.appendChild(title_box);
  //뉴스 타이틀
  let title = createElement('h2', "news_title");
  title.innerText = article.title;
  title_box.appendChild(title)
  title.addEventListener("click", modalOpen);

  //뉴스 내용(description)
  let content = createElement('p');
  content.innerText = article.description;
  title_box.appendChild(content);

  return li
}
// {className, onClick, src, innerText}
function createElement(elementTag, className) {
  const element = document.createElement(elementTag);
  element.classList.add(className)
  return element
}

function newsView(link) {
  location.href = link
}

function modalClose(event) {
  if(event.target.className === "modal_close"){
  modal_wrap.style.display = 'none';
  }
}

function modalOpen(event){
  if(event.target.className){
    modal_wrap.style.display = "block";
  }
}


//무한스크롤
const observeIntersection = (target, callback) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  });
  observer.observe(target);
}

const callNextPage = () =>{
  let page = 1;
  return () => {
    console.log("Loading page", page);
    page++;
  }
} 
observeIntersection(newsList, callNextPage);


modal_close.addEventListener("click", modalClose);

searchForm.addEventListener("submit", handleForm);
 //모달창 
 let mNews_title = document.querySelector('.mNews_title');
 mNews_title.innerText = article.title;

 let mNews_content = document.querySelector('.mNews_content');
 mNews_content.innerText = article.description;
 
 let mNews_author = document.querySelector('.mNews_author');
 mNews_author.innerText = article.author;

 goToNews.addEventListener("click", function(){
   newsView(article.url)
 } );