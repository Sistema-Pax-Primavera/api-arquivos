import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomErrorException from 'App/Exceptions/CustomErrorException'
import ArquivoAssociado from 'App/Models/ArquivoAssociado'
import CreateArquivoAssociadoValidator from 'App/Validators/CreateArquivoAssociadoValidator'

export default class ArquivoAssociadoController {

    /**
     * Método para cadastrar arquivo.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async cadastrar({ request, response, auth }: HttpContextContract): Promise<any> {
        try {

            // Valida os campos informados.
            const {
                associadoId, documento
            } = await request.validate(CreateArquivoAssociadoValidator)

            // Insere o registro no banco de dados.
            const arquivo = await ArquivoAssociado.create({
                associadoId, documento,
                createdBy: auth.user?.nome
            })

            return response.status(201).send({
                status: true,
                message: 'Registro cadastrado com sucesso!',
                data: arquivo
            })
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    /**
     * Método para atualizar arquivo.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async atualizar({ request, response, params, auth }: HttpContextContract): Promise<any> {
        try {

            // Busca o arquivo pelo id informado.
            let arquivo = await ArquivoAssociado.findOrFail(params.id)

            // Valida os campos informados.
            const {
                associadoId, documento
            } = await request.validate(CreateArquivoAssociadoValidator)

            // Atualiza o objeto com os dados novos.
            arquivo = {
                ...arquivo,
                associadoId, documento,
                updatedBy: auth.user?.nome ?? null
            }

            // Persiste no banco o objeto atualizado.
            await arquivo.save()

            return response.status(200).send({
                status: true,
                message: 'Registro atualizado com sucesso',
                data: arquivo
            })
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    /**
     * Método para ativar/inativar arquivo.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async ativar({ response, params, auth }: HttpContextContract): Promise<any> {
        try {
            // Busca o arquivo pelo id informado.
            const arquivo = await ArquivoAssociado.findOrFail(params.id)

            // Atualiza o objeto com os dados novos.
            arquivo.ativo = !arquivo.ativo
            arquivo.updatedBy = auth.user?.nome ?? null

            // Persiste no banco o objeto atualizado.
            await arquivo.save()

            return response.status(200).send({
                status: true,
                message: `Registro ${arquivo.ativo ? 'ativado' : 'inativado'} com sucesso`,
                data: arquivo
            })

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    /**
     * Método para buscar todos os arquivos.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async buscarTodos({ response }: HttpContextContract): Promise<any> {
        try {
            // Busca todos os arquivos existentes.
            const arquivos = await ArquivoAssociado.query()

            // Verifica se não foi retornado nenhum registro.
            if (arquivos.length <= 0) {
                throw new CustomErrorException("Nenhum registro encontrado", 404);
            }

            return response.status(200).send({
                status: true,
                message: `Registros retornados com sucesso`,
                data: arquivos
            })

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    /**
     * Método para buscar os arquivos ativos.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async buscarAtivos({ response }: HttpContextContract): Promise<any> {
        try {
            // Busca todos os arquivos ativos.
            const arquivos = await ArquivoAssociado.query().where('ativo', true)

            // Verifica se não foi retornado nenhum registro.
            if (arquivos.length <= 0) {
                throw new CustomErrorException("Nenhum registro encontrado", 404);
            }

            return response.status(200).send({
                status: true,
                message: `Registros retornados com sucesso`,
                data: arquivos
            })

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }

    /**
     * Método para buscar o arquivo por id.
     *
     * @param {HttpContextContract} ctx - O contexto da solicitação HTTP.
     * @return {*} 
     * @memberof ArquivoAssociadoController
     */
    public async buscarPorId({ response, params }: HttpContextContract): Promise<any> {
        try {
            // Busca o arquivo pelo id informado.
            const arquivo = await ArquivoAssociado.findOrFail(params.id)

            return response.status(200).send({
                status: true,
                message: `Registro retornado com sucesso`,
                data: arquivo
            })

        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }
}
