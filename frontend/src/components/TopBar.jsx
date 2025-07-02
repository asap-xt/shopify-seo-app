// frontend/src/components/TopBar.jsx
// This component defines the top bar of the application, which includes
// the user menu and secondary actions.

import { TopBar } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useShop } from '../hooks/useShop';

function TopBarMarkup() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Fetch shop data to display the shop name and owner initials
    const { data: shopData } = useShop();

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((prev) => !prev),
        [],
    );

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[
                { items: [{ content: 'Community forum', url: '#', helpText: 'Opens in a new tab' }] },
            ]}
            name={shopData?.shop?.name || 'Merchant'}
            detail={shopData?.shop?.domain || ''}
            initials={shopData?.shop?.name?.charAt(0).toUpperCase() || 'M'}
            open={isUserMenuOpen}
            onToggle={toggleIsUserMenuOpen}
        />
    );

    return (
        <TopBar
            showNavigationToggle // This shows the hamburger menu on mobile
            userMenu={userMenuMarkup}
        />
    );
}

export default TopBarMarkup;