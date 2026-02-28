import { settingRepositories } from '~/repositories/client/setting.repository'

export const getSettingGeneral = async () => {
  const settingGeneral = await settingRepositories.getSettingGeneral()
  
  return settingGeneral
}

export const settingServices = {
  getSettingGeneral
}