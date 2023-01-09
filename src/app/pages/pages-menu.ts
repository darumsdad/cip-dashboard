import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/nbx-pages/dashboard',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/nbx-pages/iot-dashboard',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Layout',
    icon: 'layout-outline',
    children: [
      {
        title: 'Stepper',
        link: '/nbx-pages/layout/stepper',
      },
      {
        title: 'List',
        link: '/nbx-pages/layout/list',
      },
      {
        title: 'Infinite List',
        link: '/nbx-pages/layout/infinite-list',
      },
      {
        title: 'Accordion',
        link: '/nbx-pages/layout/accordion',
      },
      {
        title: 'Tabs',
        pathMatch: 'prefix',
        link: '/nbx-pages/layout/tabs',
      },
    ],
  },
  {
    title: 'Forms',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'Form Inputs',
        link: '/nbx-pages/forms/inputs',
      },
      {
        title: 'Form Layouts',
        link: '/nbx-pages/forms/layouts',
      },
      {
        title: 'Buttons',
        link: '/nbx-pages/forms/buttons',
      },
      {
        title: 'Datepicker',
        link: '/nbx-pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'UI Features',
    icon: 'keypad-outline',
    link: '/nbx-pages/ui-features',
    children: [
      {
        title: 'Grid',
        link: '/nbx-pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/nbx-pages/ui-features/icons',
      },
      {
        title: 'Typography',
        link: '/nbx-pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/nbx-pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: 'browser-outline',
    children: [
      {
        title: 'Dialog',
        link: '/nbx-pages/modal-overlays/dialog',
      },
      {
        title: 'Window',
        link: '/nbx-pages/modal-overlays/window',
      },
      {
        title: 'Popover',
        link: '/nbx-pages/modal-overlays/popover',
      },
      {
        title: 'Toastr',
        link: '/nbx-pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/nbx-pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: 'Extra Components',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'Calendar',
        link: '/nbx-pages/extra-components/calendar',
      },
      {
        title: 'Progress Bar',
        link: '/nbx-pages/extra-components/progress-bar',
      },
      {
        title: 'Spinner',
        link: '/nbx-pages/extra-components/spinner',
      },
      {
        title: 'Alert',
        link: '/nbx-pages/extra-components/alert',
      },
      {
        title: 'Calendar Kit',
        link: '/nbx-pages/extra-components/calendar-kit',
      },
      {
        title: 'Chat',
        link: '/nbx-pages/extra-components/chat',
      },
    ],
  },
  {
    title: 'Maps',
    icon: 'map-outline',
    children: [
      {
        title: 'Google Maps',
        link: '/nbx-pages/maps/gmaps',
      },
      {
        title: 'Leaflet Maps',
        link: '/nbx-pages/maps/leaflet',
      },
      {
        title: 'Bubble Maps',
        link: '/nbx-pages/maps/bubble',
      },
      {
        title: 'Search Maps',
        link: '/nbx-pages/maps/searchmap',
      },
    ],
  },
  {
    title: 'Charts',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Echarts',
        link: '/nbx-pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/nbx-pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/nbx-pages/charts/d3',
      },
    ],
  },
  {
    title: 'Editors',
    icon: 'text-outline',
    children: [
      {
        title: 'TinyMCE',
        link: '/nbx-pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/nbx-pages/editors/ckeditor',
      },
    ],
  },
  {
    title: 'Tables & Data',
    icon: 'grid-outline',
    children: [
      {
        title: 'Smart Table',
        link: '/nbx-pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/nbx-pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/nbx-pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
