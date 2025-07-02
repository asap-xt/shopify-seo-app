// frontend/src/components/skeletons/PageSkeleton.jsx
// A generic skeleton loading component for pages.

import { Page, Layout, Card, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';

const PageSkeleton = ({ title }) => {
  return (
    <Page title={title}>
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </Card.Section>
          </Card>
           <Card>
            <Card.Section>
              <SkeletonBodyText lines={5} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default PageSkeleton;
