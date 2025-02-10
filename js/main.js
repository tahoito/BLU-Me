$(function () {
  let count = 0;

  function updateCounter() {
    
    if (count < 80) {
      speed = 10 + (count * 0.8); // 最初は速く、だんだん遅く
    } else if (count >= 80 && count < 90) {
      speed = 100 + (count - 80) * 1; // 80%から遅く
    } else {
      speed = 200 + (count - 90) * 5; // 90%からゆっくり
    }

    count++;
    $(".loading_txt").text(count + "%"); // 数字を更新

    if (count < 100) {
      setTimeout(updateCounter, speed);
    } else {
      setTimeout(function () {
        $(".loading_txt").text("BLU:Me"); // 100%後にBLU:Meを表示
        $(".loading_txt2").fadeIn(1000); 
          setTimeout(function () {
            $(".loader").fadeOut(500); // 全体をフェードアウト
            $("header, #search").fadeIn(1000); // ヘッダーと検索ボックスを表示
            startSlider();
          }, 1500); 
      }, 500);
    }
  }

  updateCounter(); // カウントアップ開始


  $(".loading_txt2").hide();
  $("header, #search, .slider").hide();
});




$(function () {
  // ウインドウの横幅を取得し、「windowWidth」に代入
  var windowWidth = $(window).width();
  // ウインドウの横幅が768px以下だったら
  if (windowWidth <= 768) {
    //masonryの発動条件を「$grid」に代入
    var $grid = $('.grid').masonry({
      itemSelector: '.itembox',
      percentPosition: true,
      columnWidth: 100,
    });
    // ウインドウの横幅が769px以上だったら
  } else {
    //masonryの発動条件を「$grid」に代入
    var $grid = $('.grid').masonry({
      itemSelector: '.itembox',
      percentPosition: true,
      columnWidth: 230,
    });
  }
  //class「filter-button」を持つ要素の子要素「li」に対して指定した回数を繰り返し処理
  $('.filter-button li').each(function () {
    //自分自身(class「filterbutton」を持つ要素の子要素「li」)がクリックされたら
    $(this).on('click', function (event) {
      //class「is-checked」を持つ要素からclas「is-checked」を削除
      jQuery('.is-checked').removeClass('is-checked active');
      //クリックされた要素にclass「is-checked」を付与
      $(this).addClass('is-checked active');
      //自分自身(クリックされた要素)の属性「ID」を取得し、「buttonName」に代入
      var buttonName = $(this).attr('id');
      //「buttonName」を「.buttonName」として「className」に代入
      var className = '.' + buttonName;
      //「buttonName」が「all」だったら（クリックされた要素)のIDが「all」だったら）
      if (buttonName == 'all') {
        //class「itembox」を持つ要素を200ミリ秒かけてフェードイン
        $('.itembox').fadeIn(200);
        //「buttonName」が「all」ではなかったら（クリックされた要素のIDが「all」ではなかったら）
      } else if (buttonName === 'men-filter') {
        $('.itembox').hide(); // すべて非表示
        $('.itembox.men').fadeIn(200); // .men クラスを持つものだけ表示
      }
      // 「Women」ボタンが押されたら、レディーススタイルのみ表示
      else if (buttonName === 'women-filter') {
        $('.itembox').hide(); // すべて非表示
        $('.itembox:not(.men)').fadeIn(200); // .men クラスを持たないものを表示
      } else {
        //class「itembox」を持つがclass「className」を持たない要素を非表示にする
        $('.itembox').hide();
        //class「className」を持つ要素を200ミリ秒かけてフェードイン
        $('.itembox' + className).fadeIn(200);
      }
      //masonryを発動し、コンテンツの再配置を行う
      $grid.masonry('layout');
      event.stopPropagation();
    });
  });

  const likedImages = JSON.parse(localStorage.getItem("likedImages")) || {}; // ローカルストレージから読み込む
  const heart = document.getElementById("modal-favorite");
  const icon = heart.querySelector("i");

  // 画像クリックでモーダルを開く
  $('.itembox a').on('click', function (event) {
    event.preventDefault();

    var imgSrc = $(this).attr('href');
    var imgTitle = $(this).data('title');
    var imageId = $(this).data('id');

    $('#modal-img').attr('src', imgSrc);
    $('#modal-title').text(imgTitle);
    $('#modal').fadeIn(200);

    $('#modal').data('currentImageId', imageId);

    // ハートの状態を更新
    if (likedImages[imageId]) {
      heart.classList.add("active");
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      heart.classList.remove("active");
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  });

    // フィルター（お気に入りのみ表示）
    $('#filter-favorite1').on('click', function (event) {
      console.log("フィルターが押された！現在の likedImages:", likedImages);
  
      //class「is-checked」を持つ要素からclas「is-checked」を削除
      jQuery('.is-checked').removeClass('is-checked active');
      //クリックされた要素にclass「is-checked」を付与
      $(this).addClass('is-checked active');

      //$(this).toggleClass('active');
  
      if ($(this).hasClass('active')) {
        console.log("active");
        $('.itembox').hide(); // すべて非表示
        $('.itembox').each(function () {
          var imageId = $(this).find('a').data('id');
          if (likedImages[imageId]) {
            // fadeInする画像の確認
            console.log("fadeIn:"+imageId+":"+this.className);
            $(this).fadeIn(300);
          } else {
            // fadeOutする画像の確認
            console.log("fadeOut:"+imageId+":"+this.className);
            $(this).fadeOut(300);
          }
        });
        $(this).find('i').removeClass('fa-regular').addClass('fa-solid'); // アイコン変更
      } else {
        console.log("not active");
        $('.itembox').fadeIn(300);
        $(this).find('i').removeClass('fa-solid').addClass('fa-regular'); // アイコン戻す
      }
      $grid.masonry('layout');
      // event.stopPropagation();
    });

  // ハートを押した時の処理（いいね状態を保存）
  heart.addEventListener("click", () => {
    var imageId = $('#modal').data('currentImageId');

    if (!imageId) return;
    //console.log("imageId:"+imageId);
    heart.classList.toggle("active");

    if (heart.classList.contains("active")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
      likedImages[imageId] = true;
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
      //delete likedImages[imageId];
      likedImages[imageId] = false;
    }
    console.log(Object.keys(likedImages).length);

    localStorage.setItem("likedImages", JSON.stringify(likedImages)); // ローカルストレージに保存

  });

  // ページ読み込み時にフィルタリングを適用（ローカルストレージが空でなければ）
  $('.itembox').each(function () {
    var imageId = $(this).find('a').data('id');
    if (likedImages[imageId]) {
      $(this).find('i').removeClass('fa-regular').addClass('fa-solid');
    }
  });

});

/*scroll_effect*/
$(window).scroll(function () {
  var scrollAnimationElm = document.querySelectorAll('.scroll_up');
  var scrollAnimationFunc = function () {
    for (var i = 0; i < scrollAnimationElm.length; i++) {
      var triggerMargin = 100;
      if (window.innerHeight > scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin) {
        scrollAnimationElm[i].classList.add('on');
      }
    }
  }
  window.addEventListener('load', scrollAnimationFunc);
  window.addEventListener('scroll', scrollAnimationFunc);
});



/*スライド*/
function startSlider() {
  $(".slider").show();
    $('.slider')
    .slick({
      autoplay: true,
      infinite: true,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      speed: 2000,
      autoplaySpeed: 3000,
      pauseOnFocus: false,
      pauseOnHover: false
    })
    .on("beforeChange", function (event, slick, currentSlide, nextSlide) {
      $(".slick-slide", this).removeClass("slick-animation"); 
      $(".slick-slide", this).eq(nextSlide).addClass("slick-animation");
    });
}




/*スムーススクロール*/
$(function () {
  var topBtn = $('#page_top');
  topBtn.hide(); // 最初は非表示

  // スクロールイベント
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 100) {
      topBtn.fadeIn(); // 100px以上スクロールしたら表示
    } else {
      topBtn.fadeOut(); // 100px未満なら非表示
    }
  });

  // スムーススクロール
  topBtn.click(function (event) {
    event.preventDefault(); // デフォルトの動作を防ぐ
    $('html, body').animate({ scrollTop: 0 }, 500, "swing");
  });
});


