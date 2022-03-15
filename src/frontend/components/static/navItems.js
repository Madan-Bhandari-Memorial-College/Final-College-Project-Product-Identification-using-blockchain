import {
    AiOutlinePieChart,
    AiOutlinePlusCircle,
    AiOutlineGift,
  } from 'react-icons/ai'
  import { BiTrendingUp } from 'react-icons/bi'
  import { RiCoinsLine, RiNotification3Line } from 'react-icons/ri'
  import { MdWeb } from 'react-icons/md'
  import { BsPersonPlus } from 'react-icons/bs'
  
  export const navItems = [
    {
      title: 'Profile',
      icon: <AiOutlinePieChart />,
      to: '/'
    },
    {
      title: 'Sale Product',
      icon: <AiOutlinePlusCircle />,
      to: '/create'
    },
    {
      title: 'Listed Products',
      icon: <RiCoinsLine />,
      to: '/my-listed-items'

    },
    {
      title: 'Purchases',
      icon: <MdWeb />,
      to: '/my-purchases'

    }
  ]