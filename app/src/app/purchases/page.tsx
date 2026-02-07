'use client';

import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Purchase {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases');
      const data = await response.json();
      console.log('All purchases:', data);
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPurchases();
  }, []);

  return (
    <Container centerContent py={10}>
      <VStack gap={4} align="stretch">
        <Heading>All Purchases</Heading>
        <Button colorScheme="blue" onClick={fetchPurchases}>
          Refresh & Log to Console
        </Button>
        <Text fontSize="sm" color="gray.600">
          Check your browser console for logs
        </Text>
        <VStack align="stretch" gap={2}>
          {purchases.map(purchase => (
            <Text key={purchase.id}>
              {purchase.name} - ${purchase.amount} -{' '}
              {new Date(purchase.timestamp).toLocaleString()}
            </Text>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}
