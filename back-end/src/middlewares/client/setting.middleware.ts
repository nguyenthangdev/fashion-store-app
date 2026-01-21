import { Request, Response, NextFunction } from 'express'
import SettingsGeneralModel from '~/models/settingGeneral.model'
export const settingsGeneral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const settingsGeneral = await SettingsGeneralModel.findOne({})
  req['settingsGeneral'] = settingsGeneral
  next()
}
