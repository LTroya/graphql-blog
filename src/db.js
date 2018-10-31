const users = [
    {id: '4', name: 'Marihec', email: 'mpinto@gmail.com', age: 25},
    {id: '1', name: 'Kelly', email: 'kmaestre@gmail.com', age: 25},
    {id: '2', name: 'Daniella', email: 'daniella@gmail.com', age: 23},
    {id: '3', name: 'Luis', email: 'luis@gmail.com', age: null},
];

const posts = [
    {id: '1', title: 'Subida al cerro San cristobal', body: 'Compromiso para los fines de semana', published: false, author: '1'},
    {id: '2', title: 'Compra del switch mas juegos', body: 'Espero que este a 200.000 mil pesos', published: false, author: '4'},
    {id: '3', title: 'Ir a trabajar y seleccionar el dia libre que necesito', body: 'Lo mas probable es que sea el viernes para morir jugando', published: false, author: '4'},
];

const comments = [
    {id: '1', text: 'This is my first comment in this page', author: '1', post: '1'},
    {id: '2', text: 'I want the switch, right now!', author: '2', post: '1'},
    {id: '3', text: 'The first game I will buy will be Mario Odyssey!', author: '2', post: '3'},
    {id: '4', text: 'My second game will be Xenoblade 2, others are just optionals!', author: '3', post: '3'}
];

const db = {users, posts, comments}

export {db as default};