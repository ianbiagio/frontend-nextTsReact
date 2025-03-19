// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import categoriaProdutos from 'src/configs/categoriaProdutos'
import authConfig from 'src/configs/auth'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { CategoriaProdutosValuesType, CategoriaProdutosParams, ErrCallbackType, CategoriaProdutosDataType } from './types'
import { boolean } from 'yup'

// ** Defaults
const defaultProvider: CategoriaProdutosValuesType = {
  loading: true,
  setLoading: () => Boolean,
  storeCategoriaProduto: () => Promise.resolve(),
  updateCategoriaProduto: () => Promise.resolve(),
  indexCategoriaProduto: () => Promise.resolve(),
  deleteCategoriaProduto: () => Promise.resolve(),
  setCategorias: () => null,
  categoria: [],
  setDeleteSuccess: () => Boolean,
  deleteSuccess: false
}

const CategoriaProdutosContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const CategoriaProdutosProvider = ({ children }: Props) => {
    // ** States
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(defaultProvider.deleteSuccess)
    const [categoria, setCategorias] = useState<CategoriaProdutosDataType[] >(defaultProvider.categoria)

    // ** Hooks
    const router = useRouter()
    const auth = useAuth()
    
    // **Token
    const storedToken = auth.token
   
    const indexCategoriaProduto = (errorCallback?: ErrCallbackType) => {
        setLoading(true)
        axios
        .get(categoriaProdutos.categoriaProdutosEndPoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          setLoading(false)
          setCategorias(response.data)
        })
        .catch((err) => {
          setLoading(false)
          if (errorCallback) errorCallback(err)
        })
    }

    const storeCategoriaProduto = (params: CategoriaProdutosParams, errorCallback?: ErrCallbackType) => {
      axios
        .post(categoriaProdutos.categoriaProdutosEndPoint, params,{
          headers: {
            Authorization: `Bearer ${storedToken}`
        }
        })
        .then(async response => {
          setCategorias(response.data)
        })
  
        .catch(err => {
          const errorMessage = err.response?.data?.error || 'Erro ao criar categoria'
          if (errorCallback) errorCallback({ message: errorMessage })
        })  
    }

    const updateCategoriaProduto = (id: number, params: CategoriaProdutosParams, errorCallback?: ErrCallbackType) => {
      axios
        .put(`${categoriaProdutos.categoriaProdutosEndPoint}/${id}`, params, {
          headers: {
            Authorization: `Bearer ${storedToken}`
        }
        })
        .then(async response => {
          setCategorias(response.data)
        })
  
        .catch(err => {
          if (errorCallback) errorCallback(err)
        })  
    }

    const deleteCategoriaProduto = (id: number, errorCallback?: ErrCallbackType) => {
      axios
        .delete(`${categoriaProdutos.categoriaProdutosEndPoint}/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(async response => {
          setCategorias(response.data)
          setDeleteSuccess(true)
        })
        .catch(err => {
          setDeleteSuccess(false)
          const errorMessage = err.response?.data?.error || 'Erro ao excluir a categoria'
          if (errorCallback) errorCallback({ message: errorMessage })
        })  
    }    
  
    const values = {
        loading,
        categoria,
        setCategorias,
        setLoading,
        indexCategoriaProduto: indexCategoriaProduto,
        storeCategoriaProduto: storeCategoriaProduto,
        updateCategoriaProduto: updateCategoriaProduto,
        deleteCategoriaProduto: deleteCategoriaProduto,
        deleteSuccess,setDeleteSuccess
    }

    return <CategoriaProdutosContext.Provider value={values}>{children}</CategoriaProdutosContext.Provider>
}

export { CategoriaProdutosContext, CategoriaProdutosProvider }
