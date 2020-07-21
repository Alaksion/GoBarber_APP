import React, {createContext, useCallback, useState, useContext, useEffect} from 'react'
import api from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage'

interface AuthState{
  token: string;
  user: {}
}

interface Credentials{
  email: string;
  password: string;
}

interface AuthContextData{
  user: {};
  signIn(credentials : Credentials) : Promise<void>;
  signOut() : void;
  loading: boolean;
}

const authContext = createContext<AuthContextData>({} as AuthContextData)


const AuthProvider: React.FC = ({children}) => {

  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, setLoading] = useState(true)
    
  useEffect( () => {
    
    async function loadStorageData() : Promise<void>{
      const token = await AsyncStorage.getItem('@gobarber:token')
      const user = await AsyncStorage.getItem('@gobarber:user')

    if(token && user){
      setData({token, user: JSON.parse(user)})
    }      
  }
  setLoading(false)

  loadStorageData()

  }, [])

  const signIn = useCallback(async ({email, password})=>{
    const response = await api.post('/session', {email, password})
    const {token, user} = response.data
    await AsyncStorage.setItem('@gobarber:token', token)
    await AsyncStorage.setItem('@gobarber:user', JSON.stringify(user))
    setData({token, user})
  }, [])

  const signOut = useCallback(async ()=> {
    await AsyncStorage.removeItem('@gobarber:token')
    await AsyncStorage.removeItem('@gobarber:user')
    setData({} as AuthState)
  }, [] )

  return(
    <authContext.Provider value={{user: data.user , signIn, signOut, loading}}>
      {children}
    </authContext.Provider>
  )
}

function useAuth() : AuthContextData{
  const context = useContext(authContext)

  if(!context){
    throw new Error('useAuth must be used within an authprovider')
  }

  return context
}

export {AuthProvider, useAuth}