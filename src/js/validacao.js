$(document).ready( function() {
    $('#register-form').validate({
      rules:{ 
        name:{ 
          required: true,
          minlength: 3
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        },
        password_confirmation:{
          required: true,
          equalTo: "#password"
        }
      },
      messages:{
        name:{ 
          required: "O campo nome é obrigatório.",
          minlength: "O campo nome deve conter no mínimo 3 caracteres."
        },
        email: {
          required: "O campo email é obrigatório.",
          email: "O campo email deve conter um email válido."
        },
        password: {
          required: "O campo senha é obrigatório."
        },
        password_confirmation:{
          required: "O campo confirmação de senha é obrigatório.",
          equalTo: "O campo confirmação de senha deve ser identico ao campo senha."
        }
      }
    });
  });




