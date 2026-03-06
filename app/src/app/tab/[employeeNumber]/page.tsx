'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Button,
  VStack,
  Text,
  Input,
  HStack,
  Flex,
  Separator,
} from '@chakra-ui/react';

interface Employee {
  employeeNumber: string;
  fullName: string;
  tab: number;
}

const QUICK_AMOUNTS = [1, 2, 3, 5];

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

  const handleAddAmount = async (value?: number) => {
    const finalValue = value ?? parseFloat(amount);
    if (!finalValue || finalValue <= 0) return;

    setLoading(true);
    const res = await fetch('/api/employees/tab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeNumber, amount: finalValue }),
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
    <Flex minH="100dvh" align="center" justify="center">
      <Container maxW="sm" px={6}>
        <Box bg="bg.panel" borderRadius="2xl" shadow="lg" p={8}>
          <VStack gap={6} w="full">
            {/* Header */}
            <VStack gap={0}>
              <Heading size="2xl" fontWeight="800" letterSpacing="-0.02em">
                {employee.fullName}
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                #{employee.employeeNumber}
              </Text>
            </VStack>

            {/* Balance card */}
            <Box
              w="full"
              p={6}
              borderRadius="xl"
              bg={employee.tab > 0 ? 'orange.subtle' : 'green.subtle'}
              textAlign="center"
            >
              <Text
                fontSize="sm"
                fontWeight="500"
                color={employee.tab > 0 ? 'orange.fg' : 'green.fg'}
                mb={1}
              >
                Solde actuel
              </Text>
              <Text
                fontSize="5xl"
                fontWeight="800"
                lineHeight="1"
                color={employee.tab > 0 ? 'orange.fg' : 'green.fg'}
              >
                {employee.tab.toFixed(2)}$
              </Text>
            </Box>

            <Separator />

            {/* Quick amounts */}
            <VStack gap={3} w="full">
              <Text fontSize="sm" fontWeight="500" color="fg.muted">
                Montant rapide
              </Text>
              <HStack gap={2} w="full">
                {QUICK_AMOUNTS.map((q) => (
                  <Button
                    key={q}
                    flex={1}
                    size="lg"
                    variant="outline"
                    onClick={() => handleAddAmount(q)}
                    disabled={loading}
                    fontWeight="600"
                  >
                    {q}$
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Custom amount */}
            <VStack gap={2} w="full">
              <Text fontSize="sm" fontWeight="500" color="fg.muted">
                Montant personnalise
              </Text>
              <HStack w="full" gap={2}>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAmount()}
                  size="lg"
                  fontWeight="500"
                  textAlign="center"
                />
                <Button
                  size="lg"
                  colorPalette="blue"
                  onClick={() => handleAddAmount()}
                  loading={loading}
                  fontWeight="600"
                  px={6}
                >
                  Ajouter
                </Button>
              </HStack>
            </VStack>

            <Separator />

            {/* Actions */}
            <VStack gap={3} w="full">
              <Button
                w="full"
                size="lg"
                variant="outline"
                colorPalette="red"
                onClick={handleReset}
                loading={loading}
                fontWeight="600"
              >
                Remettre a zero
              </Button>

              <Button
                w="full"
                variant="ghost"
                size="sm"
                color="fg.muted"
                onClick={() => router.push('/')}
              >
                Changer d&apos;employe
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
