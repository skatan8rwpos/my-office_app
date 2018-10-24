import 'vuetify/src/stylus/app.styl'
import gr from 'vuetify/es5/locale/gr'
import Vue from 'vue'
import Vuetify, {
  VApp, // required
  VBtn,
  VImg,
  VIcon,
  VFlex,
  VContainer,
  VContent,
  VLayout,
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VToolbarTitle,
  VSpacer,
  transitions
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'


Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VImg,
    VIcon,
    VFlex,
    VContainer,
    VContent,
    VLayout,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    transitions
  },
  directives: { Ripple },
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'mdi',
  lang: {
    locales: { gr },
    current: 'gr'
  },
})
