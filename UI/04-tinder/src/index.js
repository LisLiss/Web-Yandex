let curCat = 1;

function buttonNextImg() {
  if (curCat === 10) {
    curCat = 0;
    document.getElementsByClassName('cat-0')[0].style.display = 'block';
    document.getElementsByClassName('blueButton')[0].style.display = 'none';
    document.getElementsByClassName('blueButton')[1].style.display = 'none';
  } else {
    document.getElementsByClassName('blueButton')[0].style.display = 'block';
    document.getElementsByClassName('blueButton')[1].style.display = 'block';
    curCat++;
    document.getElementsByClassName(`cat-${curCat}`)[0].style.display = 'block';
  }
}

function clickButton(color, type) {
  switch (type) {
    case 'no':
      setTimeout(function() {
        document.getElementsByClassName('blueButton')[0].style.boxShadow = `0 0 10px #ff4f67`;
        setTimeout(function() {
          document.getElementsByClassName('blueButton')[0].style.boxShadow = `0 0 10px black`;
        }, 1000);
      }, 0);
      break;
    case 'yes':
      setTimeout(function() {
        document.getElementsByClassName('blueButton')[1].style.boxShadow = `0 0 10px #ff4f67`;
        setTimeout(function() {
          document.getElementsByClassName('blueButton')[1].style.boxShadow = `0 0 10px black`;
        }, 1000);
      }, 0);
      break;
    case 'heart':
      setTimeout(function() {
        document.getElementsByClassName('pinkButton')[0].style.boxShadow = `0 0 10px #ff4f67`;
        setTimeout(function() {
          document.getElementsByClassName('pinkButton')[0].style.boxShadow = `0 0 10px black`;
        }, 1000);
      }, 0);
      break;
  }
  setTimeout(function() {
    let nowCat = curCat;
    document.getElementsByClassName(`cat-${nowCat}`)[0].style.background = color;
    document.getElementsByClassName(`cat-${nowCat}`)[0].style.backgroundSize = 'contain';
    document.getElementsByClassName(`cat-${nowCat}`)[0].style.zIndex = '1000';
    switch (type) {
      case 'no':
        let transforming1 = document.getElementsByClassName(`img-${nowCat}`)[0].animate([
          {},
          { transform: 'translate(-100%, 0)', opacity: '0' }
        ], 1000);
        transforming1.addEventListener('finish', function() {
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.display = 'none';
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.zIndex = '0';
        });
        break;
      case 'yes':
        let transforming2 = document.getElementsByClassName(`img-${nowCat}`)[0].animate([
          {},
          { transform: 'translate(100%, 0)', opacity: '0' }
        ], 1000);
        transforming2.addEventListener('finish', function() {
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.display = 'none';
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.zIndex = '0';
        });
        break;
      case 'heart':
        let transforming3 = document.getElementsByClassName(`img-${nowCat}`)[0].animate([
          {},
          { transform: 'translate(0, -100%)', opacity: '0' }
        ], 1000);
        transforming3.addEventListener('finish', function() {
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.display = 'none';
          document.getElementsByClassName(`cat-${nowCat}`)[0].style.zIndex = '0';
        });
    }
    document.getElementsByClassName(`cat-${nowCat}`)[0].animate([
      {},
      { opacity: '0' }
    ], 1000);
    buttonNextImg();
  }, 0);
}

function makeListener(num) {
  let x, y, endX, endY;
  document.getElementsByClassName(`cat-${num}`)[0].addEventListener('touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    x = event.changedTouches[0].pageX;
    y = event.changedTouches[0].pageY;
  }, false);
  document.getElementsByClassName(`cat-${num}`)[0].addEventListener('touchend', function(event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;
    let width = document.getElementsByClassName(`img-${num}`)[0].width;
    if (Math.abs(x - endX) > width / 3 || Math.abs(y - endY) > width / 3) {
      if (Math.abs(x - endX) > Math.abs(y - endY)) {
        if (x > endX) {
          clickButton('black', 'no');
        } else {
          clickButton('#ff4f67', 'yes');
        }
      } else {
        clickButton('#f9fa7f', 'heart');
      }
    }
  }, false);
}

function swipe() {
  for (let i = 1; i < 11; i++) {
    makeListener(i);
  }
}
