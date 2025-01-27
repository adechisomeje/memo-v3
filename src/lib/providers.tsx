// 'use client'

// // import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { Toaster } from '@/components/ui/sonner'
// // import { GlobalAlertDialog } from '../components/global-alert-dialog';

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       retry: 3,
// //       retryDelay: 1000,
// //       staleTime: 90000,
// //     },
// //   },
// // });

// export default function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       {/* <GlobalAlertDialog /> */}
//       <Toaster position='top-center' />
//     </QueryClientProvider>
//   )
// }
