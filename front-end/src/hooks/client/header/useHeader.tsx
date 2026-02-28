/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { fetchLogoutAPI } from '~/apis/client/auth.api'
import { useSettingGeneral } from '~/contexts/client/SettingGeneralContext'
import { fetchHomeAPI } from '~/apis/client/home.api'
import { useHome } from '~/contexts/client/HomeContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductInfoInterface } from '~/interfaces/product.interface'
import { fetchSearchSuggestionsAPI } from '~/apis/client/product.api'
import { useAuth } from '~/contexts/client/AuthContext'

const useHeader = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const [accountUser, setAccountUser] = useState<UserInfoInterface | null>(null)

  const [openProduct, setOpenProduct] = useState(false)
  const [openArticle, setOpenArticle] = useState(false)

  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '')
  const [suggestions, setSuggestions] = useState<ProductInfoInterface[]>([])
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)

  // Ref để cuộn xuống dưới khi người dùng bấm "Xem thêm"
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { accountUser, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const { dispatchAlert } = useAlertContext()
  const { dataHome, setDataHome } = useHome()
  const { settingGeneral } = useSettingGeneral()
  const { cartDetail } = useCart()

  const [closeTopHeader, setCloseTopHeader] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('closeTopHeader')
    return saved === 'true'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const homeRes = await fetchHomeAPI()
        setDataHome(homeRes)
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi fetch home', severity: 'error' }
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatchAlert])

  // useEffect cho debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    // Ngăn việc gọi api quá nhiều sau mỗi lần gõ
    const delayDebounceFn = setTimeout(async () => {
      setIsSuggestLoading(true)
      try {
        const response = await fetchSearchSuggestionsAPI(searchTerm)
        if (response.code === 200) {
          setSuggestions(response.products)
          setVisibleCount(4)
        }
      } catch (error) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: 'Lỗi khi fetch gợi ý', severity: 'error' }
        })
        setSuggestions([])
      } finally {
        setIsSuggestLoading(false)
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)

    // Code bị spam gọi api sau mỗi lần gõ
    // const fetchData = async () => {
    //   setIsSuggestLoading(true)
    //   try {
    //     const response = await fetchSearchSuggestionsAPI(searchTerm)
    //     if (response.code === 200) {
    //       setSuggestions(response.products)
    //       setVisibleCount(4)
    //     }
    //   } catch (error) {
    //     dispatchAlert({
    //       type: 'SHOW_ALERT',
    //       payload: { message: 'Lỗi khi fetch gợi ý', severity: 'error' }
    //     })
    //     setSuggestions([])
    //   } finally {
    //     setIsSuggestLoading(false)
    //   }
    // }
    // fetchData()
  }, [dispatchAlert, searchTerm])

  // Khóa cuộn trang khi menu/search mobile mở
  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen, isMobileSearchOpen])

  // Đồng bộ state với URL (nếu người dùng bấm back/forward)
  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '')
  }, [searchParams])

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      sessionStorage.setItem('closeTopHeader', 'false')
      setCloseTopHeader(false)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      // setAccountUser(null)
      await logout()
      navigate('/')
    } else {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  const handleCloseTopHeader = () => {
    setCloseTopHeader(true)
    sessionStorage.setItem('closeTopHeader', 'true')
  }

  const handleSearchTermChange = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleSearchSubmit = () => {
    setSuggestions([])
    setIsMobileSearchOpen(false) // Đóng search overlay khi submit

    // Thêm logic điều hướng
    const newParams = new URLSearchParams(searchParams)
    if (searchTerm) {
      newParams.set('keyword', searchTerm)
    } else {
      newParams.delete('keyword')
    }
    newParams.set('page', '1')

    // Nếu đang ở trang khác, chuyển về /search. Nếu đã ở /search, chỉ cập nhật URL
    if (!window.location.pathname.startsWith('/search')) {
      navigate(`/search?${newParams.toString()}`)
    } else {
      setSearchParams(newParams)
    }
  }

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4)
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [visibleCount])

  const toggleMobileMenu = () => {
    setIsMobileSearchOpen(false) // Đóng search nếu mở nav
    setIsMobileMenuOpen(prev => !prev) // Đảo ngược trạng thái menu (mở nếu đang đóng, đóng nếu đang mở)
  }

  const toggleMobileSearch = () => {
    setIsMobileMenuOpen(false) // Đóng nav nếu mở search
    setIsMobileSearchOpen(prev => !prev)
  }

  return {
    accountUser,
    closeTopHeader,
    handleCloseTopHeader,
    settingGeneral,
    setOpenProduct,
    openProduct,
    dataHome,
    setOpenArticle,
    handleSearchSubmit,
    handleSearchTermChange,
    openArticle,
    suggestions,
    scrollContainerRef,
    visibleCount,
    setSuggestions,
    isSuggestLoading,
    handleShowMore,
    cartDetail,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl,
    handleLogout,
    isMobileMenuOpen,
    isMobileSearchOpen,
    toggleMobileMenu,
    toggleMobileSearch,
    searchTerm,
    isLoading
  }
}

export default useHeader

