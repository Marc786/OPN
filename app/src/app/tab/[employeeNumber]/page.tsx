'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Heading,
  Button,
  VStack,
  Text,
  Input,
  HStack,
} from '@chakra-ui/react';

interface Employee {
  employeeNumber: string;
  fullName: string;
  tab: number;
}

export default function TabPage({
  params,
}: {
  params: Promise<{ employeeNumber: string }>;
}) {
  const { employeeNumber } = use(params);
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployee = async () => {
    const res = await fetch(
      `/api/employees/lookup?employeeNumber=${encodeURIComponent(employeeNumber)}`
    );
    const data = await res.json();
    if (data.found) {
      setEmployee(data.employee);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeNumber]);

  const handleAddAmount = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    setLoading(true);
    const res = await fetch('/api/employees/tab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeNumber, amount: value }),
    });

    if (res.ok) {
      const data = await res.json();
      setEmployee(data);
      setAmount('');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    const res = await fetch('/api/employees/tab', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeNumber }),
    });

    if (res.ok) {
      const data = await res.json();
      setEmployee(data);
    }
    setLoading(false);
  };

  if (!employee) return null;

  return (
    <Container centerContent py={10} maxW="sm">
      <VStack gap={6} w="full">
        <Heading size="2xl">Cantine</Heading>
        <Text fontSize="lg" color="fg.muted">
          {employee.fullName}
        </Text>

        <VStack
          gap={2}
          p={6}
          bg="bg.subtle"
          borderRadius="lg"
          w="full"
          align="center"
        >
          <Text fontSize="sm" color="fg.muted">
            Solde actuel
          </Text>
          <Text fontSize="4xl" fontWeight="bold">
            {employee.tab.toFixed(2)} $
          </Text>
        </VStack>

        <HStack w="full">
          <Input
            placeholder="Montant"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAmount()}
            size="lg"
          />
          <Button
            size="lg"
            colorPalette="blue"
            onClick={handleAddAmount}
            loading={loading}
          >
            Ajouter
          </Button>
        </HStack>

        <Button
          w="full"
          size="lg"
          variant="outline"
          colorPalette="red"
          onClick={handleReset}
          loading={loading}
        >
          Remettre a zero
        </Button>

        <Button
          w="full"
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
        >
          Retour
        </Button>
      </VStack>
    </Container>
  );
}
