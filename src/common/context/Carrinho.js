import { createContext, useContext, useEffect, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'CarrinhoContext';

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);

  return (
    <CarrinhoContext.Provider 
      value={{ 
        carrinho, 
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho, quantidadeProdutos, setQuantidadeProdutos } = useContext(CarrinhoContext);

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

  useEffect(() => {
    const novaQuantidade = carrinho.reduce((contador, produto) =>
      contador + produto.quantidade, 0);
      setQuantidadeProdutos(novaQuantidade);
  },[carrinho, setQuantidadeProdutos])

  return {
    carrinho,
    setCarrinho,
    addProduto,
    removeProduto,
    quantidadeProdutos,
    setQuantidadeProdutos
  }
}