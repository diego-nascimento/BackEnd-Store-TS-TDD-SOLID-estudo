import express from 'express'
import CategoriaRoutes from './routes/Categoria/CategoriaRoutes'
import PhotoRoutes from './routes/Photo/PhotoRoutes'
import ProdutoRoutes from './routes/Produto/ProdutoRoutes'

class server{
  public server;
  constructor(){
    this.server = express()
    this.midwares()
    this.routes()
  }

  midwares(){
    this.server.use(express.json())
  }

  routes(){
    this.server.use(CategoriaRoutes)
    this.server.use(PhotoRoutes)
    this.server.use(ProdutoRoutes)
  }
}

export default new server().server;