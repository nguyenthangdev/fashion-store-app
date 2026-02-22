import SettingsGeneralModel from '~/models/settingGeneral.model'

const findAllSetting = async () => {
  const settingGeneral = await SettingsGeneralModel.find({})

  return settingGeneral
}

const findOneSetting = async () => {
  const settingsGeneral = await SettingsGeneralModel.findOne({}) // Lấy một document bất kỳ trong collection (thường là document đầu tiên)

  return settingsGeneral
}

export const settingRepositories = {
  findAllSetting,
  findOneSetting
}