/*ドロップダウンぼたん*/
// ボタンをクリックしたときにドロップダウンを表示/非表示
$(document).ready(function () {
  $(".gnavi__list").hover(
    function () {
      $(this).children(".dropdown__lists").stop(true, true).slideDown(200);
    },
    function () {
      $(this).children(".dropdown__lists").stop(true, true).slideUp(200);
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {

  // モーダルを閉じる
  $('#modal-close').on('click', function () {
    $('#modal').fadeOut(200);
  });


});




/*検索ボックス*/
$(function () {
  function searchItems() {
    var $grid = $('.grid');
    const searchTerm = $('#box').val() ?.toLowerCase().trim();
    const container = $('#itemContainer');


    if (!searchTerm || searchTerm === '') {
      // 🔹 入力が空の場合、すべての画像をフェードイン
      $('.itembox').fadeOut(200, function () {
        $(this).show().appendTo(container).fadeIn(200);
      });
      return;
    }

    const items = $('.itembox');
    let matchedItems = [];

    items.each(function (event) {
      const title = $(this).find('a').attr('data-title') ?.toLowerCase().trim();
      if (title && title.includes(searchTerm)) {
        matchedItems.push(this);
      } else {
        $(this).fadeOut(200); // 一致しないアイテムをフェードアウト
      }
      $grid.masonry('layout');
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }
    });

    console.log("一致したアイテム数:", matchedItems.length);

    if (matchedItems.length > 0) {
      $('.itembox').hide();
      $(matchedItems).show().fadeIn(200);
    } else {
      $('#itemContainer').html('<p style="text-align:center;">該当する画像がありません</p>');
    }
  }

  // 検索ボタンがクリックされたとき
  $('#btn').on('click', function (event) {
    event.preventDefault();
    searchItems();
  });

  // Enterキーで検索
  $('#box').on('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchItems();
    }
  });

  // 検索アイコンのトグル動作
  $('.search_bottom').on('click', function () {
    $('#search').prop('checked', function (i, val) {
      return !val;
    });
  });
});

$("#keyword").on("input", searchItems);






// 出展：株式会社シフトブレイン『jQuery最高の教科書』第6章