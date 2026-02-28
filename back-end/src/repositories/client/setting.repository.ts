import SettingsGeneralModel from '~/models/settingGeneral.model'

const getSettingGeneral = async () => {
  const settingGeneral = await SettingsGeneralModel.find({})
  return settingGeneral
}

export const settingRepositories = {
  getSettingGeneral
}