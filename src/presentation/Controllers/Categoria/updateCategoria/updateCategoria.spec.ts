import {updateCategoria} from './updateCategoria'
import {updateCategoriaCase} from '../../../../domain/usercases/Categoria/updateCategoria'
import { httpRequest, ICategoriaEntry, serverError } from '../addCategoria/protocols'
import { Icategoria } from '../../../../domain/model/categoria'

const makeCategoriaUserCase =() =>{
  class updateCategoriaCaseSlug implements updateCategoriaCase{
    async handle(categoria_id: number, categoria: ICategoriaEntry): Promise<Icategoria>{
      const fakeCategoria :Icategoria = {
        id: 1,
        name: 'fake name',
        photo: {
          id: 2,
          url: 'fake url'
        }
      }
      return await new Promise(resolve => resolve(fakeCategoria))
    }
  }
  return new updateCategoriaCaseSlug
}

describe('updateCategoria', ()=>{
  test('should return 400 if no name in body is provided', async ()=>{
    const sut  = new updateCategoria(makeCategoriaUserCase())
    const httpRequest: httpRequest = {
      body:{
        photo: 3
      },
      params:{
        id: 2
      }
    }

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({Error: 'Bad Request: Parametros faltando: name'})
  })

  test('should return 400 if no photo in body is provided', async ()=>{
    const sut  = new updateCategoria(makeCategoriaUserCase())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name'
      },
      params:{
        id: 2
      }
    }

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({Error: 'Bad Request: Parametros faltando: photo'})
  })

  test('should return 400 if params in query is provided', async ()=>{
    const sut  = new updateCategoria(makeCategoriaUserCase())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      },
    }
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({Error: "Bad Request: Parametros faltando: id"})
  })

  test('should return 400 if no categoria_id in query is provided', async ()=>{
    const sut  = new updateCategoria(makeCategoriaUserCase())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      },
      params:{
      }
    }
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({Error: "Bad Request: Parametros faltando: id"})
  })

  test('should return 500 handle throws', async ()=>{
    const slug = makeCategoriaUserCase()
    const sut  = new updateCategoria(slug)
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      },
      params:{
        id: 1
      }
    }

    jest.spyOn(slug, 'handle').mockImplementationOnce(()=>{
      throw new Error('teste')
    })

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual({Error:"Something went wrong: teste"})
  })

  test('should return 200 if works', async ()=>{
    const sut  = new updateCategoria(makeCategoriaUserCase())
    const httpRequest: httpRequest = {
      body:{
        name: 'test name',
        photo: 2
      },
      params:{
        id: 1
      }
    }

    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(200)
    expect(response.body.data).toEqual({
      id: 1,
      name: 'fake name',
      photo: {
        id: 2,
        url: 'fake url'
      }
    })
  })
})