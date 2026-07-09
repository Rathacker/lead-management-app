import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Center, Group, Paper, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { BrandMark } from "../components/layout/BrandMark";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center mih="100vh" p="md" bg="var(--mantine-color-body)">
      <Paper withBorder shadow="md" radius="lg" p="xl" w="100%" maw={400} component="form" onSubmit={handleSubmit}>
        <Group gap="sm" mb="lg">
          <BrandMark size={44} />
          <Box>
            <Text fw={700} fz="lg">
              Lead Manager
            </Text>
            <Text size="sm" c="dimmed">
              Sales pipeline workspace
            </Text>
          </Box>
        </Group>

        <Text fw={700} fz={22} mb={4}>
          Sign in
        </Text>
        <Text c="dimmed" size="sm" mb="lg">
          Welcome back. Enter your credentials to continue.
        </Text>

        <Stack gap="md">
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@company.com"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="••••••••"
          />
          {error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />} p="xs">
              {error}
            </Alert>
          )}
          <Button type="submit" fullWidth loading={loading} size="md">
            Sign in
          </Button>
          <Text ta="center" size="xs" c="dimmed">
            Seeded account · admin@example.com
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
