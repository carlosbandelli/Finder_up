// BIBLIOTECAS
const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const JWTSecret = "FinderUp" // Senha de acesso para gerar token

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

function auth(req,res,next){ //Middleware
    const authToken = req.headers['authorization']

    //Logica de Validação de Token

    if(authToken != undefined){

        const bearer = authToken.split(' ') // Token foi divido em dois array para separar o tipo do token com o token
        var token = bearer[1] // Variavel craida para para receber só o token

        jwt.verify(token, JWTSecret, (err, data) => {
            if(err){
                res.status(401)
                res.json({err: "Token Invalido!"})
            }else{
                req.token = token
                req.loggedUser = {id: data.id,email:data.email}
                next() // reponsavel por passar requisição do middleware para a rota que o usuario quer ascessar
            }
        })

    }else{
        res.status(401)
        res.json({err:"Token inválido!"})
    }   
    
}



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

//Retorna a listagem de todos os produtos da dispensa

app.get("/estoque",auth, (req,res) => { 

    res.statusCode = 200
    res.json({ user: req.loggedUser, estoque: DB.padaria})
})

//Rota para retorno de um produto do estoque

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


// Criação de Itens

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

//Rota de deleção

app.delete("/estoque/:id", auth, (req,res)=> {

    if(isNaN(req.params.id)){ // IsNaN para veirificar se o ID colocadp é um numero
        res.sendStatus(400) // Status code de erro
    }else{
        
        var id = parseInt(req.params.id)//conversão de ID para numero inteiro
        var index = DB.padaria.findIndex(m => m.id == id) 
        if(index == -1){
            res.sendStatus(404)
        }else{
            DB.padaria.splice(index,1)// Aqui eu deleto um elemento  que esta nesse index
            res.sendStatus(200) //Deleção feita com sucesso
        }
             
    }

})

//Rota de edição

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

// Rotas especificas para login
// Rota especifica pra gerar token
// essa rota pra verificar se existe o usuario no banco de dados

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


//Porta de acesso

app.listen(45678,() => {
    console.log("API RODANDO!")
})