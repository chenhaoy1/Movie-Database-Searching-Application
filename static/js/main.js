var imageUrl = 'https://image.tmdb.org/t/p';
var mv_genres = {
    28:'Action',
    12:'Adventure',
    16:'Animation',
    35:'Comedy',
    80:'Crime',
    99:'Documentary',
    18:'Drama',
    10751:'Family',
    14:'Fantasy',
    36:'History',
    27:'Horror',
    10402:'Music',
    9648:'Mystery',
    10749:'Romance',
    878:'Science Fiction',
    10770:'TV Movie',
    53:'Thriller',
    10752:'War',
    37:'Western'
}
var tv_genres = {
    10759:'Action & Adventure',
    16:'Animation',
    35:'Comedy',
    80:'Crime',
    99:'Documentary',
    18:'Drama',
    10751:'Family',
    10762:'Kids',
    9648:'Mystery',
    10763:'News',
    10764:'Reality',
    10765:'Sci-Fi & Fantasy',
    10766:'Soap',
    10767:'Talk',
    10768:'War & Politics',
    37:'Western'
}
function search() {
    var req = new XMLHttpRequest();
    if (!document.getElementById("name").value.replace(/\s/g, '').length){
        
        alert("Please enter valid values.");
        return;
    }
    req.onreadystatechange = function()
    
    {
        if(this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);
        document.getElementById('search-result').style.display="block";
        var user_input = {
            keyword: document.getElementById("name").value,
            category: document.getElementById("category").value,
        };
        if (!user_input.keyword || !user_input.category){
            alert("Please enter valid values.");
            return;
        }
        var data = res["Result"];
       
        if (user_input.category === 'tv') {
            showTv(data);
        } else if (user_input.category === 'movie') {
            showMovies(data);
        } else if (user_input.category === 'multi') {
            showTvAndMovies(data);
        }
    }
        

     
        
    }

    req.open('GET', "/api?x=" + document.getElementById('name').value + "&y=" + document.getElementById('category').value, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
}

function tvtrend_ajax() {
    var req = new XMLHttpRequest();
    var result = document.getElementById('result');
    req.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            
            var data = res["result"]
            html = `<div class="lunbo" id = "tv">`;
            data.forEach(function (item, index) {
                html += `
              <div class="lunbotu">
                
                <img src="${imageUrl}/w780/${item.backdrop_path}"  />
                
                <div class="home-image-title" >
                  ${item.name} (${item.first_air_date.slice(0,4)})
                </div>
              </div>
                `;
              });
              html += `
              </div>
              `;
              
              document.getElementById('tVOnAir').innerHTML = html;
              Carousel('tv', 3000);
        } 
    }

    req.open('GET', '/tvtrend', true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
}

function mvtrend_ajax() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            
            var data = res["result"]
            var html = `<div class="lunbo" id = "mv">`;
            data.forEach(function (item, index) {
                html += `
              <div class="lunbotu">
                
                <img src="${imageUrl}/w780/${item.backdrop_path}"  />
                
                <div class="home-image-title" >
                  ${item.title} (${item.release_date.slice(0,4)})
                </div>
              </div>
                `;
              });
              html += `
              </div>
              `;
              
              document.getElementById('trend_movie').innerHTML = html;
              Carousel('mv', 3000);
        }
    }
    req.open('GET', '/mvtrend', true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
}

function clearButton() {
    document.getElementById("myForm").reset();
}

function Carousel(div_id, times) {
    var img = document.getElementById(div_id).getElementsByClassName('lunbotu');
    var n = 0;

    function lunbofun() {
        for (var i = 0; i < img.length; i++) {
        img[i].style.display = 'none';
        }
        img[n].style.display = 'block';
        
    }

    function start() {
        n++;
        if (n >= img.length) {
        n = 0;
        }
        lunbofun();
        
    }
    setInterval(start, times || 3000);
}

function init(){
    mvtrend_ajax();
    tvtrend_ajax();
}

function searchpage(){
    document.getElementById("Home").style.display="none";
    document.getElementById("Search").style.display="block";
    document.getElementById("homebutton").style.borderBottom="none";
    document.getElementById("searchbutton").style.borderBottom="1px white solid";
    document.getElementById("searchbutton").style.color="red";
    document.getElementById("homebutton").style.color="white";
}

