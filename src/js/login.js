$(document).ready(function () {

  $(function () {
    $('#login-form-link').click(function (e) {
      $("#login-form").delay(100).fadeIn(100);
      $("#register-form").fadeOut(100);
      $('#register-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
      $("#register-form").delay(100).fadeIn(100);
      $("#login-form").fadeOut(100);
      $('#login-form-link').removeClass('active');
      $(this).addClass('active');
      e.preventDefault();
    });

  });

  $('#login-submit').click(login);
  $('#register-submit').click(createUser);
  $('#button-logout').click(logout);

  function login(e) {
    e.preventDefault();
    

    let email = $('#login-email').val();
    let password = $('#login-password').val();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (response) {
        window.location = `feed.html?id=${response.user.uid}`;
      })
      .catch(function (error) {
        let errorMessage = error.message;
        bootbox.alert(`Erro: ${errorMessage}`);
      })

    $('.register-submit').submit(function () {
      if ($('.login-password').val() == null || $('.login-submit').val() == "") {
        bootbox.alert('Campos Obrigatórios.');
        return false;
      }
    });
  }

  function createUser(e) {
    e.preventDefault();
    

    let newUserName = $('#name').val();
    let newUserDate = $('#age').val();
    let email = $('#email').val();
    let password = $('#password').val();
    let newUserConfirmPass = $('#confirm-password').val();

    if (password === newUserConfirmPass) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (response) {
          let userId = response.user.uid;
          firebase.database().ref(`users/${userId}`).set({
            name: newUserName,
            email: email,
            date: newUserDate,
            pic: 'https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png'
          }).then(function () {
            window.location = `presentation.html?id=${userId}`;
          })
        })
        .catch(function (error) {
          let errorMessage = error.message;
          if (errorMessage == 'auth/weak-password') {
            bootbox.alert('Erro: a senha é muito fraca.');
          } else {
            bootbox.alert(`Erro: ${errorMessage}`);
          }
        })
    } else {
      bootbox.alert('Senhas digitadas não correspondem entre si. Digite novamente.');
    }
  }

  const authGoogleButton = $('#authGoogleButton')

  $('#authGoogleButton').click(function (event) {
    event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
  });

  const authFacebookButton = $("#authFacebookButton")

  $('#authFacebookButton').click(function (event) {
    event.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
  });

  function signIn(provider) {
    firebase.auth()
      .signInWithPopup(provider)
      .then(function (result) {
        let token = result.credential.accessToken;
        let user = result.user;
        window.location = `presentation.html?id=${user.uid}`;
      }).catch(function (error) {
        bootbox.alert('Falha na autenticação');
      });

  }

  function logout() {
    firebase.auth()
      .signOut()
      .then(function () {
        window.location = `index.html`;
      })
  }

});

