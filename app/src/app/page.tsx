'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Flex,
} from '@chakra-ui/react';

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
    <Flex minH="100dvh" align="center" justify="center">
      <Container maxW="sm" px={6}>
        <Box bg="bg.panel" borderRadius="2xl" shadow="lg" p={8}>
          <VStack gap={6} w="full">
            <VStack gap={1}>
              <Heading size="3xl" fontWeight="800" letterSpacing="-0.02em">
                Cantine
              </Heading>
              <Text color="fg.muted" fontSize="md">
                Entrez votre numero d&apos;employe
              </Text>
            </VStack>

            <Input
              placeholder="Ex: 12345"
              value={employeeNumber}
              onChange={(e) => {
                setEmployeeNumber(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              size="xl"
              textAlign="center"
              fontSize="2xl"
              fontWeight="600"
              letterSpacing="0.1em"
              autoFocus
            />

            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Button
              w="full"
              size="xl"
              colorPalette="blue"
              onClick={handleSubmit}
              loading={loading}
              fontWeight="600"
            >
              Continuer
            </Button>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
