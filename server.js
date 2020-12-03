// server.js
const jsonServer = require('json-server')
const server = jsonServer.create();
const db = require('./db');
const router = jsonServer.router(db());
const middlewares = jsonServer.defaults();
const { insertGroups, deleteGroup, deleteGroupById } = require('./utils/dataUtils');

const port = 3030;
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/api/groups/multipleAdd', (req, res) => {
    const addGroupItems = req.body.addGroupItems;
    console.log('addGroupItems=', addGroupItems);
    const group = insertGroups(require('./data/groups'), addGroupItems);
    //console.log(group);
    res.jsonp(group)
})

server.post('/api/groups/multipleDelete', (req, res) => {
    const deleteItem = req.body.deleteGroupItems;
    console.log('deleteItem=', deleteItem);
    const group = deleteGroup(require('./data/groups'), deleteItem);
    res.jsonp(group)
})
server.delete('/api/groups/:id', (req, res) => {
    const id = req.params.id;
    const group = deleteGroupById(require('./data/groups'), id);
    res.jsonp(group)
})

server.use(router);


server.listen(port, () => {
    console.log(`JSON Server is running http://127.0.0.1:${port}`)
})