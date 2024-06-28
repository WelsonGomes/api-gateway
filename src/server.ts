import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
const port = 3000;

//ROTAS DE PRODUTO
app.get('/Produto', async (req, res, next) => {
    const response = await axios.get("http://54.200.107.107:3001/Produto");
    return res.status(200).json(response.data);
});

app.post('/Produto', async (req, res, next) => {
    try {
        console.log(req.body);
        const resp = await axios.post(
          "http://54.200.107.107:3001/Produto",
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
          "http://54.200.107.107:3001/Produto?id="+req.query.id,
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
          "http://54.200.107.107:3001/Produto?id="+req.query.id+"&qtd="+req.query.qtd,
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
    const response = await axios.get("http://52.37.16.114:3002/Venda");
    return res.status(200).json(response.data);
});

app.post('/Venda', async (req, res, next) => {
  try {
    const vendaResp = await axios.post(
      "http://52.37.16.114:3002/Venda",
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
    console.log(vendaResp.data);
    return res.status(200).json({ msg: vendaResp.data.msg });
  } catch (error) {
    console.error('Erro ao processar venda:', error);
    return res.status(500).json({ msg: 'Erro interno ao processar a solicitação.' });
  }
});

app.delete('/Venda', async (req, res, next) => {
  try {
    const vendaResp = await axios.delete(
      "http://52.37.16.114:3002/Venda",
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
    console.log(vendaResp.data);
    return res.status(200).json({ msg: vendaResp.data.msg });
  } catch (error) {
    console.error('Erro ao processar venda:', error);
    return res.status(500).json({ msg: 'Erro interno ao processar a solicitação.' });
  }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});