const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())



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

    ]
}

//Retorna a listagem de todos os produtos da dispensa

app.get("/estoque", (req,res) => { 
    res.statusCode = 200
    res.json(DB.padaria)
})

//Rota para retorno de um produto do estoque

app.get("/estoque/:id",(req,res) => {

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


// Criação de Dados

app.post("/estoque",(req,res)=>{

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

app.delete("/estoque/:id", (req,res)=> {

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


//Porta de acesso

app.listen(45678,() => {
    console.log("API RODANDO!")
})