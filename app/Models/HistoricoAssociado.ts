import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import { formatarString } from 'App/Util/Format'
import { DateTime } from 'luxon'

export default class HistoricoAssociado extends BaseModel {
  // Definição do nome da tabela.
  public static table = 'arquivo.historico_associado'

  @column({ isPrimary: true })
  public id: number

  // ID do histórico.
  @column()
  public historicoId: number

  // Caminho do documento.
  @column()
  public documento: string | null

  // Indica se o resgistro está ativo.
  @column()
  public ativo: boolean

  // Data de criação do registro.
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  // Nome do criador do registro.
  @column()
  public createdBy: string | null

  // Data de atualização do registro.
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Nome do responsável pela atualização do registro.
  @column()
  public updatedBy: string | null

  /**
  * Método de gancho (hook) que formata os campos do registro antes de salvá-los.
  *
  * @param {HistoricoAssociado} historicoAssociado - O objeto HistoricoAssociado a ser formatado.
  *
  * @memberOf HistoricoAssociado
  */
  @beforeSave()
  public static async formatFields(historicoAssociado: HistoricoAssociado) {
    historicoAssociado.createdBy = formatarString(historicoAssociado.createdBy)
    historicoAssociado.updatedBy = formatarString(historicoAssociado.updatedBy)
  }
}
