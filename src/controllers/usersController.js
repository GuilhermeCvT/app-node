const {hash, compare} = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class UsersController {
  async create(request, response) {
    const {name, email, password} = request.body
    const userExist = await knex.select().table('users').where('email', email)

    if (userExist.length > 0)
      throw new AppError('Este e-mail já está em uso')

    const hashedPassword = await hash(password, 8)

    await knex.insert([{
      name: name,
      email: email,
      password: hashedPassword
    }]).into('users')

    return response.status(201).json()
  }

  async update(request, response) {
    const {name, email, password, old_password} = request.body
    const user_id = request.user.id
    const user = await knex.table('users').first().where('id', user_id)

    if (!user)
      throw new AppError('Usuário não encontrado')

    const userExistWithEmail = await knex.table('users').first().where('email', email)
    if (userExistWithEmail && userExistWithEmail.id != user.id)
      throw new AppError('Email já está sendo utilizado')

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password)
      throw new AppError('Informe a senha antiga')

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword)
        throw new AppError('Senha antiga não bate com senha atual')

      user.password = await hash(password, 8)
    }

    await knex('users')
      .where({id: user.id})
      .update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now()
      })

    return response.json()
  }
}

module.exports = UsersController