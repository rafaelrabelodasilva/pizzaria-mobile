Projeto iniciado com 
npm install --global expo-cli

expo --version
6.3.10

expo init nomeprojeto

blank (TypeScript)

Rodar projeto
npx expo start

Escolhido a opção "Open Android"

Instalar o react navigation
https://reactnavigation.org/docs/hello-react-navigation

expo install @react-navigation/native

Na sequência rodar:
expo install react-native-screens react-native-safe-area-context

Instalar o native stack
https://reactnavigation.org/docs/native-stack-navigator/

expo install @react-navigation/native-stack

instalado async storage para salvar os dados de acesso se o usuário fechar o aplicativo (fica salvo no banco "offline")

https://react-native-async-storage.github.io/async-storage/docs/install

npx expo install @react-native-async-storage/async-storage

instalado axios para fazer requisições HTTP

expo install axios

criado arquivo services/api.ts

Para pegar o ip abrir o CMD e digitar: ipconfig
Pegar o "Endereço IPv4
Endereço IPv4. . . . . . . .  . . . . . . . : 192.168.0.9

```services/api.ts
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3333",
  baseURL: "http://192.168.0.9:3333",
});

export { api };
```