import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Events',
    icon: 'calendar-outline',
    link: '/cip-pages/events',
    home: true,
  },

  {
    title: 'E-commerce',
    icon: 'shopping-cart-outline',
    link: '/ngx-pages/dashboard',
    home: true,
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
        title: 'Logout',
        link: '/auth/logout',
      }
      
    ],
  },
 
];
