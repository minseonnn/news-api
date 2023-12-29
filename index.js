const searchForm = document.querySelector("#search_form");
const searchInput = searchForm.querySelector("#search_input");
const searchDate = searchForm.querySelector("#search_date");
const searchBtn = searchForm.querySelector("#search_btn");

const newsBox = document.querySelector(".news_box");
const newsList =document.querySelector(".news_list");

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
    data.articles.forEach(article => {
      // ul 안에 그려 줄 new item 
      let li = document.createElement("li");
      li.className = "news_li";
      newsList.appendChild(li);
      //기사 이미지 링크
      let thumbnail_a = document.createElement('a');
      thumbnail_a.setAttribute('href',article.url);
      thumbnail_a.setAttribute('target','_blank');
      thumbnail_a.className = "thumbnail_a"
      li.appendChild(thumbnail_a);
      //기사 제목 링크
      let title_a = document.createElement('a');
      title_a.setAttribute('href',article.url);
      title_a.setAttribute('target','_blank');
      title_a.className = "title_a"
      li.appendChild(title_a);
      // 뉴스 썸네일
      if(article.urlToImage !== null) {
        let thumbnail = document.createElement('div');
        thumbnail.className = "news_thumbnail";
        let thumbnail_img = document.createElement('img');
        thumbnail_img.setAttribute('src', article.urlToImage);
        thumbnail_a.appendChild(thumbnail);
        thumbnail.appendChild(thumbnail_img);
      }
      //뉴스 타이틀
      let title = document.createElement('div');
      title.innerText = article.title;
      title.className = "news_title";
      title_a.appendChild(title)
      //뉴스 내용(description)
      let content = document.createElement('div');
      content.innerText = article.description;
      title.appendChild(content);

    });
  }).catch(error => console.error(error.message));


};


searchForm.addEventListener("submit", handleForm);
