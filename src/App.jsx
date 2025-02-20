
import './App.css'
import PropertyList from './components/PropertyList'
import PropertyDetails from './components/PropertyDetails'
import { Navigate, Route, Routes } from 'react-router-dom'
import AddProperty from './components/AddProperty'
import LogIn from './components/LogIn'
import RegistUser from './components/RegistUser'


import TenDash from './components/TenDash'
import Info from './components/Info'

import OwnerProperties from './components/OwnerProperties'

import ProtectedRoute from './components/ProtectedRoute'
import OwnerLayout from './components/OwnerLayout'
import OwnerPropertyDetails from './components/OwnerPropertyDetails'
import Account from './components/Account'
import TenantLayout from './components/TenantLayout'
import Favorites from './components/FavoriteButton'
import FavoritPage from './components/FavoritPage'
import RentRequestsPage from './components/RentRequestsPage'
import OwnerRequestsPage from './components/OwnerRequestsPage'
import { RequestProvider } from './context/RequestContext'
import NotFound from './pages/NotFound'
import { useEffect, useState } from 'react'
import SmallScreenBlock from './components/SmallScreenBlock'




function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isSmallScreen) {
    return <SmallScreenBlock/>;
  }


  return (


    <>
    <RequestProvider>
      <Routes>
      <Route path='/' element={<LogIn/>}/> 
        <Route path='/regist-user' element={<RegistUser/>}/>
             
 <Route path="*" element={<NotFound/>} /> 

        <Route path='/owner' element={<ProtectedRoute element={<OwnerLayout/>} requiredRole="owner" />}>
        <Route path="properties" element={<PropertyList />} />
        <Route path="property/:id" element={<PropertyDetails/>}/>
        <Route path="add-property" element={<AddProperty />} />  
        <Route path="info" element={<Info/>}/>
       <Route path="my-properties" element={<OwnerProperties />} />
       <Route path="property/:id" element={<PropertyDetails/>}/>
       <Route path="add-property/:id" element={<AddProperty />} />

       <Route path="info/:id" element={<Info />} />
       <Route path="ownerdetails/:id" element={<OwnerPropertyDetails />} />
       <Route path="account" element={<Account />} />
       <Route path="requests-page" element={<OwnerRequestsPage />} />
      
       

        </Route>

        <Route path='/tenant' element={<ProtectedRoute element={<TenantLayout/>} requiredRole="tenant" />}>
        <Route path='add-property/:id' element={<AddProperty/>}/>
        <Route path="info" element={<Info/>}/>
        <Route path="property/:id" element={<PropertyDetails/>}/>
        <Route path="properties" element={<PropertyList/>}/>
        <Route path="account" element={<Account />} />
        <Route path="favorites" element={<FavoritPage/>} /> 
        <Route path="my-request" element={<RentRequestsPage/>} /> 
        

        </Route>
     
    
      
      
      
       
   
       
        

      </Routes>
      </RequestProvider>
    </>
  )
}

export default App
