import { Footer } from '../../components/Footer/footer'
import Navbar from './components/navbar'

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Resources',
    href: '/resources',
    subItems: [
      { label: 'Create Shipment', href: '/ship' },
      { label: 'Get a quote', href: '/get-a-quote' },
      { label: 'Track', href: '/track' },
    ],
  },
  {
    label: 'Developers',
    href: '/developers',
    subItems: [
      { label: 'Riders', href: '/riders' },
      { label: 'Rider scout', href: '/job-riders' },
    ],
  },
  {
    label: 'Blogs',
    href: '/sign-in',
  },
]

const mobileNavItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Resources',
    href: '/resources',
    subItems: [
      { label: 'Create Shipment', href: '/ship' },
      { label: 'Get a quote', href: '/get-a-quote' },
      { label: 'Track', href: '/track' },
    ],
  },
  {
    label: 'Contact us',
    href: '/job-riders',
    subItems: [
      { label: 'Riders', href: '/riders' },
      { label: 'Rider scout', href: '/job-riders' },
    ],
  },
  {
    label: 'Blog',
    href: '/sign-in',
    subItems: [
      { label: 'Blog', href: '/blog' },
      { label: 'User Case', href: '/user-case' },
    ],
  },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar
        navItems={navItems}
        mobileNavItems={mobileNavItems}
        ctaLink='/get-started'
      />
      <div className=''>{children}</div>

      <Footer />
    </div>
  )
}
