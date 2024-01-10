const searchForm: HTMLFormElement = document.querySelector("#search_form")!;
const searchInput: HTMLInputElement = document.querySelector("#search_input")!;
const searchDate: HTMLInputElement = document.querySelector("#search_date")!;
const searchBtn: HTMLButtonElement = document.querySelector("#search_btn")!;

let keyword: string;
let page = 1;

interface OneArticle {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: Record<string, string>;
  title: string;
  url: string;
  urlToImage: string;
}

const newsBox: HTMLDivElement = document.querySelector(".news_box")!;
const newsList: HTMLUListElement = document.querySelector(".news_list")!;

const modal_wrap: HTMLDivElement = document.querySelector('.modal_wrap')!;

let newsDate: string = new Date().toISOString().substring(0, 10);
searchDate.value = newsDate;

searchForm.addEventListener("submit", handleForm);

function handleForm(event: SubmitEvent): void {
  event.preventDefault();
  keyword = searchInput.value;
  if (keyword === "") {
    alert("Enter a search term");
  } else if (keyword.length < 3) {
    alert("Please enter at least 3 characters");
  }
  console.log(event);
  newsList.innerHTML = '';
  page = 1;
  printNews(keyword);
};

function printNews(keyword: string) {
  const apiKey = "06d0e3a5b3dd44ce9f4b3f011d79c3e2";
  const url: string = `https://newsapi.org/v2/everything?q=${keyword}&to=${newsDate}&pageSize=5&page=${page}&sortBy=popularity&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json()
    })
    .then((data) => {
      console.log(data.articles);

      //data.articles은 뉴스기사들을 모아 놓은 배열
      const newsArray = data.articles.map((article: OneArticle) => {

        const li = createListElement(article);
        li.addEventListener('click', () => createModal(article))
        return li
      })
      newsArray.forEach((element: HTMLElement) => newsList.appendChild(element)); //여기서 element들은 li.news_li
      return newsArray
    }).then(newsArray => {
      observerItem(observer, newsArray);
    }).catch(error => console.error(error.message));
}


function createListElement(article: OneArticle) {
  // ul 안에 그려 줄 new item 
  let li = createElement("li", { class: "news_li" });

  //기사 이미지 링크
  let thumbnail_box = createElement('div', { class: 'thumbnail_box' });
  thumbnail_box.addEventListener("click", modalOpen);
  li.appendChild(thumbnail_box);

  let thumbnail_img = createElement('img', { class: 'thumbnail_img' });
  if (article.urlToImage !== null) {
    thumbnail_img.setAttribute('src', article.urlToImage);
  } else if (article.urlToImage == null) {
    const imgPath = "./img/no_img.jpg";
    thumbnail_img.setAttribute('src', imgPath);
  }
  thumbnail_box.appendChild(thumbnail_img);

  //기사 제목 링크
  let title_box = createElement('div', { class: 'title_box' });
  li.appendChild(title_box);
  //뉴스 타이틀
  let title = createElement('h2', { class: "news_title" });
  title.innerText = article.title;
  title_box.appendChild(title)
  title.addEventListener("click", modalOpen);

  //뉴스 내용(description)
  let content = createElement('p', { class: "" });
  content.innerText = article.description;
  title_box.appendChild(content);

  return li
}

function createModal(article: OneArticle) {
  //모달창 
  let modal_content: Element = createElement('div', { class: 'modal_content', });
  let mNews_title = createElement('h3', { class: 'mNews_title', children: article.title });

  let mNews_author = createElement('p', { class: 'mNews_author', children: article.author });

  let mNews_content = createElement('p', { class: 'mNews_content', children: article.description.slice(0, 100) + "..." });

  let mNews_view = createElement('a', { class: 'mNews_view', href: article.url, children: 'view' });

  let modal_close = createElement('button', { class: 'modal_close', children: "X" });

  modal_close.addEventListener("click", modalClose)

  if (modal_wrap !== null) {
    modal_wrap.appendChild(modal_content);
    modal_content.appendChild(modal_close);
    modal_content.appendChild(mNews_title);
    modal_content.appendChild(mNews_author);
    modal_content.appendChild(mNews_content);
    modal_content.appendChild(mNews_view);
  }
}

interface Attritype {
  class:string;
  children:string;
  href: string;
}

// {className, onClick, src, innerText}
function createElement(elementTag: string, attributes: Record<string, string>): HTMLElement {
  const element = document.createElement(elementTag);
  const { children, ...rest } = attributes ?? {}

  Object.keys(rest ?? {}).forEach(key => {
    const value =rest[key];
    element.setAttribute(key, value);
  })

  if (children) {
    element.innerHTML = children;
  }
  return element
}

function modalClose(event: MouseEvent): void {
  let modal_content = document.querySelector(".modal_content")!;
  const target = event.target as HTMLElement;
  if (target && target.className === "modal_close") {
    modal_wrap.removeChild(modal_content);
    modal_wrap.style.display = 'none';
  }
}

function modalOpen(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target && target.className) {
    modal_wrap.style.display = "block";
  }
}

//intersection observer
const observer = new IntersectionObserver(callback, { threshold: 0.5 });

function callback(entries: IntersectionObserverEntry[], observer:IntersectionObserver): void {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log("뷰포트가 뉴스리스트의 50%까지 교차 되었음");
      printNews(keyword);
      observer.disconnect();
    }
  })
}

function observerItem(observe: IntersectionObserver, newsArray: HTMLElement[]): void {
  console.log(newsArray.length);
  const lastItem = newsArray[Math.ceil(newsArray.length - Number(newsArray.length / 2))];
  observe.observe(lastItem);
  page++;
}

