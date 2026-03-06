'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Input, Button, VStack, Text, Flex } from '@chakra-ui/react';

export default function Home() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!employeeNumber.trim()) {
      setError('Veuillez entrer un numero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/employees/lookup?employeeNumber=${encodeURIComponent(employeeNumber.trim())}`
      );
      const data = await res.json();

      if (data.found) {
        router.push(`/tab/${encodeURIComponent(employeeNumber.trim())}`);
      } else {
        router.push(
          `/register?employeeNumber=${encodeURIComponent(employeeNumber.trim())}`
        );
      }
    } catch {
      setError('Erreur de connexion. Reessayez.');
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100dvh"
      align="center"
      justify="center"
      px={8}
      py={10}
      direction="column"
      gap={10}
    >
      <VStack gap={2}>
        <Heading
          size={{ base: '4xl', md: '6xl' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          Cantine
        </Heading>
        <Text color="fg.muted" fontSize={{ base: 'lg', md: 'xl' }}>
          Entrez votre numero d&apos;employe
        </Text>
      </VStack>

      <VStack gap={8} w="full" maxW="600px">
        <Input
          placeholder="Ex: 12345"
          value={employeeNumber}
          onChange={(e) => {
            setEmployeeNumber(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          textAlign="center"
          fontSize={{ base: '3xl', md: '5xl' }}
          fontWeight="600"
          letterSpacing="0.1em"
          py={10}
          h="auto"
          autoFocus
        />

        {error && (
          <Text color="red.400" fontSize="lg">
            {error}
          </Text>
        )}

        <Button
          w="full"
          h="auto"
          py={6}
          colorPalette="blue"
          onClick={handleSubmit}
          loading={loading}
          fontWeight="600"
          fontSize={{ base: 'xl', md: '2xl' }}
        >
          Continuer
        </Button>
      </VStack>
    </Flex>
  );
}
