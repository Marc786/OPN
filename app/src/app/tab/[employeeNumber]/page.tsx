'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Input,
  HStack,
  Flex,
  Separator,
  IconButton,
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
  const [pendingTotal, setPendingTotal] = useState(0);

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

  const addPending = (value: number) => {
    if (!value) return;
    setPendingTotal((prev) => prev + value);
    setAmount('');
  };

  const handleSave = async () => {
    if (!employee) return;

    if (pendingTotal === 0) {
      router.push('/');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/employees/tab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeNumber, amount: pendingTotal }),
    });

    if (res.ok) {
      router.push('/');
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
      setPendingTotal(0);
    }
    setLoading(false);
  };

  const parsedAmount = parseFloat(amount);
  const hasValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const hasPending = pendingTotal !== 0;
  const projectedTab = employee ? employee.tab + pendingTotal : 0;

  if (!employee) return null;

  return (
    <Flex minH="100dvh" direction="column" px={8} py={6}>
      {/* Top bar */}
      <Flex justify="space-between" align="center">
        <VStack align="start" gap={0}>
          <Heading
            size={{ base: '2xl', md: '4xl' }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            {employee.fullName}
          </Heading>
          <Text color="fg.muted" fontSize={{ base: 'md', md: 'lg' }}>
            #{employee.employeeNumber}
          </Text>
        </VStack>
        <IconButton
          aria-label="Fermer"
          variant="outline"
          size="lg"
          color="fg.muted"
          fontSize="xl"
          onClick={() => router.push('/')}
        >
          ✕
        </IconButton>
      </Flex>

      {/* Main content */}
      <Flex flex={1} direction="column" justify="center" gap={8} py={6}>
        {/* Balance */}
        <Box
          w="full"
          py={12}
          borderRadius="2xl"
          bg={projectedTab > 0 ? 'orange.subtle' : 'green.subtle'}
          textAlign="center"
        >
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="500"
            color={projectedTab > 0 ? 'orange.fg' : 'green.fg'}
            mb={3}
          >
            {hasPending ? 'Nouveau solde' : 'Solde actuel'}
          </Text>
          <Text
            fontSize={{ base: '7xl', md: '9xl' }}
            fontWeight="800"
            lineHeight="1"
            color={projectedTab > 0 ? 'orange.fg' : 'green.fg'}
          >
            {projectedTab.toFixed(2)}$
          </Text>

          {hasPending && (
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="600"
              mt={4}
              color={pendingTotal > 0 ? 'orange.fg' : 'green.fg'}
            >
              {pendingTotal > 0 ? '+' : ''}
              {pendingTotal.toFixed(2)}$ depuis {employee.tab.toFixed(2)}$
            </Text>
          )}
        </Box>

        {/* Actions grid */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={6} w="full">
          {/* Left: Coffee shortcut */}
          <Button
            flex={{ md: 1 }}
            h="auto"
            py={8}
            colorPalette="orange"
            onClick={() => addPending(1)}
            disabled={loading}
            fontWeight="600"
            fontSize={{ base: 'xl', md: '2xl' }}
          >
            Cafe - 1.00$
          </Button>

          {/* Right: Custom amount */}
          <HStack flex={{ md: 2 }} gap={3}>
            <Button
              h="auto"
              py={8}
              px={8}
              colorPalette="green"
              onClick={() => addPending(-parsedAmount)}
              disabled={loading || !hasValidAmount}
              fontWeight="700"
              fontSize={{ base: '2xl', md: '3xl' }}
            >
              −
            </Button>
            <Input
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="600"
              textAlign="center"
              py={8}
              h="auto"
              flex={1}
            />
            <Button
              h="auto"
              py={8}
              px={8}
              colorPalette="blue"
              onClick={() => addPending(parsedAmount)}
              disabled={loading || !hasValidAmount}
              fontWeight="700"
              fontSize={{ base: '2xl', md: '3xl' }}
            >
              +
            </Button>
          </HStack>
        </Flex>

        <Separator />

        {/* Save + Reset */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} w="full">
          <Button
            flex={{ md: 3 }}
            h="auto"
            py={6}
            colorPalette="blue"
            onClick={handleSave}
            loading={loading}
            fontWeight="600"
            fontSize={{ base: 'xl', md: '2xl' }}
          >
            {hasPending ? 'Sauvegarder' : 'Retour'}
          </Button>
          <Button
            flex={{ md: 1 }}
            h="auto"
            py={6}
            variant="outline"
            colorPalette="red"
            onClick={handleReset}
            loading={loading}
            fontWeight="600"
            fontSize={{ base: 'lg', md: 'xl' }}
          >
            Remettre a zero
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