function homepage(){
    document.getElementById("Search").style.display="none";
    document.getElementById("Home").style.display="block";
    document.getElementById("searchbutton").style.borderBottom="none";
    document.getElementById("homebutton").style.borderBottom="1px white solid";
    document.getElementById("homebutton").style.color="red";
    document.getElementById("searchbutton").style.color="white";

    
}



function clearValue() {
    document.getElementById('name').value = '';
    document.getElementById('category').value = '';
    document.getElementById('search-result').style.display="none";

}

function showMovies(data) {
    
    if (!data || data.length == 0){
        noDataFound();
        return;
    }

    var html = `<div class="search-item font-size-20" style="padding-top:10px; padding-bottom:10px;"> Showing results...</div>`;
  data.forEach(function (row, index) {
    html += getMoviesItemHtml(row, index);
  });
  html += `<div style = "padding-top:60px;"></div>`
  document.getElementById('search-result').innerHTML = html;
}

function getMoviesItemHtml(row, index){
    var release_date = new Date(row.release_date).getFullYear();
    var IDS = row.genre_ids;
    var img = row.poster_path ? `<img src="https://image.tmdb.org/t/p/w185/${row.poster_path}" alt="a" width="185">` : `<img src="static/movie_placeholder.png" alt="a" width="185" height="278">`;
    var ID = '';
    IDS.forEach(function (item, index){
        if (index !== IDS.length-1){
            ID = ID + mv_genres[item] + ', ';
        }
        else {
            ID = ID + mv_genres[item];
        }
    });
    if (ID.length === 0){
      var ID = 'N/A';
    }
    var overview = row.overview;
   
    if (overview.length === 0){
      var overview = 'N/A';
    }
    var b = row.overview.replace(/'/g, '');
  return `
  
  <div class="row search-item">
  <div class="col-0 " style="border-left: 5px solid red; padding:10px;">
    ${img}
  </div>
  <div class="col-1 margin-left-20 margin-top-30">
    <div class="search-title font-bold">${row.title}</div>
    <div class="search-release-date font-size-14">${release_date} | ${ID} </div>
    <div class="search-vote font-size-13">
      <span style="color: red;">&#9733; ${(row.vote_average / 2).toFixed(2)}/5</span>
      <span style = "position: absolute;margin-top:-1px;margin-left:5px;">${row.vote_count} votes</span>
    </div>
    <div class="search-overview">
      ${overview}
    </div>
    <div class="row" style="padding-top:30px;">
    <div class="search-show-more" data='${b}' onclick="showMoviesMore(this, ${row.id},${index})">Show more</div>
    </div>
  </div>
</div>
<br> 
  `;
}

function noDataFound(){
    var html = `
    <div class="row">

      <div class="col-1 text-center" style="padding-top: 70px">No results found.</div>
    </div>
  `;
  if (document.getElementById('search-result')) {
    document.getElementById('search-result').innerHTML = html;
  }
}

function showTv(data) {
    if (!data || data.length === 0){
        noDataFound();
        return;
    }
    var html = `<div class="search-item font-size-20" style="padding-top:10px; padding-bottom:10px;"> Showing results...</div>`;
  data.forEach(function (row, index) {
    html += getTvItemHtml(row, index);
  });
  html += `<div style = "padding-top:60px;"></div>`
  document.getElementById('search-result').innerHTML = html;
}

function getTvItemHtml(row, index){
    var release_date = new Date(row.first_air_date).getFullYear();
    var IDS = row.genre_ids;
    var img = row.poster_path ? `<img src="https://image.tmdb.org/t/p/w185/${row.poster_path}" alt="a" width="185">` : `<img src="static/movie_placeholder.png" alt="a" width="185" height="278">`;
    var ID = '';
    IDS.forEach(function (item, index){
        if (index !== IDS.length-1){
            ID = ID + tv_genres[item] + ', ';
        }
        else {
            ID = ID + tv_genres[item];
        }
    });
    if (ID.length === 0){
      var ID = 'N/A';
    }
    
    var overview = row.overview;
   
    if (overview.length === 0){
      var overview = 'N/A';
    }
    var b = row.overview.replace(/'/g, '');
  return `
  
  <div class="row search-item">
  <div class="col-0 " style="border-left: 5px solid red; padding:10px;">
    ${img}
  </div>
  <div class="col-1 margin-left-20 margin-top-30">
    <div class="search-title font-bold">${row.name}</div>
    <div class="search-release-date font-size-14">${release_date} | ${ID} </div>
    <div class="search-vote font-size-13">
      <span style="color: red;">&#9733; ${(row.vote_average / 2).toFixed(2)}/5</span>
      <span style = "position: absolute;margin-top:-1px;margin-left:5px;">${row.vote_count} votes</span>
    </div>
    <div class="search-overview">
      ${overview}
    </div>
    <div class="row" style="padding-top:30px;">
      <div class="search-show-more" data='${b}' onclick="showTvMore(this, ${row.id},${index})">Show more</div>
    </div>
  </div>
</div>
<br> 
  `;
}

function showTvAndMovies(data){
    if (!data || data.length === 0){
        noDataFound();
        return;
    }
    var html = `<div class="search-item font-size-20" style="padding-top:10px; padding-bottom:10px;"> Showing results...</div>`;
    data.forEach(function (row, index) {
        html += row.media_type == 'movie' ? getMoviesItemHtml(row, index) : getTvItemHtml(row, index);
    });
    html += `<div style = "padding-top:60px;"></div>`
    document.getElementById('search-result').innerHTML = html;
}

function showMoviesMore(source, id, index){
    document.getElementById('dialog').style.display = '';
    var req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);
        var details = res["details"];
        var credits = res["credits"];
        var reviews = res["reviews"];
        var item = source.getAttribute('data');
        
        var genres = details.genres
            .map(function (m) {
            return m.name;
            })
            .join(', ');
        var spoken_languages = details.spoken_languages
            .map(function (m) {
              return m.english_name;
            })
            .join(', ');
        
        var release_date = new Date(details.release_date).getFullYear();
        var cast_html = build_cast(credits);
        var reviews_html = build_reviews(reviews);
        var movie_homepage = 'https://www.themoviedb.org/movie/' + id;
        var img = details.backdrop_path ? `<img src="https://image.tmdb.org/t/p/w780/${details.backdrop_path}" />` : `<img src="static/movie-placeholder.jpg">`;
        if (spoken_languages.length === 0){
          var spoken_languages = 'N/A';
        }
        if (genres.length === 0){
          var genres = 'N/A';
        }
       
        var title = details.title;
        if (title.length === 0){
          var title = 'N/A';
        }
        if (item.length === 0){
          var item = 'N/A'
        }
        
        var html = `
        <div>
        ${img}
        <div class="detail-title font-size-26 margin-top-20 margin-bottom-20" style="font-family:Arial;">${title} <a href="${movie_homepage}" target="_blank"><div class="icon">&#9432;</div></a> </div>
        <div class="detail-release-date">${release_date} | ${genres}</div>
        <div class="detail-vote" style="font-size:12px; padding-top:5px;">
            <span style="color: red;">&#9733; ${(details.vote_average / 2).toFixed(2)}/5</span>
            <span>${details.vote_count} votes</span>
        </div>
        <div class="detail-overview" style="padding-top:20px;">
            ${item}
        </div>
        <div class="detail-overview">
        <em>Spoken languages:  ${spoken_languages}</em>
        </div>
        <div style="margin-top:50px;></div>
        <div class="detail-cast-body">
            ${cast_html}
        </div>

        <div class="detail-reviews-body">
            ${reviews_html}
        </div>
        </div>
        `;

        document.getElementById('dialog').style.display = '';
        document.getElementById('dialogDetail').innerHTML = html;
    }
    }
    req.open('GET', "/mvinfo?" + "x="+id, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
}

