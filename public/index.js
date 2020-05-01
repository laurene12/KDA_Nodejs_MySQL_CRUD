if(document.getElementById('id')){
    const btn=document.querySelector('#btn');
    const id=document.querySelector('#id');

    if(id.value !==""){
        btn.textContent="Mis à jour";
        const form=document.querySelector("#form");
        form.action="/update";
    }

    
}