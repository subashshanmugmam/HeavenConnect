import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';
import '../../shared/providers/app_providers.dart';
import '../../shared/models/user_model.dart';
import '../../shared/widgets/app_shell.dart';
import '../../features/authentication/presentation/pages/login_screen.dart';

class AuthGuard {
  static FutureOr<String?> redirect(
      BuildContext context, GoRouterState state, WidgetRef ref) {
    final authState = ref.read(authenticationStateProvider);
    final currentLocation = state.uri.toString();

    // Define public routes that don't require authentication
    final publicRoutes = [
      RouteNames.splash,
      RouteNames.onboarding,
      RouteNames.login,
      RouteNames.register,
      RouteNames.forgotPassword,
      RouteNames.resetPassword,
      RouteNames.phoneVerification,
    ];

    // Define routes that require onboarding to be completed
    final onboardingRequiredRoutes = [
      RouteNames.dashboard,
      RouteNames.resources,
      RouteNames.map,
      RouteNames.chats,
      RouteNames.profile,
    ];

    // Check if current route is public
    final isPublicRoute = publicRoutes.any((route) =>
        currentLocation.startsWith(route) || currentLocation == route);

    // If loading, show splash
    if (authState.isLoading) {
      return RouteNames.splash;
    }

    // If onboarding not completed and trying to access protected route
    if (!authState.isOnboardingCompleted &&
        onboardingRequiredRoutes
            .any((route) => currentLocation.startsWith(route))) {
      return RouteNames.onboarding;
    }

    // If not authenticated and trying to access protected route
    if (!authState.isAuthenticated && !isPublicRoute) {
      return RouteNames.login;
    }

    // If authenticated and trying to access auth routes, redirect to dashboard
    if (authState.isAuthenticated &&
        authState.isOnboardingCompleted &&
        isPublicRoute &&
        currentLocation != RouteNames.splash) {
      return RouteNames.dashboard;
    }

    // No redirect needed
    return null;
  }
}

class OnboardingGuard {
  static FutureOr<String?> redirect(
      BuildContext context, GoRouterState state, WidgetRef ref) {
    final appState = ref.read(appStateProvider);
    final currentLocation = state.uri.toString();

    // If onboarding not completed and not on onboarding page
    if (!appState.isOnboardingCompleted &&
        currentLocation != RouteNames.onboarding) {
      return RouteNames.onboarding;
    }

    return null;
  }
}

class AdminGuard {
  static FutureOr<String?> redirect(
      BuildContext context, GoRouterState state, WidgetRef ref) {
    final authState = ref.read(authenticationStateProvider);

    // Check if user has admin role
    if (authState.user?.role != UserRole.admin &&
        authState.user?.role != UserRole.superAdmin) {
      return RouteNames.dashboard;
    }

    return null;
  }
}

class RouteGuards {
  static List<RouteBase> generateRoutes(WidgetRef ref) {
    return [
      // Authentication Routes (Public)
      GoRoute(
        path: RouteNames.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: RouteNames.onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: RouteNames.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: RouteNames.register,
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),

      // Protected Routes with Shell
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => AppShell(
          navigationShell: navigationShell,
        ),
        branches: [
          // Dashboard Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.dashboard,
                name: 'dashboard',
                builder: (context, state) => const DashboardScreen(),
              ),
            ],
          ),

          // Resources Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.resources,
                name: 'resources',
                builder: (context, state) => const ResourceDiscoveryScreen(),
                routes: [
                  GoRoute(
                    path: 'add',
                    name: 'add-resource',
                    builder: (context, state) => const AddResourceScreen(),
                  ),
                  GoRoute(
                    path: ':id',
                    name: 'resource-details',
                    builder: (context, state) {
                      final id = state.pathParameters['id']!;
                      return ResourceDetailsScreen(resourceId: id);
                    },
                  ),
                ],
              ),
            ],
          ),

          // Map Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.map,
                name: 'map',
                builder: (context, state) => const MapScreen(),
              ),
            ],
          ),

          // Chat Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.chats,
                name: 'chats',
                builder: (context, state) => const ChatListScreen(),
                routes: [
                  GoRoute(
                    path: ':id',
                    name: 'chat-details',
                    builder: (context, state) {
                      final id = state.pathParameters['id']!;
                      return ChatDetailsScreen(chatId: id);
                    },
                  ),
                ],
              ),
            ],
          ),

          // Profile Branch
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RouteNames.profile,
                name: 'profile',
                builder: (context, state) => const ProfileScreen(),
                routes: [
                  GoRoute(
                    path: 'edit',
                    name: 'edit-profile',
                    builder: (context, state) => const EditProfileScreen(),
                  ),
                  GoRoute(
                    path: 'settings',
                    name: 'settings',
                    builder: (context, state) => const SettingsScreen(),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ];
  }
}

// Placeholder screens that will be implemented later
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Onboarding Screen'),
      ),
    );
  }
}

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Register Screen'),
      ),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Dashboard Screen'),
      ),
    );
  }
}

class ResourceDiscoveryScreen extends StatelessWidget {
  const ResourceDiscoveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Resource Discovery Screen'),
      ),
    );
  }
}

class AddResourceScreen extends StatelessWidget {
  const AddResourceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Add Resource Screen'),
      ),
    );
  }
}

class ResourceDetailsScreen extends StatelessWidget {
  final String resourceId;

  const ResourceDetailsScreen({super.key, required this.resourceId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Resource Details Screen: $resourceId'),
      ),
    );
  }
}

class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Map Screen'),
      ),
    );
  }
}

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Chat List Screen'),
      ),
    );
  }
}

class ChatDetailsScreen extends StatelessWidget {
  final String chatId;

  const ChatDetailsScreen({super.key, required this.chatId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Chat Details Screen: $chatId'),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Profile Screen'),
      ),
    );
  }
}

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Edit Profile Screen'),
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Settings Screen'),
      ),
    );
  }
}
