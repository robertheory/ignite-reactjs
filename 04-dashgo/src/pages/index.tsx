import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Input } from '../components/Form/Input';
import { Logo } from '../components/Header/Logo';

interface SignInFormProps {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('E-mail obrigatório')
    .email('O campo precisa ser um email válido'),
  password: yup.string().required('Senha obrigatória'),
});

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignIn: SubmitHandler<SignInFormProps> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('data', data);
  };

  return (
    <Flex w='100vw' h='100vh' align='center' justify='center'>
      <Box>
        <Logo />
      </Box>
      <Flex
        as='form'
        w='100%'
        maxW={360}
        bg='gray.800'
        p='8'
        borderRadius={8}
        flexDir='column'
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing='4'>
          <Input
            name='email'
            label='E-mail'
            type='email'
            error={formState.errors.email}
            {...register('email')}
          />
          <Input
            name='password'
            label='Senha'
            type='password'
            error={formState.errors.password}
            {...register('password')}
          />
        </Stack>
        <Button
          type='submit'
          mt='6'
          colorScheme='pink'
          size='lg'
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}
