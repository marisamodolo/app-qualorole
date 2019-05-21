let database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function () {

  $('#logo-navbar, .home-navbar').attr('href', `feed.html?id=${USER_ID}`);
  $('#option-profile, #profile-pic-nav, .profile-navbar').attr('href', `profile.html?id=${USER_ID}`);
  $('#user-message').keyup(disableEnableButton);
  $('#btn-share').click(btnShare);
  $('#btn-show-textbox').click(btnShowTextbox);
  checkNumberPosts();

  database.ref(`users/${USER_ID}`).on('value', function (snapshot) {
    let user = snapshot.val();
    $('#navbar-dropdown').html(user.name);
    $('#profile-pic-navbar').attr('src', user.pic);
    database.ref(`posts/${USER_ID}`).once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        database.ref(`likes/${USER_ID}/${childKey}`).once('value', function (snapshot) {
          let countLikes = 0;
          if (snapshot.val()) {
            countLikes = snapshot.val().countLikes;
          }
          messagePost(childData.date, childData.message, user, childData.visibility, childKey, countLikes)
        })
      })
    })
  })

  $('#btn-search').click(function (e) {
    e.preventDefault();
    let input = $('#input-search');
    if (input.hasClass('hidden')) {
      input.removeClass('hidden');
    } else {
      input.addClass('hidden');
    }
  });

  $('#button-logout').click(logout);

  function messagePost(date, message, user, visibility, key, likes) {
    $('#posts-container').append(`
        <div class="card gedf-card marg" data-div="${key}" data-filter="${visibility}">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                    <a href="profile.html?id=${USER_ID}"><img class="profile-link rounded-circle profile-pic-posts" width="45"></a>
                    </div>
                    <div class="ml-2">
                    <a href="profile.html?id=${USER_ID}"><div class="color-text profile-link h5 m-0">${user.name}</div></a>
                        <div class="h7 text-muted">${user.status ? user.status : ""}</div>
                    </div>
                </div>
                <div>
                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="color-icons fa fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                            <a class="dropdown-item" data-toggle="modal" data-edit-id="${key}" data-target="#modal-edit">Editar</a>
                            <a class="dropdown-item" data-delete-id="${key}">Excluir</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="card-body">
            <div class="text-muted h7 mb-2">${date}</div>
    
            <p class="card-text" data-text-id="${key}">
                ${message}
            </p>
        </div>
        <div class="card-footer">
            <span class="color-icons likes-counter" id="likes-counter" data-counter-id="${key}">${likes}</span>
            <a href="#" class="color-icons card-link" id="btn-like" data-like-id="${key}"><i class="fa fa-gittip"></i> <span data-text-like="${key}">Curtir</span></a>
            <a href="#" class="color-icons card-link"><i class="fa fa-comment"></i> Comentar</a>
            <a href="#" class="color-icons card-link"><i class="fa fa-mail-forward"></i> Compartilhar</a>
        </div>
    </div>`);

    $('.profile-pic-posts').attr('src', user.pic);

    $(`a[data-like-id=${key}]`).click(function (e) {
      e.preventDefault();
      let currentKey = $(this).attr('data-like-id');
      let likesRef = `likes/${USER_ID}/${currentKey}`;
      let databaseLikesAddress = database.ref(`${likesRef}/users`);
      databaseLikesAddress.set({
        uid: USER_ID
      })
      databaseLikesAddress.once('value', function (snapshot) {
        let countLikes = snapshot.numChildren();
        database.ref(`${likesRef}`).update({
          countLikes: countLikes
        })
        $(`span[data-counter-id=${currentKey}]`).html(countLikes);
      });
    })

    $(`a[data-delete-id=${key}]`).click(function (e) {
      e.preventDefault();
      confirmRemove(key);
    });

    $(`a[data-edit-id=${key}]`).click(function () {
      $('#btn-send-modal').attr('data-send-id', key)
      database.ref(`posts/${USER_ID}/${key}`).once('value', function (snapshot) {
        $('#edit-post').val(snapshot.val().message);
      })
    })

    $('#btn-send-modal').click(function () {
      let currentKey = $(this).attr('data-send-id');
      let newMessage = $('#edit-post').val();
      database.ref(`posts/${USER_ID}/${currentKey}`).update({ 'message': newMessage });
      $(this).attr('data-dismiss', 'modal')
      $(`p[data-text-id=${currentKey}]`).html(newMessage);
    })

    checkNumberPosts();

  }

  function checkNumberPosts() {
    if ($('#posts-container').children().length <= 1) {
      $('#filter-posts').addClass('hidden').removeClass('d-flex');
    } else if ($('#filter-posts').hasClass('hidden')) {
      $('#filter-posts').removeClass('hidden').addClass('d-flex');
    }
  }

  function btnShowTextbox(e) {
    e.preventDefault();

    if (!$('#textbox').hasClass('gedf-card')) {
      $('#textbox').addClass('card gedf-card style-card');
      $('#textbox').removeClass('hidden2');
      $('#btn-show-textbox').html('<i class="fas fa-minus"></i>');
    } else {
      $('#textbox').removeClass('card gedf-card style-card');
      $('#textbox').addClass('hidden2');
      $('#btn-show-textbox').html('<i class="fas fa-plus"></i>');
    }
  }

  function btnShare(e) {
    e.preventDefault();
    let userText = $('#user-message').val();
    let dataPost = hourDate();
    let messageVisibility = 'public';
    if ($('#btnMessageVisibility').attr('data-filter') === 'private') {
      messageVisibility = 'private';
    }

    $('#user-message').val('');

    let postFromDB = database.ref(`posts/${USER_ID}`).push({
      message: userText,
      date: dataPost,
      visibility: messageVisibility
    });

    database.ref(`users/${USER_ID}`).once('value', function (snapshot) {
      let user = snapshot.val();
      messagePost(hourDate(), userText, user, messageVisibility, postFromDB.key, 0)
    });
    checkNumberPosts()
  }

  function confirmRemove(key) {
    bootbox.confirm({
      title: "Tem certeza que deseja excluir esse post?",
      message: "Se a exclusão for confirmada, não poderá ser desfeita.",
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancelar'
        },
        confirm: {
          label: '<i class="fa fa-check"></i> Confirmar'
        }
      },
      callback: function (result) {
        if (result) {
          $(`div[data-div=${key}]`).remove();
          database.ref('posts/' + USER_ID + "/" + key).remove();
          checkNumberPosts();
        }
      }
    });
  }

  function disableEnableButton() {
    if ($('#user-message').val().match(/\S+/)) {
      $('#btn-share').prop('disabled', false);
    } else {
      $('#btn-share').prop('disabled', true);
    }
  }

  function checkNumberDate(number) {
    if (number.length < 2) {
      number = `0${number}`;
    }
    return number;
  }

  function hourDate() {
    let datePost = new Date();
    let dayPost = datePost.getDate().toString();
    let monthPost = (datePost.getMonth() + 1).toString();
    let yearPost = datePost.getFullYear();
    let hourPost = datePost.getHours().toString();
    let minutesPost = datePost.getMinutes().toString();
    let hourMinutePost = `${checkNumberDate(dayPost)}/${checkNumberDate(monthPost)}/${yearPost} <i class="fa fa-clock-o"></i> ${checkNumberDate(hourPost)}h${checkNumberDate(minutesPost)}`;
    return hourMinutePost;
  }

  $('#btnMessageVisibility > a').on('click', function () {
    var visibility = $(this).attr('data-filter');

    $('#btnGroupDrop1 > i').removeClass('fa-globe');
    $('#btnGroupDrop1 > i').removeClass('fa-users');
    if (visibility === 'public') {
      $('#btnGroupDrop1 > i').addClass('fa-globe');
    } else {
      $('#btnGroupDrop1 > i').addClass('fa-users');
    }

    $('#btnMessageVisibility').attr('data-filter', visibility);
  });

  $('#btnFilterVisibility > a').on('click', function () {
    var visibility = $(this).attr('data-filter');

    $('#posts-container > div').each(function () {
      if ($(this).attr('data-filter')) {
        if (visibility === 'all' || $(this).attr('data-filter') === visibility) {
          $(this).show();
        } else {
          $(this).hide();
        }
      }
    });
  });
});