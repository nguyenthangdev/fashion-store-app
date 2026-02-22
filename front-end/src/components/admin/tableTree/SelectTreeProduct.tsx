import type { ProductCategoryInfoInterface } from '~/interfaces/productCategory.interface'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  // allProductCategories: ProductCategoryInfoInterface[]
  // parent_id: string
}

const SelectTreeProduct = ({ productCategory, level }: Props) => {
  const prefix = '- '.repeat(level)

  return (
    <>
      <option value={productCategory._id}>
        {prefix}{productCategory.title}
      </option>
      {productCategory.children?.map((child) => (
        <SelectTreeProduct
          key={child._id}
          productCategory={child}
          level={level + 1}
        />
      ))}
    </>
  )
}

export default SelectTreeProduct