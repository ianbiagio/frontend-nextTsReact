import { useContext } from 'react'
import { CategoriaProdutosContext } from 'src/context/CategoriaProdutosContext'

export const useCategoriasProdutos = () => useContext(CategoriaProdutosContext)
