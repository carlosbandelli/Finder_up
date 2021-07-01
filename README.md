# Finder Up
Esta Api foi feita apenas para uso de conhecimento e fins didaticos tendo como objetivo usar os conceitos de metodo C.R.U.D.
Para fins didaticos esotu utilizando uma array para simular um banco de dados falso

### Array Banco de dados falso

```
var DB = {
    padaria:[

        {
            id: 23,
            title: "Farinha de trigo",
            qtd: 10,
            user: "Naruto"

        },
        {
            id: 9,
            title: "Fermento",
            qtd: 15,
            user: "Elizabeth"

        },
        {
            id:13,
            title: "Leite integral",
            qtd: 20,
            user: "Escanor" 


        }

    ],

    users: [
        {
            id:1,
            user: "Naruto",
            email: "hokage@konoha.com",
            password: "sasuke",
        },
        {
           id:3,
           user: "Elizabeth",
           email: "bretanha@deusas.com", 
           password: "meliodas"
        },
        {
            id:100,
            user: "Escanor",
            email:"Leão@orgulho.com",
            password: "rosa"
        }
    ]
}


```


# Bibliotecas Utilizadas
Para iniciar o projeto começamos com o comando ```npm init``` 

### Express

Para construção da API no com o Node.js, usamos a Biblioteca 

```
npm install express --save

```

### Axios e cors
Para consumo da api no Front-end, fiz uma pasta chamada Consumo de Api para o arquivo index.html

Para O axios Usei o Using jsDelivr CDN:


```
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

```
Para o Cors usei, para desbloquear, pois o axios ja vem com ele bloquado:

```
npm install cors --save

```

### JWT:

```
npm install --save jsonwebtoken

```

# Inicio do código
Nosso cabeçalho do código com todas a bilbiotecas instaladas:

```

const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const JWTSecret = "FinderUp" // Senha de acesso para gerar token

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

```


## Endpoint

### Get /estoque

esse endpoint é responsável para retorna a listagem de todos os itens cadastrados no banco de dados.

```
app.get("/estoque",auth, (req,res) => { 

    res.statusCode = 200
    res.json({ user: req.loggedUser, estoque: DB.padaria})
})

```

### Parametros
Nenhum

### Respostas
##### ok! 200
Caso essa resposta aconteça voce vai receber a listagem de todos o itens.


Exemplo de resposta:
```
{
    "user": {
        "id": 1,
        "email": "hokage@konoha.com"
    },
    "estoque": [
        {
            "id": 23,
            "title": "Farinha de trigo",
            "qtd": 10,
            "user": "Naruto"
        },
        {
            "id": 9,
            "title": "Fermento",
            "qtd": 15,
            "user": "Elizabeth"
        },
        {
            "id": 13,
            "title": "Leite integral",
            "qtd": 20,
            "user": "Escanor"
        }
    ]
}

```
##### Falha na autenticação! 401
Caso essa resposta aconteça, isso significa que acorreu uma falha durante o processo de autenticação da requisição. 

Motivos: token invalido, Token Inspirados

Exemplo:

```
{
    "err": "Token inválido!"
}

```

### Get /estoque/:id

esse endpoint é responsável para retorna um item com o id especifico do banco de dados.

```
app.get("/estoque/:id",auth,(req,res) => {

    if(isNaN(req.params.id)){ // IsNaN para veirificar se o ID colocadp é um numero
        res.sendStatus(400) // Status code de erro
    }else{
        
        var id = parseInt(req.params.id)//conversão de ID para numero inteiro

        var material = DB.padaria.find(m => m.id == id)//Criei uma variavel que vai ter o id cadastrado no Banco de dados e se exister um id igual ele retorna o mesmo

        
        //Logica para verificação de Material
        if(material != undefined){ //Se o material existir ele mostra o material 
            res.statusCode = 200;
            res.json(material)
        }else{
            res.sendStatus(404) //Se não existir ele mostra o erro
        }
    }
})

```

### Parametros

O id do item que voce deseja receber

### Respostas

#### OK! 200

Caso essa resposta aconteça voce o iten

Exemplo de resposta:

```
{
    "id": 23,
    "title": "Farinha de trigo",
    "qtd": 10,
    "user": "Naruto"
}

```

##### Não é um numero! 400
Caso não for um numero, mostra Bad Request


Exemplo:

```
Bad Request

```
##### Se for numero e nao existir! 404
Se nao existir o id ele ele retorna que nao existe

Exemplo:

```
Not Found

```

### POST/estoque

esse endpoint é responsável para criar o item no  banco de dados(como essa é uma aplicação didatica, estamos usando um banco de dados falso).

