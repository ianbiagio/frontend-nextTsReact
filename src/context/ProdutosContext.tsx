// ** React Imports
import { createContext, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import produtosConfig from 'src/configs/produtosConfig'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { ProdutosValuesType, ProdutosParams, ErrCallbackType, ProdutosDataType } from './types'

// ** Defaults
const defaultProvider: ProdutosValuesType = {
  loading: true,
  setLoading: () => Boolean,
  storeProduto: () => Promise.resolve(),
  updateProduto: () => Promise.resolve(),
  indexProduto: () => Promise.resolve(),
  deleteProduto: () => Promise.resolve(),
  setProdutos: () => null,
  produtos: [],
  setDeleteSuccess: () => Boolean,
  deleteSuccess: false
}

const ProdutosContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ProdutosProvider = ({ children }: Props) => {
    // ** States
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(defaultProvider.deleteSuccess)
    const [produtos, setProdutos] = useState<ProdutosDataType[] >(defaultProvider.produtos)

    // ** Hooks
    const auth = useAuth()
    
    // **Token
    const storedToken = auth.token
   
    const indexProduto = (errorCallback?: ErrCallbackType) => {
        setLoading(true)
        axios
        .get(produtosConfig.produtosEndPoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          setLoading(false)
          setProdutos(response.data)
        })
        .catch((err) => {
          setLoading(false)
          if (errorCallback) errorCallback(err)
        })
    }

    const storeProduto = (params: ProdutosParams, errorCallback?: ErrCallbackType) => {
      axios
        .post(produtosConfig.produtosEndPoint, params,{
          headers: {
            Authorization: `Bearer ${storedToken}`
        }
        })
        .then(async response => {
          setProdutos(response.data)
        })
  
        .catch(err => {
          const errorMessage = err.response?.data?.error || 'Erro ao criar produto'
          if (errorCallback) errorCallback({ message: errorMessage })
        })  
    }

    const updateProduto = (id: number, params: ProdutosParams, errorCallback?: ErrCallbackType) => {
      axios
        .put(`${produtosConfig.produtosEndPoint}/${id}`, params, {
          headers: {
            Authorization: `Bearer ${storedToken}`
        }
        })
        .then(async response => {
          setProdutos(response.data)
        })
  
        .catch(err => {
          if (errorCallback) errorCallback(err)
        })  
    }

    const deleteProduto = (id: number, errorCallback?: ErrCallbackType) => {
      axios
        .delete(`${produtosConfig.produtosEndPoint}/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(async response => {
          setProdutos(response.data)
          setDeleteSuccess(true)
        })
        .catch(err => {
          setDeleteSuccess(false)
          const errorMessage = err.response?.data?.error || 'Erro ao excluir produto'
          if (errorCallback) errorCallback({ message: errorMessage })
        })  
    }    
  
    const values = {
        loading,
        produtos,
        setProdutos,
        setLoading,
        indexProduto: indexProduto,
        storeProduto: storeProduto,
        updateProduto: updateProduto,
        deleteProduto: deleteProduto,
        deleteSuccess,setDeleteSuccess
    }

    return <ProdutosContext.Provider value={values}>{children}</ProdutosContext.Provider>
}

export { ProdutosContext, ProdutosProvider }
