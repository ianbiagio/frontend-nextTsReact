export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  email: string
  password: string
  role: string
  username: string
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type CategoriaProdutosDataType = {
  id_categoria_planejamento: number
  nome_categoria: string
}

export type ProdutosDataType = {
  id_produto: number
  id_categoria_produto: number
  nome_produto: string
  valor_produto: number
  nome_categoria: string,
  id_categoria_planejamento: number
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  token: string | null
}

export type CategoriaProdutosParams = {
  nomeCategoria: string
}

export type ProdutosParams = {
  nomeProduto: string
  idCategoriaProduto: number
  valorProduto: number
}

export type CategoriaProdutosValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  storeCategoriaProduto: (params: CategoriaProdutosParams, errorCallback?: ErrCallbackType) => void
  updateCategoriaProduto: (id: number, params: CategoriaProdutosParams, errorCallback?: ErrCallbackType) => void
  deleteCategoriaProduto: (id: number, errorCallback?: ErrCallbackType) => void
  indexCategoriaProduto: (errorCallback?: ErrCallbackType) => void
  setCategorias: (value: CategoriaProdutosDataType[]) => void
  categoria: CategoriaProdutosDataType[]
  setDeleteSuccess: (value: boolean) => void
  deleteSuccess: boolean
}

export type ProdutosValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  storeProduto: (params: ProdutosParams, errorCallback?: ErrCallbackType) => void
  updateProduto: (id: number, params: ProdutosParams, errorCallback?: ErrCallbackType) => void
  deleteProduto: (id: number, errorCallback?: ErrCallbackType) => void
  indexProduto: (errorCallback?: ErrCallbackType) => void
  setProdutos: (value: ProdutosDataType[]) => void
  produtos: ProdutosDataType[]
  setDeleteSuccess: (value: boolean) => void
  deleteSuccess: boolean
}