```
app.post("/estoque",auth,(req,res)=>{

    var {title,qtd, user} = req.body

    DB.padaria.push({ //Por ser um BD Falso sempre vai usar esse ID, quando se cadastra um Item, serem dados Temporarios
        id: 74,
        title,
        qtd,
        user
    })

    res.sendStatus(200)

})

```

### Parametros
Nenhum

### Respostas
##### ok! 200
Caso essa resposta aconteça, voce tera criado um item novo .


Exemplo de resposta:

```
OK!

```

### /DELETE/:id

Esse endpoint é responsavel para deleção de itens

### Parametros

O id do item que deseja deletar

### Respostas

#### Bad Request 400
Se o id não for um numero

Exemplo de resposta:

```
Bad Request

```

#### Not Foun 404

Se o id não existir

Exemplo de resposta:

```
Not Found

```

#### OK! 200

Se o id foi deletado com sucesso

Exemplo de resposta:

```
OK!

```

### PUT/estoque/:id
Esse endpoint é resposnsavel parar edição de itens.

```
app.put("/estoque/:id", (req,res) => {

    if(isNaN(req.params.id)){ // IsNaN para veirificar se o ID colocadp é um numero
        res.sendStatus(400) // Status code de erro
    }else{
        
        var id = parseInt(req.params.id)//conversão de ID para numero inteiro

        var material = DB.padaria.find(m => m.id == id)//Criei uma variavel que vai ter o id cadastrado no Banco de dados e se exister um id igual ele retorna o mesmo

        
        
        if(material != undefined){ 
            
            var {title,qtd, user} = req.body

            if(title != undefined){
                
                material.title = title
            }

            if(qtd != undefined){                                 
                    
                    material.qtd = qtd                
                
            }

            if(user != undefined){
                material.user = user
            }

            res.sendStatus(200)


        }else{
            res.sendStatus(404) //Se não existir ele mostra o erro
        }
    }




})

```

### Parametros
Necessita do id para a edição

###Respostas
##### Bad Request 400
Se o id não for um numero

Exemplo:

```
Bad Request

```

##### Not Found 404
Se o id para edição não existe

Exemplo:

```
Not Found

```
#### OK! 200
Se a edição foi realizado com sucesso

```
OK!

```

###/POST/auth
Esse endpoint serve para Gerar token e ter acesso por meio do login

Para fazer a autenticação do token e gerar ele, precisa-se de pegar um email ja cadastrado no banco de dados (No caso o array com chamado users)
####Array de Banco de dados Falso

```
users: [
        {
            id:1,
            user: "Naruto",
            email: "hokage@konoha.com",
            password: "sasuke",
        },
        {
           id:3,
           user: "Elizabeth",
           email: "bretanha@deusas.com", 
           password: "meliodas"
        },
        {
            id:100,
            user: "Escanor",
            email:"Leão@orgulho.com",
            password: "rosa"
        }
    ]

```

Apos isso entre com o metodo post e a rota No postman, e na aba body colocar o email e senha e aperte send. conforme na pasta imagens,  imagem 1.


Feito, copie e cole o token,e na aba Authorization, escolha o **Type** para Bearer token e no campo **Token** cole o token que foi copiado.Conforme na pasta imagens, imagem 2.




###Rota Auth
```
app.post("/auth",(req,res)=>{
    var {email, password} = req.body

    if(email != undefined){

        var user = DB.users.find(u => u.email == email)

        if(user != undefined){
            if(user.password == password){

            jwt.sign({id: user.id, email: user.email }, JWTSecret,{expiresIn:'48h'},(err,token)=>{ //payload - informação que estão dentro do token e tempo de expiração
                if(err){
                    res.status(400)
                    res.json({err:"Falha interna"})
                }else{
                    res.status(200)
                    res.json({token: token })
                }
            })            
            }else{
                res.status(401)
                res.json({err: "Credenciais invalidas"})
            }
        }else{
            res.status(404)
            res.json({err: "O E-mail enviado Não existe na base de dados!"})
        }

    }else{
        res.status(400)
        res.json({err: "O Email enviado é invalido"})
    }
    
})

```

### Parametros
Nenhum

### Respostas

#### Falha Interna 400
Quando o token não foi gerado ou o email é invalido

Exemplo da resposta:

```
{

Falha interna

}

```

### Credenciais Invalidas 401

Quando a senha esta errada

Exemplo de resposta:

```
Credenciais invalidas

```

### O E-mail enviado Não existe na base de dados! 404

quando o email não existe

Exemplo de resposta:


```
O E-mail enviado Não existe na base de dados!

```

### OK! 200

Quando o login é realizado com sucesso

Exemplo de resposta:

```
OK!

```


### Porta de acesso
Defini o numero da porta de acesso


```
app.listen(45678,() => {
    console.log("API RODANDO!")
})
```










 
