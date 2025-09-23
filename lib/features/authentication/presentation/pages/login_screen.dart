import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:hcsub/features/authentication/presentation/providers/auth_providers.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final TextEditingController emailController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16.0),
            TextField(
              controller: passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 24.0),
            ElevatedButton(
              onPressed: () async {
                try {
                  await ref.read(signInWithEmailProvider(
                    emailController.text,
                    passwordController.text,
                  ).future);
                  // Navigate to dashboard or home screen on successful login
                  if (context.mounted) {
                    context.go('/dashboard');
                  }
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(e.toString())),
                    );
                  }
                }
              },
              child: const Text('Login'),
            ),
            const SizedBox(height: 16.0),
            TextButton(
              onPressed: () {
                context.go('/register');
              },
              child: const Text('Don\'t have an account? Register'),
            ),
            const SizedBox(height: 16.0),
            // Social login placeholders
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement Google Sign-in
              },
              icon: const Icon(Icons.g_mobiledata),
              label: const Text('Sign in with Google'),
            ),
            const SizedBox(height: 8.0),
            // Biometric login placeholder
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement Biometric Sign-in
              },
              icon: const Icon(Icons.fingerprint),
              label: const Text('Sign in with Biometrics'),
            ),
          ],
        ),
      ),
    );
  }
}