function showTvMore(source, id, index){
    document.getElementById('dialog').style.display = '';
    var req = new XMLHttpRequest();
    req.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);
        var details = res["details"];
        var credits = res["credits"];
        var reviews = res["reviews"];
        var item = source.getAttribute('data');
        
        var genres = details.genres
            .map(function (m) {
            return m.name;
            })
            .join(', ');
        var spoken_languages = details.spoken_languages
            .map(function (m) {
              return m.english_name;
            })
            .join(', ');
        if (spoken_languages.length === 0){
          var spoken_languages = 'N/A';
        }
        if (genres.length === 0){
          var genres = 'N/A';
        }
        
        var title = details.name;
        if (title.length === 0){
          var title = 'N/A';
        }
        if (item.length === 0){
          var item = 'N/A'
        }
        var release_date = new Date(details.first_air_date).getFullYear();
        var cast_html = build_cast(credits);
        var reviews_html = build_reviews(reviews);
        var movie_homepage = 'https://www.themoviedb.org/movie/' + id;
        var img = details.backdrop_path ? `<img src="https://image.tmdb.org/t/p/w780/${details.backdrop_path}" />` : `<img src="static/movie-placeholder.jpg">`;
        var html = `
        <div>
        ${img}
        <div class="detail-title font-size-26 margin-top-20 margin-bottom-20" style="font-family:Arial;">${title} <a href="${movie_homepage}" target="_blank"><div class="icon">&#9432;</div></a> </div>
        <div class="detail-release-date">${release_date} | ${genres}</div>
        <div class="detail-vote" style="font-size:12px; padding-top:5px;">
            <span style="color: red;">&#9733; ${(details.vote_average / 2).toFixed(2)}/5</span>
            <span>${details.vote_count} votes</span>
        </div>
        <div class="detail-overview" style="padding-top:20px;">
            ${item}
        </div>
        <div class="detail-overview">
        <em>Spoken languages:  ${spoken_languages}</em>
        </div>
        <div style="margin-top:50px;></div>
        <div class="detail-cast-body">
            ${cast_html}
        </div>

        <div class="detail-reviews-body">
            ${reviews_html}
        </div>
        </div>
        `;

        document.getElementById('dialog').style.display = '';
        document.getElementById('dialogDetail').innerHTML = html;
    }
    }
    req.open('GET', "/tvinfo?x=" + id, true);
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send();
}

