import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

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
        pt: 'env(safe-area-inset-top)',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1" sx={{ fontSize: { xs: '4rem', sm: '6rem' } }}>
          404
        </Typography>
        <Typography variant="h5">Ooof you're off beat 🥁</Typography>
        <Typography variant="body1" color="text.secondary">
          👋 This is not the page you are looking for...
        </Typography>
        <Link href={import.meta.env.BASE_URL} underline="hover">
          Go Back
        </Link>
      </Stack>
    </Box>
  )
}

export default NotFound
