'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Heading,
  Input,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employeeNumber, setEmployeeNumber] = useState(
    searchParams.get('employeeNumber') || ''
  );
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employeeNumber.trim() || !fullName.trim()) return;

    setLoading(true);
    setError('');

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeNumber: employeeNumber.trim(),
        fullName: fullName.trim(),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push(`/tab/${encodeURIComponent(employeeNumber.trim())}`);
  };

  return (
    <Container centerContent py={10} maxW="sm">
      <VStack gap={6} w="full">
        <Heading size="2xl">Nouveau compte</Heading>
        <Text color="fg.muted">Creez votre ardoise cantine</Text>
        <Input
          placeholder="Numero d'employe"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          size="lg"
        />
        <Input
          placeholder="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
          Creer
        </Button>
      </VStack>
    </Container>
  );
}
