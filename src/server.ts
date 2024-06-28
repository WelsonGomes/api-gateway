import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
const port = process.env.SERVICE_PORT;

//ROTAS DE PRODUTO
app.get('/Produto', async (req, res, next) => {
    const response = await axios.get("http://localhost:3001/Produto");
    return res.status(200).json(response.data);
});

app.post('/Produto', async (req, res, next) => {
    try {
        console.log(req.body);
        const resp = await axios.post(
          "http://localhost:3001/Produto",
          {
            nome: req.body.nome,
            descricao: req.body.descricao,
            qtdade: req.body.qtdade,
            valor: req.body.valor
          },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }
        );
        console.log('Resposta:', resp.data);
        return res.status(resp.status).json({msg: resp.data.msg});
      } catch (error) {
        console.error('Erro ao enviar produto:', error);
        throw error;
      };
});

app.delete('/Produto', async (req, res, next) => {
    try {
        console.log('ID: ' + req.query.id);
        const resp = await axios.delete(
          "http://localhost:3001/Produto?id="+req.query.id,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }
        );
        console.log('Resposta:', resp.data);
        return res.status(resp.status).json({msg: resp.data.msg});
      } catch (error) {
        console.error('Erro ao enviar produto:', error);
        throw error;
      };
});

app.put('/Produto', async (req, res, next) => {
    try {
        console.log('ID: ' + req.query.id);
        const resp = await axios.put(
          "http://localhost:3001/Produto?id="+req.query.id+"&qtd="+req.query.qtd,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }
        );
        console.log('Resposta:', resp.data);
        return res.status(resp.status).json({msg: resp.data.msg});
      } catch (error) {
        console.error('Erro ao enviar produto:', error);
        throw error;
      };
});

//ROTAS DE VENDA
app.get('/Venda', async (req, res, next) => {
    const response = await axios.get("http://localhost:3002/Venda");
    return res.status(200).json(response.data);
});

app.post('/Venda', async (req, res, next) => {
    try {
        // Primeiro, faça a requisição POST para registrar a venda
        const vendaResp = await axios.post(
          "http://localhost:3002/Venda",
          {
            produtoid: req.body.produtoid,
            qtdade: req.body.qtdade,
            valorproduto: req.body.valorproduto
          },
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }
        );
    
        let result = false;
        if (vendaResp) {
          console.log('Venda registrada com sucesso');
          // Depois, atualize o estoque do produto
          const produtoResp = await axios.put(
            "http://localhost:3001/Produto",
            {}, // Corpo vazio
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              },
              params: {
                id: req.body.produtoid,
                qtd: req.body.qtdade,
                op: 'subtrair'
              }
            }
          );
    
          console.log('Resposta da atualização do produto:', produtoResp.data);
          if (produtoResp.data.success) {
            result = true;
          }
        }
        console.log(vendaResp.data)
        return res.status(200).json({ msg: vendaResp.data.msg });
      } catch (error) {
        console.error('Erro ao processar venda:', error);
        return res.status(500).json({ msg: 'Erro interno ao processar a solicitação.' });
    }
});

app.delete('/Venda', async (req, res, next) => {
    try {
        // Primeiro, faça a requisição POST para registrar a venda
        const vendaResp = await axios.delete(
            "http://localhost:3002/Venda",
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              },
              params: {
                id: req.query.id,
              }
            }
          );

        let result = false;
        if (vendaResp) {
            const produtoid = vendaResp.data.produtoid;
            const qtd = vendaResp.data.qtd;
            console.log(produtoid, qtd)
          console.log('Venda cancelada com sucesso');
          // Depois, atualize o estoque do produto
          const produtoResp = await axios.put(
            "http://localhost:3001/Produto",
            {}, // Corpo vazio
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
              },
              params: {
                id: produtoid,
                qtd: qtd,
                op: 'soma'
              }
            }
          );
    
          console.log('Resposta da atualização do produto:', produtoResp.data);
          if (produtoResp.data.success) {
            result = true;
          }
        }
        console.log(vendaResp.data)
        return res.status(200).json({ msg: vendaResp.data.msg });
      } catch (error) {
        console.error('Erro ao processar venda:', error);
        return res.status(500).json({ msg: 'Erro interno ao processar a solicitação.' });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});