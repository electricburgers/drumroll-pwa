import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Pictograph } from './components/Pictograph'

function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100svh',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1" sx={{ fontSize: { xs: '4rem', sm: '6rem' } }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          Ooof you're off beat <Pictograph name="drum" size="1.1em" />
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}
        >
          <Pictograph name="wave" size="1.2em" /> This is not the page you are looking for...
        </Typography>
        <Link href={import.meta.env.BASE_URL} underline="hover">
          Go Back
        </Link>
      </Stack>
    </Box>
  )
}

export default NotFound
