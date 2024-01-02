const searchForm = document.querySelector("#search_form");
const searchInput = searchForm.querySelector("#search_input");
const searchDate = searchForm.querySelector("#search_date");
const searchBtn = searchForm.querySelector("#search_btn");

const newsBox = document.querySelector(".news_box");
const newsList =document.querySelector(".news_list");

const modal_wrap = document.querySelector('.modal_wrap');

// 날짜 오늘로 변경하기
let newsDate = new Date().toISOString().substring(0, 10);
searchDate.value = newsDate;

//form의 기본적인 기능을 막는 기능.(submit 기능을 막아야) form 검색 인식하면 이벤트 실행
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
    
    const arrA = data.articles.map(article => {
    const li = createListElement(article);
    li.addEventListener('click', () => createModal(article))
    return li
    });
    console.log(arrA);
    arrA.forEach(element => newsList.appendChild(element));
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

function createModal (article) {
//모달창 
  let modal_content = createElement('div','modal_content');
  let mNews_title = createElement('h3','mNews_title');
  mNews_title.innerText = article.title;
  let mNews_author = createElement('p','mNews_author');
  mNews_author.innerText = article.author;
  let mNews_content = createElement('p','mNews_content');
  mNews_content.innerText = article.description.slice(0,100) + "...";
  let mNews_view = createElement('a','mNews_view');
  mNews_view.href = article.url
  mNews_view.innerText = 'view';
  let modal_close = createElement('button','modal_close');
  modal_close.innerText = 'X';
  modal_close.addEventListener("click", modalClose);

  modal_wrap.appendChild(modal_content);
  modal_content.appendChild(modal_close);
  modal_content.appendChild(mNews_title);
  modal_content.appendChild(mNews_author);
  modal_content.appendChild(mNews_content);
  modal_content.appendChild(mNews_view);
  
}

// {className, onClick, src, innerText}
function createElement(elementTag, className) {
  const element = document.createElement(elementTag);
  element.classList.add(className)
  return element
}


function modalClose(event) {
  let modal_content = document.querySelector(".modal_content");
  if(event.target.className === "modal_close"){
  modal_wrap.removeChild(modal_content);
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

searchForm.addEventListener("submit", handleForm);

