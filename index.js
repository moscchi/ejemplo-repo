const d = document,
      table = d.querySelector(".crud-table"),
      form = d.querySelector(".crud-form"),
      title = d.querySelector(".crud-title"),
      template = d.getElementById("crud-template").content,
      fragment = d.createDocumentFragment();

const ajax = (options) => {
    let { url, method, success, error, data } = options; //desestructuracion: Te permite ingresar a los valores de un objeto directamente
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
        let json = JSON.parse(xhr.responseText);
        success(json);
    } else {
        let message = xhr.statusText || "Ocurrió un error";
        error(`Error ${xhr.status}: ${message}`);
    }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
}

const getAll = () => {
    ajax({
    url: "http://localhost:3000/pokemons",
    method: 'GET',
    success: (res) => {
        console.log(res);

        res.forEach(el => {
        template.querySelector(".name").textContent = el.name;
        template.querySelector(".type").textContent = el.type;
        template.querySelector(".edit").dataset.id = el.id;
        template.querySelector(".edit").dataset.name = el.name;
        template.querySelector(".edit").dataset.type = el.type;
        template.querySelector(".delete").dataset.id = el.id;

        let clone = d.importNode(template, true);
        fragment.appendChild(clone);
        });

        table.querySelector("tbody").appendChild(fragment);
    },
    error: (err) => {
        console.log(err);
        table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
    }
    })
}

d.addEventListener("DOMContentLoaded", getAll);

//Evento submit (metodo POST y metodo PUT)
d.addEventListener("submit", e => {
    if (e.target === form) {
    e.preventDefault();
    if (!e.target.id.value) {
        //Create - POST
        ajax({
        url: "http://localhost:3000/pokemons",
        method: "POST",
        success: (res) => location.reload(),
        error: (err) => form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
            name: e.target.name.value,
            type: e.target.type.value
        }
        });
    } else {
        //Update - PUT
        ajax({
        url: `http://localhost:3000/pokemons/${e.target.id.value}`,
        method: "PUT",
        success: (res) => location.reload(),
        error: (err) => form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
            name: e.target.name.value,
            type: e.target.type.value
        }
        });
    }
    }
});

d.addEventListener("click", e => {
    if (e.target.matches(".edit")) {
        title.textContent = "Editar Pokemon";
        form.name.value = e.target.dataset.name;
        form.type.value = e.target.dataset.type;
        form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

    if (isDelete) {
        //Delete - DELETE
        ajax({
        url: `http://localhost:3000/pokemons/${e.target.dataset.id}`,
        method: "DELETE",
        success: (res) => location.reload(),
        error: (err) => alert(err)
        });
    }
    }
})
