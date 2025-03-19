// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from  '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useCategoriasProdutos } from 'src/hooks/useCategoriasProdutos'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import { CategoriaProdutosProvider } from 'src/context/CategoriaProdutosContext'


const CategoriaProdutos = () => {
  // ** Hooks
  const categoriaProdutos = useCategoriasProdutos()
  const { settings } = useSettings()
  const auth = useAuth()

  // ** Vars
  const { skin } = settings

  // ** States
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [storeError, setStoreError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  interface FormData {
    nomeCategoria: string
  }

  interface Categoria {
    id_categoria_planejamento: number
    nome_categoria: string
  }
   
  const schema = yup.object().shape({
    nomeCategoria: yup.string().min(2).required(),
  })
   
  useEffect(() => {
    categoriaProdutos.indexCategoriaProduto()
  },[])

  useEffect(() => {
    if (categoriaProdutos.deleteSuccess) {
      handleDeleteClose()
    }
  }, [categoriaProdutos.deleteSuccess])
 
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
    const { nomeCategoria } = data
    categoriaProdutos.storeCategoriaProduto({ nomeCategoria }, (error) => {
      setStoreError(error.message)
    })
    handleCreateClose()
  }

  const onSubmitUpdate = (data: FormData) => {
    const { nomeCategoria } = data
    if (selectedCategoria) {
      categoriaProdutos.updateCategoriaProduto(selectedCategoria.id_categoria_planejamento, { nomeCategoria }, (error) => {
        setUpdateError(error.message)
      })
    } else {
      setError('nomeCategoria', {
        type: 'manual',
        message: 'Categoria não selecionada',
      })
    }
    handleEditClose()
  }

  const onSubmitDelete = () => {
    if (selectedCategoria) {
      categoriaProdutos.deleteCategoriaProduto(selectedCategoria.id_categoria_planejamento, (error) => {
        setDeleteError(error.message)
      })
    }
  }

  const handleEditOpen = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setOpen(true)
  }

  const handleEditClose = () => {
    setOpen(false)
  }

  const handleDeleteOpen = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setDeleteOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false)
    setDeleteError(null)
    categoriaProdutos.setDeleteSuccess(false)
  }
   
  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }} onClick={handleCreateOpen}>
        Criar Nova Categoria
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabela de Categorias">
          <TableHead>
            <TableRow>
              <TableCell>Código Categoria</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Excluir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriaProdutos.categoria.map((row) => (
              <TableRow key={row.id_categoria_planejamento}>
                <TableCell>{row.id_categoria_planejamento}</TableCell>
                <TableCell>{row.nome_categoria}</TableCell>
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
              name="nomeCategoria"
              control={control}
              defaultValue={selectedCategoria ? selectedCategoria.nome_categoria : ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome da Categoria"
                  variant="outlined"
                  error={!!errors.nomeCategoria}
                  sx={{ mb: 2 }}
                />
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
          <Typography mb={2}>Você tem certeza que deseja excluir esta categoria?</Typography>
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
          <Typography variant="h6" component="h2" mb={2}>Criar Nova Categoria</Typography>
          <form onSubmit={handleSubmit(onSubmitStore)}>
            <Controller
              name="nomeCategoria"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome da Categoria"
                  variant="outlined"
                  error={!!errors.nomeCategoria}
                  helperText={errors.nomeCategoria?.message}
                  sx={{ mb: 2 }}
                />
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

export default CategoriaProdutos
