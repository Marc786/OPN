'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employeeNumber, setEmployeeNumber] = useState(
    searchParams.get('employeeNumber') || ''
  );
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employeeNumber.trim() || !fullName.trim()) {
      setError('Tous les champs sont requis.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeNumber: employeeNumber.trim(),
          fullName: fullName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push(`/tab/${encodeURIComponent(employeeNumber.trim())}`);
    } catch {
      setError('Erreur de connexion. Reessayez.');
      setLoading(false);
    }
  };

  return (
    <Box bg="bg.panel" borderRadius="2xl" shadow="lg" p={8}>
      <VStack gap={6} w="full">
        <VStack gap={1}>
          <Heading size="2xl" fontWeight="800" letterSpacing="-0.02em">
            Nouveau compte
          </Heading>
          <Text color="fg.muted" fontSize="md">
            Creez votre ardoise cantine
          </Text>
        </VStack>

        <VStack gap={4} w="full">
          <VStack gap={1} w="full" align="start">
            <Text fontSize="sm" fontWeight="500" color="fg.muted">
              Numero d&apos;employe
            </Text>
            <Input
              placeholder="Ex: 12345"
              value={employeeNumber}
              onChange={(e) => {
                setEmployeeNumber(e.target.value);
                setError('');
              }}
              size="lg"
              fontWeight="500"
            />
          </VStack>

          <VStack gap={1} w="full" align="start">
            <Text fontSize="sm" fontWeight="500" color="fg.muted">
              Nom complet
            </Text>
            <Input
              placeholder="Ex: Jean Tremblay"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              size="lg"
              fontWeight="500"
              autoFocus
            />
          </VStack>
        </VStack>

        {error && (
          <Text color="red.400" fontSize="sm">
            {error}
          </Text>
        )}

        <VStack gap={3} w="full">
          <Button
            w="full"
            size="xl"
            colorPalette="blue"
            onClick={handleSubmit}
            loading={loading}
            fontWeight="600"
          >
            Creer mon compte
          </Button>

          <Button
            w="full"
            variant="ghost"
            size="sm"
            color="fg.muted"
            onClick={() => router.push('/')}
          >
            Retour
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

export default function RegisterPage() {
  return (
    <Flex minH="100dvh" align="center" justify="center">
      <Container maxW="sm" px={6}>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </Container>
    </Flex>
  );
}
