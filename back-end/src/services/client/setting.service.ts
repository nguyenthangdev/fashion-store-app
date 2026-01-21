import SettingsGeneralModel from '~/models/settingGeneral.model'

export const getSettingGeneral = async () => {
    const settingGeneral = await SettingsGeneralModel.find({})
    return settingGeneral
}