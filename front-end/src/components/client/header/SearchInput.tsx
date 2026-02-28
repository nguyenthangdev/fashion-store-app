import { memo, type FormEvent } from 'react'
import { IoSearch } from 'react-icons/io5'

export interface SearchInputProps {
  onSearchSubmit: () => void
  // eslint-disable-next-line no-unused-vars
  onTermChange: (term: string) => void
  isMobile?: boolean,
  inputValue: string
}

const SearchInput = ({ onSearchSubmit, onTermChange, inputValue, isMobile = false }: SearchInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit()
  }

  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTermChange(event.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-x-[12px] px-[16px] py-[10px] bg-[#F0F0F0] rounded-[62px] text-[16px] ${isMobile ? 'w-full' : 'flex-1 lg:flex hidden'}`}>
      <button type="submit" className="text-[#00000066]">
        <IoSearch />
      </button>
      <input
        onChange={handleChangeKeyword}
        className="bg-transparent flex-1 outline-none"
        type="text"
        name="keyword"
        value={inputValue}
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
      />
    </form>
  )
}

export default memo(SearchInput)

