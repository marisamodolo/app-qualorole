$(document).ready(function(){
  $("#filter").click(filterSelect)
  $('#home').click(undoFilter)
  const collectionEvent = db.collection('Eventos')
  createPost(collectionEvent, "iniciar", "todos")
})

function createPost(event, category, filter){
  $("#cardSpot").html("");
  $("#cardCommon").html("");

  event
  .where("importancia", "==", "destaque")
  .where(category, "==", filter)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const info = doc.data();
      const idPost = doc.id;
      $("#cardSpot").prepend(`
      <section class="card mb-3">
        <img class="card-img-top" src="${info.foto}" alt="Imagem de capa do card">
        <section class="card-body">
          <h5 class="card-title">${info.evento}</h5>
          <p class="card-text">${info.descrição}</p>
          <p class="card-text"><small class="text-muted">${info.endereço}</small></p>
          <a href="#" id-info=${idPost} class="btn btn-primary">Visitar</a>
        </section>
      </section>
      `)
    })
  })

  event
  .where("importancia", "==", "comum")
  .where(category, "==", filter)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      const info = doc.data();
      const idPost = doc.id;
      $("#cardCommon").prepend(`
      <section class="card" style="width: 18rem;">
        <img class="card-img-top" src="${info.foto}" alt="Imagem de capa do card">
        <section class="card-body">
          <h5 class="card-title">${info.evento}</h5>
          <p class="card-text">${info.descrição}</p>
          <a href="#" id-info=${idPost} class="btn btn-primary">Visitar</a>
        </section>
      </section>
      `)
    })
  })
}

function filterSelect(){
  const checkInput = document.getElementsByName("filter-check")
  for (let i of checkInput){
    if (i.checked) {
      createPost(collectionEvent, "categoria", i.id)
    } 
  } 
}

function undoFilter(){
  createPost(collectionEvent, "iniciar", "todos")
}

$(document).ready(function () {
  $('#button-logout').click(function() {
      window.location = `index.html?id=${USER_ID}`;
  })
})