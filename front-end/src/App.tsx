import { Route, Routes } from 'react-router-dom'
import LayoutDefaultAdmin from '~/layouts/admin/layoutDefault/LayoutDefault'
import Home from '~/pages/client/home'
import AOS from 'aos'
import 'aos'
import { useEffect } from 'react'
import Statistic from '~/pages/adminn/statisticc/Statistic'
import Account from '~/pages/adminn/accountt'
import ArticleAdmin from '~/pages/adminn/articlee'
import ArticleCategoryAdmin from '~/pages/adminn/articleCategoryy'
import MyAccountAdmin from '~/pages/adminn/myAccountt'
import ProductAdmin from '~/pages/adminn/productt'
import ProductCategoryAdmin from '~/pages/adminn/productCategoryy'
import Role from '~/pages/adminn/rolee'
import General from '~/pages/adminn/settingg/General/General'
import Advance from '~/pages/adminn/settingg/Advance/Advance'
import User from '~/pages/adminn/userr'
import Login from '~/pages/adminn/authh/Login'
import Permission from '~/pages/adminn/rolee/Permission'
import EditMyAccount from '~/pages/adminn/myAccountt/Edit'
import DetailProduct from '~/pages/adminn/productt/Detail'
import EditProduct from '~/pages/adminn/productt/Edit'
import CreateProduct from '~/pages/adminn/productt/Create'
import CreateProductCategory from '~/pages/adminn/productCategoryy/Create'
import DetailProductCategory from '~/pages/adminn/productCategoryy/Detail'
import EditProductCategory from '~/pages/adminn/productCategoryy/Edit'
import CreateArticle from '~/pages/adminn/articlee/Create'
import DetailArticle from '~/pages/adminn/articlee/Detail'
import EditArticle from '~/pages/adminn/articlee/Edit'
import DetailArticleCategory from '~/pages/adminn/articleCategoryy/Detail'
import EditArticleCategory from '~/pages/adminn/articleCategoryy/Edit'
import CreateArticleCategory from '~/pages/adminn/articleCategoryy/Create'
import DetailRole from '~/pages/adminn/rolee/Detail'
import EditRole from '~/pages/adminn/rolee/Edit'
import CreateRole from '~/pages/adminn/rolee/Create'
import CreateAccount from '~/pages/adminn/accountt/Create'
import DetailAccount from '~/pages/adminn/accountt/Detail'
import EditAccount from '~/pages/adminn/accountt/Edit'
import DetailUser from '~/pages/adminn/userr/Detail'
import EditUser from '~/pages/adminn/userr/Edit'
import EditSettingGeneral from '~/pages/adminn/settingg/General/Edit'
import LoginClient from '~/pages/client/auth/Login/Login'
import RegisterClient from '~/pages/client/auth/Register/Register'
import Forgot from '~/pages/client/auth/Password/Forgot/Forgot'
import Reset from '~/pages/client/auth/Password/Reset/Reset'
import PrivateRouteAdmin from '~/components/admin/privateRoute/PrivateRoute '
import PrivateRouteClient from '~/components/client/privateRoute/PrivateRoute'
import MyAccountClient from '~/pages/client/myAccount'
import EditMyAccountClient from '~/pages/client/myAccount/Edit'
import ChangePassword from '~/pages/client/myAccount/ChangePassword'
import LayoutUser from '~/layouts/client/layoutUser/LayoutUser'
import ForgotPassword from '~/pages/adminn/authh/ForgotPassword'
import ProductClient from '~/pages/client/product'
import Cart from '~/pages/client/cart'
import Checkout from '~/pages/client/checkout'
import Success from '~/pages/client/checkout/Success'
import OrderAdmin from '~/pages/adminn/orderr'
import DetailOrder from '~/pages/adminn/orderr/Detail'
import Notification from '~/pages/adminn/notificationn'
import ProductCategory from '~/pages/client/product/Category'
import ProductsNew from '~/pages/client/product/ProductsNew'
import ProductsFeatured from '~/pages/client/product/ProductsFeatured'
import ArticlesNew from '~/pages/client/article/ArticlesNew'
import ArticlesFeatured from '~/pages/client/article/ArticlesFeatured'
import ArticleClient from '~/pages/client/article'
import ArticleCategory from '~/pages/client/article/Category'
import Search from '~/components/client/search/Search'
import DetailProductClient from '~/pages/client/product/Detail'
import DetailArticleClient from '~/pages/client/article/Detail'
import MyOrders from '~/pages/client/myAccount/MyOrders'
import HelpCenter from '~/pages/client/helpCenter/HelpCenter'
import ScrollToTop from '~/components/scrollToTop/ScrollToTop'
import BrandAdmin from '~/pages/adminn/brandd'
import CreateBrand from '~/pages/adminn/brandd/Create'
import EditBrand from '~/pages/adminn/brandd/Edit'
import BrandPage from '~/pages/client/brand/Brand'
import AdminChat from '~/pages/adminn/adminChatt/AdminChat'
import GoogleCallback from './pages/client/googleCallback/GoogleCallback'
import { Error404Page } from './pages/error404Pagee/Error404Page'
import UnauthorizedRoutesAdmin from './components/admin/unauthorizedRoutes/UnauthorizedRoutes'
import TrashOrder from './pages/adminn/orderr/TrashOrder'
import TrashProductCategory from './pages/adminn/productCategoryy/TrashProductCategory'
import TrashProduct from './pages/adminn/productt/TrashProduct'
import AdminWelcome from './pages/adminn/adminWelcomee/AdminWelcome'
import UnauthorizedRoutesClient from './components/client/unauthorizedRoutes/UnauthorizedRoutes'
import { AdminProviders, ClientProviders } from './AppProviders'
import LayoutDefaultClient from '~/layouts/client/layoutDefault/LayoutDefault'
import LayoutAuthClient from '~/layouts/client/layoutAuth/LayoutAuth'
import FAQ from './pages/client/helpCenter/FAQ'
import ShippingPolicy from './pages/client/helpCenter/ShippingPolicy'
import ReturnPolicy from './pages/client/helpCenter/ReturnPolicy'

