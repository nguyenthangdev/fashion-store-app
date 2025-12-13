import Role from "~/models/role.model"

export const requirePermission = (permission: string) => {
  return async (req, res, next) => {
    const account = req["accountAdmin"] 

    // Lấy role từ DB
    const role = await Role.findOne({ _id: account.role_id })

    if (!role || !role.permissions.includes(permission)) {
      return res.status(403).json({ message: "Không có quyền truy cập" })
    }
    next()
  }
}
