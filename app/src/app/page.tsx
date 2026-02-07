'use client';

import { Button, Container, Heading, VStack } from '@chakra-ui/react';

export default function Home() {
  const handleSavePurchase = async () => {
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          amount: 5.5,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Purchase saved:', data);
      } else {
        console.error('Error saving purchase:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <Container centerContent py={10}>
      <VStack gap={4}>
        <Heading>Bell Canteen</Heading>
        <Button colorScheme="blue" size="lg" onClick={handleSavePurchase}>
          Save Mock Purchase
        </Button>
      </VStack>
    </Container>
  );
}
