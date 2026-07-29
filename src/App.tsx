import Box from '@mui/material/Box'
import { Drumroll } from './components/Drumroll'
import { SettingsDrawer } from './components/SettingsDrawer'
import { TopAppBar } from './components/TopAppBar'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <TopAppBar />
      <Drumroll />
      <SettingsDrawer />
    </Box>
  )
}

export default App
