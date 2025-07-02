    // frontend/src/providers/AppBridgeProvider.jsx (Final Simplified Version)
    // This version trusts the Shopify App Bridge library to handle its own initialization.

    import { Provider } from '@shopify/app-bridge-react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { Page, Spinner, Banner } from '@shopify/polaris';
    import { useMemo } from 'react';

    function AppBridgeProvider({ children }) {
      const location = useLocation();
      const navigate = useNavigate();

      const appBridgeConfig = useMemo(() => {
        const host = new URLSearchParams(location.search).get('host');
        const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

        if (apiKey && host) {
          return {
            apiKey,
            host: atob(host), // Decode the base64-encoded host
            forceRedirect: false, // Let the app handle redirects
          };
        }
        
        // When opened from the Apps list, App Bridge can often initialize without the host param.
        if (apiKey && !host) {
            return {
                apiKey,
                forceRedirect: false,
            };
        }

        return null;
      }, [location.search]);

      // If the API key is missing from the environment, we can't proceed.
      if (!import.meta.env.VITE_SHOPIFY_API_KEY) {
        return (
          <Page>
            <Banner title="Application Configuration Error" tone="critical">
              <p>The VITE_SHOPIFY_API_KEY environment variable is not set. Please check your Railway deployment variables.</p>
            </Banner>
          </Page>
        );
      }

      // If the host is missing from the URL, it means we are not inside Shopify.
      // This is the state that causes the blank screen.
      if (!new URLSearchParams(location.search).get('host')) {
        return (
             <Page>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner />
                </div>
             </Page>
        );
      }

      return (
        <Provider config={appBridgeConfig} router={{ location, navigate }}>
          {children}
        </Provider>
      );
    }

    export default AppBridgeProvider;
    