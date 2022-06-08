
# YouParty

Foram feitas todas as paginas sugeridas no mockup, junto com a integração com o servidor socket 
e adcionado capacitor e gerado app android. 

# Download do APK

[APK 1.1.2 - DOWNLOAD](https://we.tl/t-sTmqpkJGFp) (valido até 13/06/2022)

## Developed by
- Flávio José Lucas da Silva - 190847 - CP110TIN2, PA038TIN3
- Higor da Silva Lins - 190218 - CP110TIN1,PA038TIN3
- Guilherme de Oliveira Chaguri - 190356 - CP110TIN1, PA038TIN3
- Gustavo Moreira de Mello - 180525 - CP110TIN1, PA038TIN1
- Leonardo José Ferreira Corrêa - 210726 - CP110TIN2, PA038TIN3

## Descrição 06/06/2022

O aplicativo se trata de uma plataforma onde é possível dentro de salas colocar vídeos do youtube e sincronamente assistir com todos integrantes presentes na sala. Junto com isso existem várias funcionalidades possíveis, como mandar mensagem em tempo real, promover usuários a admin (caso ele seja admin), pausar o vídeo para todos (caso ele seja admin), pular vídeo e avançar vídeo. Vale ressaltar que o projeto já está 100% concluído, com todas sugestão feitas na descrição do dia 31/05/2022 já concluidas. 

## Descrição 31/05/2022

O aplicativo se trata de uma plataforma onde é possível dentro de salas colocar vídeos do youtube e sincronamente assistir com todos integrantes presentes na sala. Junto com isso existem várias funcionalidades possíveis, como mandar mensagem em tempo real, promover usuários a admin (caso ele seja admin), pausar o vídeo para todos (caso ele seja admin), pular vídeo e avançar vídeo. Vale ressaltar que o projeto já está 90% concluído, faltando apenas um ajuste na modal de adicionar vídeo e poder mostrar código da sala quando o celular se encontra em 'portrait' (em 'landscape' é possível ver o código da sala para compartilhar com outras pessoas).

## Principais telas

# Tela de criar nova sala (basta apenas colocar seu nome que dentro da sala será gerado um codigo)
<img src="https://user-images.githubusercontent.com/52553781/170142248-41f914a6-0376-415e-9c08-e128901f2593.png" width="250"/>

# Tela de adicionar video 
<img src="https://user-images.githubusercontent.com/52553781/170142384-7af647ae-cf90-4e9f-8baa-955d76c1057a.png" width="250"/>

# Tela de mensagem com video rodando
<img src="https://user-images.githubusercontent.com/52553781/170142456-bc001673-d911-4668-9007-090d807309e4.png" width="250"/>

# Tela de lista de usuarios
<img src="https://user-images.githubusercontent.com/52553781/170142510-9402f77d-05fd-47ad-8370-95fdfa0c051e.png" width="250"/>

## Como rodar o projeto

# Pré requisito

- Baixar ou clonar o projeto com git
- Instalação do node: https://www.treinaweb.com.br/blog/instalacao-do-node-js-windows-mac-e-linux
- Uma IDE como VISUAL STUDIO CODE para abrir o projeto
- Android Studio para gerar apk

# Versões minimas necesarias para o projeto

- NODE: 14

# Para rodar a apliacação na WEB

- Entre na pasta www, onde se localiza todo a base HTML e css do projeto, com auxilio de um navegador basta abrir o HTML index.html usando a extensão LiveServer https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer, seguindo a imagem abaixo:

<img src="https://user-images.githubusercontent.com/52553781/172271361-81787b4d-d4c8-42ea-8e49-343f82d8e3aa.png" width="400" />

# Para rodar a aplicação no celular e gerar uma apk

- Com auxilio do NODE rode o comando 'npm i' para instalar o ionic e o capacitor
- Com tudo já instalado basta rodar o comando 'npx cap sync android' para sincronizar a pasta Android
- Com a pasta Android sincronizada, basta abrir a mesma ('..../yourparty-app/android') com o Android Studio e rodar


