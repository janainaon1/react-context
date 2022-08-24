import { createContext, useContext, useEffect, useState } from 'react';
import { usePagamentoContext } from './Pagamento';
import { UsuarioContext } from './Usuario';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'CarrinhoContext';

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

  return (
    <CarrinhoContext.Provider 
      value={{ 
        carrinho, 
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinhoContext = () => {
  const { 
    carrinho, 
    setCarrinho, 
    quantidadeProdutos, 
    setQuantidadeProdutos, 
    valorTotalCarrinho, 
    setValorTotalCarrinho 
  } = useContext(CarrinhoContext);
  const { formaPagamento } = usePagamentoContext();
  const { setSaldo } = useContext(UsuarioContext);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map(itemCarrinho => {
      if (itemCarrinho.id === id && itemCarrinho.quantidade >= 0) itemCarrinho.quantidade += quantidade;
      return itemCarrinho;
    })
  }

  function addProduto(novoProduto) {
    const temOProduto = carrinho.some(itemCarrinho => itemCarrinho.id === novoProduto.id);
    if (!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto])
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1));
  }

  function removeProduto(id) {
    const produto = carrinho.find(itemCarrinho => itemCarrinho.id === id);
    const ehUltimo = produto.quantidade === 1;

    if (ehUltimo) {
      return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemCarrinho => itemCarrinho.id !== id))
    }
    setCarrinho(mudarQuantidade(id, -1))
  }

  function efeturarCompra() {
    setCarrinho([]);
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho);
  }

  useEffect(() => {
    const { novoTotal, novaQuantidade } = carrinho.reduce((contador, produto) =>
      ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
      }), {
        novoTotal: 0,
        novaQuantidade: 0
      });
      setQuantidadeProdutos(novaQuantidade);
      setValorTotalCarrinho(novoTotal * formaPagamento.juros);
  },[carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento])

  return {
    carrinho,
    setCarrinho,
    addProduto,
    removeProduto,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    efeturarCompra
  }
}