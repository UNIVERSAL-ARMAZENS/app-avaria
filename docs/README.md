<p align="center">
  <img src="http://www.uaga.com.br/wp-content/uploads/2020/09/Logo-site.png" alt="Logo da Empresa" width="180">
</p>

<h1 align="center">Inspeção Fotografica de Avarias - Mobile App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13.5-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/github/last-commit/aprendiz-ti-uaga/app-avaria?style=for-the-badge">
  <img src="https://img.shields.io/badge/React-Native-red?style=for-the-badge">

</p>


---

## 📌 Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Objetivos](#objetivos)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Acesso ao Projeto](#acesso-ao-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Licença](#licença)

---

##  Descrição do Projeto

desenvolvimento de um aplicativo móvel para automação do processo de inspeção e registro de avarias, o aplicativo visa digitalizar a coleta de informações, automatizar a geração de relatórios em formato PDF e integrar as imagens relacionadas à avaria.  

---

##  Objetivos

Estabelecer o procedimento para registro e elaboração de Relatório Fotográfico de Avaria, bem como o desenvolvimento de um sistema mobile que automatize este processo, garantindo padronização e suporte às ações corretivas e preventivas. 

 

 

## Requisitos Funcionais 
 Login de usuario cadastrado pelo administrador : O  conferente deve colocar sua credencias cadastradas pelo admin
 
Reconhecimento da Avaria: O conferente irá registrar a avaria manualmente, escrevendo o conhecimento da avaria inspecionada, 

Registro de Quantidade Avaliada: O conferente registrará a quantidade de itens afetados. 

Registro de Horários: O Conferente deve selecionar os horários de deslacre, início e término da inspeção.  

integração de Imagens: o Conferente deve descrever detalhadamente o problema.'(a desenvolver uma opção melhor para facilitar na parte de descrição).  O operador poderá registrar fotos da avaria, que serão incorporadas ao relatório gerado. 

Geração de Relatório PDF: O aplicativo gerará um PDF com todas as informações inseridas, incluindo as imagens, e o salvará na rede corporativa. 

 
---
##  Arquitetura do Sistema

| Componente         | Tecnologias / Descrição                                                 |
|--------------------|-------------------------------------------------------------------------|
| **Frontend**       | React Native – Interface móvel para registro de avarias e fotos         |
| **Backend**        | Python + Flask – Processamento de dados, geração de PDF e integração DB |
| **Banco de Dados** | PostgreSQL / MySQL – Registro de avarias, usuários e logs               |
| **Armazenamento**  | Servidor corporativo – PDFs e imagens                                   |

---

##  Estrutura do Projeto



```
/inspecao-avarias
│
├── /frontend        # React Native App
├── /backend         # API Flask
├── /database        # Scripts de criação e migração
├── /docs            # Documentação e relatórios
└── README.md        # Este arquivo
```

---

## Acesso ao Projeto

-  Estar no diretorio do projeto backend
   ```
   cd app-avaria\AppAvaria\backend
   ```
1. Iniciar o ambiente virtual.
   ```
   python -m venv env
   ```
 2.  Ativar ambiente virtual (Windows)
   ```
    .\env\Scripts\Activate.ps1
   ```

   (Opcional) Para desativar o ambiente virtual rode o comando: `deactivate`

3. Instalar dependências.
   ```
   pip install -r '.\requirements.txt'
   ```
4. Comando para criar o primeiro usuário (admin) inicial
  ```
   Invoke-RestMethod -Uri "http://10.1.12.161:5000/register_admin_initial" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username": "admin", "password": "1234"}'
```
5. Rodar o app
   ```
   python.app.py
   ```
   6. Estar no diretório do frontend
   ```
   cd app-avaria\AppAvaria\frontend
   ```

7. Instalar as dependências
   ```
   npm install
8. Rodar o expo go
   ```
   npx expo start -c
---
##  Tecnologias utilizadas

- ``JavaScritp``
- ``TypeScritp``
- ``React Native``
- ``Expo Go``
---
- ``Python``
- ``Flask``
- ``SQAlchemy``

##  Licença

MIT License 













