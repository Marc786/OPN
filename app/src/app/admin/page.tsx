'use client';

import { Container, Tabs } from '@chakra-ui/react';

export default function AdminPage() {
  return (
    <Container py={8}>
      <Tabs.Root defaultValue="users">
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="items">Items</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="users" />
        <Tabs.Content value="items" />
      </Tabs.Root>
    </Container>
  );
}
