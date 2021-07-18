// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
//
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
// const whiteList = ['/login'] // no redirect whitelist
//
// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//
//   // set page title
//   document.title = getPageTitle(to.meta.title)
//
//   // determine whether the user has logged in
//   const hasToken = getToken()
//
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')
//
//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//
//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })
//
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
import router from './router'
import { suAdminRoutes } from './router'
import { facAdminRoutes } from './router'
import { dealerRoutes } from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = Cookies.get('type')

  // var hasToken = true

  if (hasToken) {
    if (to.path === '/login') {
      //   alert('already')
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log('get options', router.options)
      console.log(hasToken === '0')
      // alert('here')
      // console.log('get',sessionStorage.getItem('loaded'))
      if (router.options.routes.length === 4) {
        if (hasToken === '0') {
          router.addRoutes(suAdminRoutes)
          // router.options.routes = baseRoutes
          router.options.routes = router.options.routes.concat(suAdminRoutes)
        } else if (hasToken === '1') {
          router.addRoutes(facAdminRoutes)
          router.options.routes = router.options.routes.concat(facAdminRoutes)
        } else if (hasToken === '2') {
          router.addRoutes(dealerRoutes)
          router.options.routes = router.options.routes.concat(dealerRoutes)
        }
        // router.options.routes = newRoutes
        // sessionStorage.setItem('loaded', 'true')
        console.log(router.options.routes)
        next({ ...to, replace: true })
      }
      next()
    }
  } else {
    /* has no token*/
    // router.addRoutes(baseRoutes)
    // router.options.routes = baseRoutes
    // router.options.routes = router.options.routes.concat(baseRoutes)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // Message.error({
      //   message: '未登录',
      //   duration: 1500 })
      // NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
