import {addCategoria} from './addCategoria'
import {addCategoriauseCase, ICategoriaEntry} from '../../../../domain/usercases/Categoria/addCategoria'
import { Icategoria } from '../../../../domain/model/categoria'
import { httpRequest, httpResponse } from '../../../protocols/http'

const makeAddCategoria = () =>{
  class addCategoriaStub implements addCategoriauseCase{
    async handle(categoria: ICategoriaEntry): Promise<Icategoria>{
      const fakeAccount: Icategoria = {
        id: 1,
        name: 'fake name',
        photo: 
          {
            id: 1,
            url: 'fakeurl'
          }
      } 
       return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new addCategoriaStub
}

describe('addCategoria', ()=>{
  test('Show return code 400 when no name is provided', async()=>{
    const sut = new addCategoria(makeAddCategoria())
    const httpRequest: httpRequest = {
      body:{
        photos: 2
      }
    }
    
    const response: httpResponse = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({Error: 'Bad Request: Parametros faltando: name'})
  })

 

  test('Show return code 400 when no photos is provided', async()=>{
    const sut = new addCategoria(makeAddCategoria())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
      }
    }
    
    const response: httpResponse = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
  })

  test('Should call handle with the correct values', async()=>{
    const slug = makeAddCategoria()
    const sut = new addCategoria(slug)

    const spy = jest.spyOn(slug, 'handle')
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 1
      }
    }
    
    await sut.handle(httpRequest)
    expect(spy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      photo: httpRequest.body.photo
    })
  })

  test('return 500 if handle throws', async()=>{
    const addCategoriaSlug = makeAddCategoria()
    const sut = new addCategoria(addCategoriaSlug)
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      }
    }
    jest.spyOn(addCategoriaSlug, 'handle').mockImplementationOnce(()=>{
      throw new Error('teste')
    })
    const response: httpResponse = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual( { Error: 'Something went wrong: teste'  })
  })

  test('Show return code 200 when categoria is created', async()=>{
    const sut = new addCategoria(makeAddCategoria())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      }
    }
    
    const response: httpResponse = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(200)
    expect(response.body.data).toEqual({
      id: 1,
      name: 'fake name',
      photo: 
        {
          id: 1,
          url: 'fakeurl'
        }
      
    } )
  })
})