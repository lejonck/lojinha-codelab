const express = require('express');

//instancia da aplicação
const app = express();

//middleware para receber dados do cliente como json
app.use(express.json());

//"banco de dados"
let produtos = [];
let pedidos = [];
let saldoLoja = 0;

//rotas

app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

app.get('/saldo', (req, res) => {
    res.json({ saldo : saldoLoja});
});

app.post('/produtos', (req, res) => {
    const { nome, preco, estoque } = req.body;

    if(!nome || preco === undefined || estoque === undefined){
        return res.status(400).json({ mensagem : "Dados incompletos"});
    }

    const novoProduto = { id : produtos.length+1, nome, preco, estoque };
    produtos.push(novoProduto);
    res.status(201).json(novoProduto);

});

app.post('/pedidos', (req, res) => {
    const { produtoId, quantidade } = req.body;

    if(!produtoId || !quantidade){
        return res.status(400).json({ mensagem : "Dados incompletos do pedido "});
    }

    const produto = produtos.find(p => p.id === parseInt(produtoId));

    if(!produto){
        return res.status(404).json({ mensagem : 'Produto não encontrtado' });
    }

    if(produto.estoque < quantidade){
        return res.status(400).json( { mensagem : "Estoque insufiente do produto "});
    }

    produto.estoque -=quantidade;
    const valorTotal = produto.preco * quantidade;
    saldoLoja += valorTotal;

    const novoPedido = { id : pedidos.length + 1, produtoId, quantidade, valorTotal};
    pedidos.push(novoPedido);

    return res.status(201).json({ mensagem : "Pedido criado com sucesso", pedido : novoPedido});

});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    produtos = produtos.filter(p => p.id !== parseInt(id));
    res.status(204).send();
})

//incializando servidor 
//comunicação cliente e servidor é a porta
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});