// frontend/src/App.jsx (Test 1: Testing Polaris rendering)

import { Page, Text, Card, LegacyCard, Button } from '@shopify/polaris';

function App() {
  console.log("--- Test 1: App.jsx with Polaris is rendering ---");

  return (
    <Page title="Polaris Тест">
      <LegacyCard sectioned>
        <Text variant="headingLg" as="h1">
          Polaris работи!
        </Text>
        <p>
          Ако виждате тази страница, значи проблемът не е в React Router или Polaris.
        </p>
        <p>
          Следващата стъпка е да добавим AppBridgeProvider, който е най-вероятният "виновник".
        </p>
        <br />
        <Button variant="primary" onClick={() => alert('Button works!')}>Тествай бутона</Button>
      </LegacyCard>
    </Page>
  );
}

export default App;
