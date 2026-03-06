'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heading, Input, Button, VStack, Text, Flex } from '@chakra-ui/react';

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
          size={{ base: '3xl', md: '5xl' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          Nouveau compte
        </Heading>
        <Text color="fg.muted" fontSize={{ base: 'lg', md: 'xl' }}>
          Creez votre ardoise cantine
        </Text>
      </VStack>

      <VStack gap={8} w="full" maxW="600px">
        <VStack gap={2} w="full" align="start">
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" color="fg.muted">
            Numero d&apos;employe
          </Text>
          <Input
            placeholder="Ex: 12345"
            value={employeeNumber}
            onChange={(e) => {
              setEmployeeNumber(e.target.value);
              setError('');
            }}
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="500"
            py={8}
            h="auto"
          />
        </VStack>

        <VStack gap={2} w="full" align="start">
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" color="fg.muted">
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
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="500"
            py={8}
            h="auto"
            autoFocus
          />
        </VStack>

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
          Creer mon compte
        </Button>

        <Button
          w="full"
          variant="ghost"
          size="lg"
          color="fg.muted"
          fontSize="lg"
          onClick={() => router.push('/')}
        >
          Retour
        </Button>
      </VStack>
    </Flex>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
