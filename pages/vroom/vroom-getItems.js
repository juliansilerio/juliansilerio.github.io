let pics = document.getElementsByClassName('product-img-wrapper');
let titles = document.getElementsByClassName('product-title');
let prices = document.getElementsByClassName('product-price');

let d = [];

for(let i = 0; i < pics.length; i++) {
    let picSrc = pics[i].firstElementChild.currentSrc;
    let title = titles[i].textContent;
    let price = prices[i].textContent;
    d.push([picSrc, title, price])
}


var jsonD = JSON.stringify(d);
//console.log(jsonD)