'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Heading,
  Input,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';

export default function Home() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!employeeNumber.trim()) return;

    setLoading(true);
    setError('');

    const res = await fetch(
      `/api/employees/lookup?employeeNumber=${encodeURIComponent(employeeNumber.trim())}`
    );
    const data = await res.json();

    setLoading(false);

    if (data.found) {
      router.push(`/tab/${encodeURIComponent(employeeNumber.trim())}`);
    } else {
      router.push(
        `/register?employeeNumber=${encodeURIComponent(employeeNumber.trim())}`
      );
    }
  };

  return (
    <Container centerContent py={10} maxW="sm">
      <VStack gap={6} w="full">
        <Heading size="2xl">Cantine</Heading>
        <Text color="fg.muted">Entrez votre numero d&apos;employe</Text>
        <Input
          placeholder="Numero d'employe"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          size="lg"
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button
          w="full"
          size="lg"
          colorPalette="blue"
          onClick={handleSubmit}
          loading={loading}
        >
          Continuer
        </Button>
      </VStack>
    </Container>
  );
}
