// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Modal from  '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useProdutos } from 'src/hooks/useProdutos'
import { useCategoriasProdutos } from 'src/hooks/useCategoriasProdutos'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'


const Produtos = () => {
  // ** Hooks
  const Produtos = useProdutos()
  const { settings } = useSettings()
  const categoriaProdutos = useCategoriasProdutos()
 

  // ** States
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [storeError, setStoreError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  interface FormData {
    nomeProduto: string
    idCategoriaProduto: number
    valorProduto: number
  }

  interface Produto {
    id_produto: number
    id_categoria_produto: number
    nome_produto: string
    valor_produto: number
  }
   
  const schema = yup.object().shape({
    nomeProduto: yup.string().min(2).required(),
    valorProduto: yup.number().min(1).required()
  })
   
  useEffect(() => {
    Produtos.indexProduto()
  },[])

  useEffect(() => {
    categoriaProdutos.indexCategoriaProduto()
  },[])

  useEffect(() => {
    if (Produtos.deleteSuccess) {
      handleDeleteClose()
    }
  }, [Produtos.deleteSuccess])
 
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })
  
  const handleCreateOpen = () => {
    setCreateOpen(true)
  }
  
  const handleCreateClose = () => {
    setCreateOpen(false)
  }
   
  const onSubmitStore = (data: FormData) => {
    const { nomeProduto,valorProduto,idCategoriaProduto } = data
    Produtos.storeProduto({ nomeProduto,valorProduto,idCategoriaProduto }, (error) => {
      setStoreError(error.message)
    })
    handleCreateClose()
  }

  const onSubmitUpdate = (data: FormData) => {
    const { nomeProduto,valorProduto,idCategoriaProduto } = data
    if (selectedProduto) {
      Produtos.updateProduto(selectedProduto.id_produto, { nomeProduto,valorProduto,idCategoriaProduto }, (error) => {
        setUpdateError(error.message)
      })
    } else {
      setError('nomeProduto', {
        type: 'manual',
        message: 'Produto não selecionado',
      })
    }
    handleEditClose()
  }

  const onSubmitDelete = () => {
    if (selectedProduto) {
      Produtos.deleteProduto(selectedProduto.id_produto, (error) => {
        setDeleteError(error.message)
      })
    }
  }

  const handleEditOpen = (produto: Produto) => {
    setSelectedProduto(produto)
    setOpen(true)
  }

  const handleEditClose = () => {
    setOpen(false)
  }

  const handleDeleteOpen = (produto: Produto) => {
    setSelectedProduto(produto)
    setDeleteOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setDeleteError(null)
    Produtos.setDeleteSuccess(false)
  }
   
  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleCreateOpen}>
        Criar Novo Produto
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabela de Produtos">
          <TableHead>
            <TableRow>
              <TableCell>Código Produto</TableCell>
              <TableCell>Categoria do Produto</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Valor Produto</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Produtos.produtos.map((row) => (
              <TableRow key={row.id_produto}>
                <TableCell>{row.id_produto}</TableCell>
                <TableCell>{row.nome_categoria}</TableCell>
                <TableCell>{row.nome_produto}</TableCell>
                <TableCell>{row.valor_produto}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditOpen(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleDeleteOpen(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleEditClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" mb={2}>Editar Categoria</Typography>
          <form onSubmit={handleSubmit(onSubmitUpdate)}>
            <Controller
              name="nomeProduto"
              control={control}
              defaultValue={selectedProduto ? selectedProduto.nome_produto : ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome do Produto"
                  variant="outlined"
                  error={!!errors.nomeProduto}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
              name="valorProduto"
              control={control}
              defaultValue={selectedProduto ? parseFloat(selectedProduto.valor_produto.toString()) : 0}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Valor do Produto"
                  variant="outlined"
                  error={!!errors.valorProduto}
                  sx={{ mb: 2 }}
                />
              )}
            />
            <Controller
                name="idCategoriaProduto"
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.idCategoriaProduto}>
                        <InputLabel>Categoria do Produto</InputLabel>
                        <Select
                            {...field}
                            label="Id Categoria do Produto"
                            onChange={(event) => field.onChange(event.target.value)}
                        >
                            {categoriaProdutos.categoria.map((row) => (
                                <MenuItem key={row.id_categoria_planejamento} value={row.id_categoria_planejamento}>
                                    {row.nome_categoria}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.idCategoriaProduto && (
                            <FormHelperText>{errors.idCategoriaProduto.message}</FormHelperText>
                        )}
                    </FormControl>
                )}
            />
            <Button variant="contained" sx={{ mt: 2 }} fullWidth type="submit">
              Salvar
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={deleteOpen} onClose={handleDeleteClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" mb={2}>Confirmar Exclusão</Typography>
          <Typography mb={2}>Você tem certeza que deseja excluir este Produto?</Typography>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <Button variant="contained" color="error" onClick={onSubmitDelete} fullWidth>
            Deletar
          </Button>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleDeleteClose} fullWidth>
            Cancelar
          </Button>
        </Box>
      </Modal>

      <Modal open={createOpen} onClose={handleCreateClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h2" mb={2}>Criar Novo Produto</Typography>

            <form onSubmit={handleSubmit(onSubmitStore)}>
            <Controller
                name="nomeProduto"
                control={control}
                defaultValue={selectedProduto ? selectedProduto.nome_produto : ''}
                render={({ field }) => (
                <TextField
                    {...field}
                    fullWidth
                    label="Nome do Produto"
                    variant="outlined"
                    error={!!errors.nomeProduto}
                    sx={{ mb: 2 }}
                />
                )}
            />
            <Controller
                name="valorProduto"
                control={control}
                defaultValue={selectedProduto ? parseFloat(selectedProduto.valor_produto.toString()) : 0}
                render={({ field }) => (
                <TextField
                    {...field}
                    fullWidth
                    label="Valor do Produto"
                    variant="outlined"
                    error={!!errors.valorProduto}
                    sx={{ mb: 2 }}
                />
                )}
            />
            <Controller
                name="idCategoriaProduto"
                control={control}
                render={({ field }) => (
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} error={!!errors.idCategoriaProduto}>
                        <InputLabel>Categoria do Produto</InputLabel>
                        <Select
                            {...field}
                            label="Id Categoria do Produto"
                            onChange={(event) => field.onChange(event.target.value)}
                        >
                            {categoriaProdutos.categoria.map((row) => (
                                <MenuItem key={row.id_categoria_planejamento} value={row.id_categoria_planejamento}>
                                    {row.nome_categoria}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.idCategoriaProduto && (
                            <FormHelperText>{errors.idCategoriaProduto.message}</FormHelperText>
                        )}
                    </FormControl>
                )}
            />

            <Button variant="contained" sx={{ mt: 2 }} fullWidth type="submit">
                Criar
            </Button>
            </form>
        </Box>
      </Modal>

    </>
  )
}

export default Produtos
