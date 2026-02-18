/* eslint-disable @typescript-eslint/no-explicit-any */

const FieldErrorAlert = ({ errors, fieldName }: { errors: any, fieldName: string }) => {
  if (!errors || !errors[fieldName]) return null
  return (
    <p className="text-red-500 text-[14px] mt-1">{errors[fieldName]?.message}</p>
  )
}

export default FieldErrorAlert