function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    })
    AOS.refresh() // đảm bảo refresh lại khi nội dung động
  }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* --- NHÓM CLIENT --- */}
        <Route path='/' element={
          <ClientProviders>
            <LayoutDefaultClient />
          </ClientProviders>
        }>
          <Route index element={<Home />}/>
          <Route path='search' element={<Search />}/>
          <Route path='help' element={<HelpCenter />} />
          <Route path='faq' element={<FAQ />}/>
          <Route path='shipping-policy' element={<ShippingPolicy />}/>
          <Route path='return-policy' element={<ReturnPolicy />}/>
          <Route path='brands' element={<BrandPage />}/>
          <Route path='products'>
            <Route index element={<ProductClient />}/>
            <Route path=':slugCategory' element={<ProductCategory />}/>
            <Route path='detail/:slugProduct' element={<DetailProductClient />}/>
            <Route path='productsNew' element={<ProductsNew />}/>
            <Route path='productsFeatured' element={<ProductsFeatured />}/>
          </Route>
          <Route path='articles'>
            <Route index element={<ArticleClient />}/>
            <Route path=':slugCategory' element={<ArticleCategory />}/>
            <Route path='detail/:slugArticle' element={<DetailArticleClient />}/>
            <Route path='articlesNew' element={<ArticlesNew />}/>
            <Route path='articlesFeatured' element={<ArticlesFeatured />}/>
          </Route>
          <Route path='cart' element={<Cart />}/>
          <Route path='checkout' element={<PrivateRouteClient><Checkout /></PrivateRouteClient>}/>
          <Route path='checkout/success/:orderId' element={<PrivateRouteClient><Success /></PrivateRouteClient>}/>
          <Route path='user' element={<PrivateRouteClient><LayoutUser /></PrivateRouteClient>}>
            <Route path='notification'></Route>
            <Route path='account'>
              <Route path='info'>
                <Route index element={ <MyAccountClient />} />
                <Route path='edit' element={ <EditMyAccountClient />}/>
                <Route path='change-password' element={ <ChangePassword />}/>
              </Route>
              <Route path='payment'></Route>
              <Route path='address'></Route>
              <Route path='setting-privacy'></Route>
            </Route>
            <Route path='my-orders' element={ <MyOrders />}/>
            <Route path='voucher-wallet'></Route>
            <Route path='coin'></Route>
          </Route>
        </Route>
        <Route path='user' element={
          <ClientProviders>
            <UnauthorizedRoutesClient>
              <LayoutAuthClient />
            </UnauthorizedRoutesClient>
          </ClientProviders>
        }>
          <Route path='login' element={<LoginClient />} />
          <Route path='register' element={<RegisterClient />} />
          <Route path='password'>
            <Route path='forgot' element={ <Forgot />}/>
            {/* <Route path='otp' element={ <OTP />}/> */}
            <Route path='reset' element={ <Reset />}/>
          </Route>
        </Route>
        <Route path="/auth/google/callback" element={
          <ClientProviders>
            <GoogleCallback />
          </ClientProviders>}
        />
        {/* --- HẾT NHÓM CLIENT --- */}

        {/* --- NHÓM ADMIN --- */}
        <Route path='admin' element={
          <AdminProviders>
            <PrivateRouteAdmin>
              <LayoutDefaultAdmin />
            </PrivateRouteAdmin>
          </AdminProviders>
        }>
          <Route path='admin-welcome' element={ <AdminWelcome />} />
          <Route path='statistics' element={ <Statistic />}/>
          <Route path='orders'>
            <Route index element={ <OrderAdmin />}/>
            <Route path='detail/:id' element={<DetailOrder />}/>
            <Route path='trash' element={<TrashOrder />}/>
          </Route>
          <Route path='notification' element={<Notification />}/>
          <Route path='brands'>
            <Route index element={<BrandAdmin />}/>
            <Route path='create' element={ <CreateBrand />}/>
            <Route path='edit/:id' element={ <EditBrand />}/>
            {/* <Route path='detail/:id' element={ <DetailBrand />}/> */}
          </Route>
          <Route path='products'>
            <Route index element={ <ProductAdmin />}/>
            <Route path='create' element={<CreateProduct />}/>
            <Route path='detail/:id' element={ <DetailProduct />}/>
            <Route path='edit/:id' element={<EditProduct />}/>
            <Route path='trash' element={<TrashProduct />}/>
          </Route>
          <Route path='products-category'>
            <Route index element={<ProductCategoryAdmin />}/>
            <Route path='create' element={<CreateProductCategory />}/>
            <Route path='detail/:id' element={ <DetailProductCategory />}/>
            <Route path='edit/:id' element={<EditProductCategory />}/>
            <Route path='trash' element={<TrashProductCategory />}/>
          </Route>
          <Route path='articles'>
            <Route index element={ <ArticleAdmin />}/>
            <Route path='create' element={ <CreateArticle />}/>
            <Route path='detail/:id' element={ <DetailArticle />}/>
            <Route path='edit/:id' element={ <EditArticle />}/>
          </Route>
          <Route path='articles-category'>
            <Route index element={ <ArticleCategoryAdmin />}/>
            <Route path='create' element={ <CreateArticleCategory />}/>
            <Route path='detail/:id' element={ <DetailArticleCategory />}/>
            <Route path='edit/:id' element={ <EditArticleCategory />}/>
          </Route>
          <Route path='roles'>
            <Route index element={ <Role />} />
            <Route path='create' element={ <CreateRole />} />
            <Route path='detail/:id' element={ <DetailRole />} />
            <Route path='edit/:id' element={ <EditRole />} />
            <Route path='permissions' element={<Permission />} />
          </Route>
          <Route path='accounts'>
            <Route index element={ <Account />}/>
            <Route path='create' element={ <CreateAccount />}/>
            <Route path='detail/:id' element={ <DetailAccount />}/>
            <Route path='edit/:id' element={ <EditAccount />}/>
          </Route>
          <Route path='users'>
            <Route index element={<User />}/>
            <Route path='detail/:id' element={<DetailUser />}/>
            <Route path='edit/:id' element={<EditUser />}/>
          </Route>
          <Route path='my-account'>
            <Route index element={ <MyAccountAdmin />}/>
            <Route path='edit' element={ <EditMyAccount />}/>
          </Route>
          <Route path='chats' element={ <AdminChat />}/>
          <Route path='settings'>
            <Route path='general'>
              <Route index element={<General />}/>
              <Route path='edit' element={<EditSettingGeneral />}/>
            </Route>
            <Route path='advance' element={<Advance />}/>
          </Route>
        </Route>
        <Route path='admin/auth' element={
          <AdminProviders>
            <UnauthorizedRoutesAdmin />
          </AdminProviders>
        }>
          <Route path='login' element={ <Login />}/>
          <Route path='forgot-password' element={<ForgotPassword />}/>
        </Route>
        {/* --- HẾT NHÓM ADMIN --- */}

        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  )
}

export default App
