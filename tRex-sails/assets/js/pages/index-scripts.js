var x = document.querySelector('.modal-body');

console.log(x);

var text = document.createTextNode('teste123');
x.appendChild(text);

$('#exampleModal').modal('show');