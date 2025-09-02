    'use client';

    import { OnchainKitProvider } from '@coinbase/onchainkit';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { WagmiProvider, createConfig } from 'wagmi';
    import { http } from 'viem';
    import { base } from 'viem/chains';
    import { useState } from 'react';

    const config = createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    });

    export function Providers({ children }) {
      const [queryClient] = useState(() => new QueryClient());

      return (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={base}
              config={{
                appearance: {
                  mode: 'dark',
                  theme: 'default',
                  name: 'TradeGuard',
                },
              }}
            >
              {children}
            </OnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      );
    }
  