// frontend/src/App.jsx (Test 1: Testing Polaris rendering)

import { Page, Text, Card } from '@shopify/polaris';

function App() {
  console.log("--- Test 1: App.jsx with Polaris is rendering ---");

  return (
    <Page title="Polaris Тест">
      <Card>
        <div style={{ padding: '20px' }}>
          <Text variant="headingLg" as="h1">
            Polaris работи!
          </Text>
          <p>
            Ако виждате тази страница, значи проблемът не е в React Router или Polaris.
          </p>
          <p>
            Следващата стъпка е да добавим AppBridgeProvider, който е най-вероятният "виновник".
          </p>
        </div>
      </Card>
    </Page>
  );
}

export default App;
