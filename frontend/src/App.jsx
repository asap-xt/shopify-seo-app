// frontend/src/App.jsx (Super-Simple Debug Version)
// This file is temporarily simplified to its absolute minimum to test rendering.

import { Page, Text } from '@shopify/polaris';

function App() {
  // We are not using any navigation, frames, or complex components.
  // We are just trying to render a single page with text.
  console.log("--- Simple App.jsx is rendering ---");

  return (
    <Page title="Debug Test">
      <Text variant="headingLg" as="h1">
        Здравей, свят!
      </Text>
      <p>
        Ако виждате този текст, значи основната част на приложението работи.
      </p>
    </Page>
  );
}

export default App;
