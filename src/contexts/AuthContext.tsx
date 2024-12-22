import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
  user: UserProps
  isAuthenticated: boolean
  signIn: (credentials: SignInProps) => Promise<void>
  loadingAuth: boolean
  loading: boolean
  signOut: () => Promise<void>
}

type UserProps = {
  id: string
  name: string
  email: string
  token: string
}

type AuthProviderProps = {
  children: ReactNode
}

type SignInProps = {
  email: string
  password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: '',
    name: '',
    email: '',
    token: ''
  })

  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user.name

  //Verifica se o usuário já está logado
  //Executado quando o componente é montado em tela
  useEffect(() => {
    async function getUser() {
      //Pega os dados do usuário no AsyncStorage
      const userInfo = await AsyncStorage.getItem('@sujeitopizzaria')

      //Se existir dados do usuário no AsyncStorage, seta os dados do usuário
      let hasUser: UserProps = JSON.parse(userInfo || '{}')

      //Se existir dados do usuário no AsyncStorage, seta o token no cabeçalho de todas as requisições
      if(Object.keys(hasUser).length > 0) {
        api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          token: hasUser.token
        })
      }
      setLoading(false)
    }
    //Chama a função para pegar os dados do usuário
    getUser()
  }, [])

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true)

    try {
      const response = await api.post('/session', {
        email,
        password
      })
      // console.log(response.data)

      const { id, name, token } = response.data


      //O AsyncStorage apenas aceita strings e como queremos salvar um objeto com os dados do usuário precisamos converter
      const data = {
        ...response.data
      }

      await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data))

      //Adicionando o token no cabeçalho de todas as requisições
      api.defaults.headers.Authorization = `Bearer ${token}`

      //Seta os dados do usuário
      setUser({
        id,
        name,
        email,
        token
      })

      setLoadingAuth(false)
    } catch (error) {
      console.log('Erro ao acessar', error)
      setLoadingAuth(false)
    }
  }

  async function signOut() {
    await AsyncStorage.clear()
    .then(() => {
      setUser({
        id: '',
        name: '',
        email: '',
        token: ''
      })
    })
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        signIn, 
        loadingAuth, 
        loading,
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}