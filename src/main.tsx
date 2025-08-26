import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home.tsx'
import PrimaryLayout from './layouts/primary.tsx'
import { ThemeProvider } from './utils/Theme.tsx'
import SignUp from './pages/sign-up.tsx'
import { CenteredLayout } from './layouts/centered.tsx'

import { SessionProvider } from './providers/SessionProvider.tsx'
import { Toaster } from 'sonner'
import AuthenticatedLayout from './layouts/authenticated.tsx'
import GroupView from './pages/GroupView/index.tsx'
import GroupDashboard from './pages/GroupDashboard/index.tsx'
import TaskDashboard from './pages/TaskDashboard/index.tsx'
import TaskView from './pages/TaskView/index.tsx'
import Login from './pages/log-in.tsx'
import Profile from './pages/profile.tsx'



createRoot(document.getElementById('root')!).render(
  <>
    <SessionProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PrimaryLayout />}>
              <Route path='/' element={<Home />} />
              <Route element={<AuthenticatedLayout/>} >
                <Route path='/profile' element={<Profile/>} />
                <Route path='/groups' element={<GroupDashboard/>} />
                <Route path='/groups/:groupId' element={<GroupView />} />
                <Route path='/assignments' element={<TaskDashboard/>} />
                <Route path='/assignments/:assignmentId' element={<TaskView/>} />
              </Route>
            </Route>
            <Route element= {<CenteredLayout/>}>
              <Route path='/login' element={<Login/>} />
              <Route path='/sign-up' element={<SignUp/>}  />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </SessionProvider>
    <Toaster toastOptions={{duration: 3000}} richColors/>
  </>
)
