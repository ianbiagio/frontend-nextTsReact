// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Link href='/categoria-produtos' style={{ textDecoration: 'none' }}>
            <Card>
              <CardHeader title="Categorias de Produtos" />
              <CardContent>
                <Typography sx={{ mb: 2 }}>Cadastre, Altere, Liste e Exclua...</Typography>
              </CardContent>
            </Card>
        </Link>
      </Grid>
      <Grid item xs={12}>
      <Link href='/produtos' style={{ textDecoration: 'none' }}>
          <Card>
            <CardHeader title='Produtos'></CardHeader>
            <CardContent>
            <Typography sx={{ mb: 2 }}>Cadastre, Altere, Liste e Exclua...</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grid>
  )
}

export default Home
