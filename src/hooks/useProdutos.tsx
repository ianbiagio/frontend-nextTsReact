import { useContext } from 'react'
import { ProdutosContext } from 'src/context/ProdutosContext'

export const useProdutos = () => useContext(ProdutosContext)