function build_cast(castList) {
    var html = `
    <div class="font-bold font-size-20 margin-top-10 margin-bottom-10" style="font-family:Arial;">
      Cast
    </div>
    <div class="detail-cast-body-info">
  `;
  if (castList.length === 0){
    html += `
    <div style="padding-top:20px;">N/A</div>
    `;
    return html;
  }
  
    castList.forEach(function (item) {
      var img = item.profile_path
        ? `<img src="https://image.tmdb.org/t/p/w185/${item.profile_path}"  width="180" height="278"/>`
        : `<img src="static/person-placeholder.png" alt="a" width="180" height="278">`;
        var itemname = item.name;
        if (itemname.length === 0){
          var itemname = 'N/A';
        }
        var cha = item.character;
        if (cha.length === 0){
          var cha = 'N/A';
        }
      html += `
        <div class="detail-cast-item">
          ${img}
          <div class="text-center">
            <div class="font-bold show-one-line" style="font-size:14px;" >${itemname}</div>
            <div style="font-size:14px;">AS</div>
            <div class="show-one-line" style="font-size:14px;">${cha}</div>
          </div>
        </div>
      `;
    });
  
    html += `
    </div>
    `;
  
    return html;
}

function build_reviews(list){
    var html = `
  <div class="font-bold font-size-20 margin-top-50 margin-bottom-20" style="font-family:Arial;">
    Reviews
  </div>
  `;
  if (list.length === 0){
    html += `
    <div style="padding-bottom:40px;padding-top:20px;">N/A</div>
    `;
    return html;
  }
  

  list.forEach(function (item) {
    var date = item.created_at.slice(5, 7) + '/' + item.created_at.slice(8, 10) + '/' + item.created_at.slice(0, 4);
    var rating = `<div > <span style="color: red;">&#9733; ${(item.rating / 2).toFixed(1)}/5</span></div>`;
    var username = item.username;
  if (username.length === 0){
    var username = 'N/A';
  }
  var content = item.content;
  if (content.length===0){
    var content = 'N/A';
  }
    html += `
    <div class="detail-reviews-item font-size-12" style="font-family:raleway">
      <div class="margin-bottom-10">
        <span class="font-bold">${item.username}</span>
        <span>on ${date}</span>
      </div>
      ${item.rating ? rating : ' '}
      <div>
        <span class="color:red"></span>
      </div>
      <div class="show-three-line" style="margin-bottom:10px;">
        ${content}
      </div>
      <div class="row margin-bottom-20" >
        <div style="width:80px"></div>
        <div class="col-1" style="border-top:2px solid #b6b6b6; "></div>
        <div style="width:80px"></div>
      </div>
    </div>
    `;
  });
  html += `
  <br>
  <br>
  `;
  return html;
}

function closeDialog() {
    if (document.getElementById('dialogDetail')) {
      document.getElementById('dialogDetail').innerHTML = '';
    }
    if (document.getElementById('dialogDetail')) {
      document.getElementById('dialog').style.display = 'none';
    }
}