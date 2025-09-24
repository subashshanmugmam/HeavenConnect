import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../constants/app_constants.dart';
import 'route_guards.dart';
import '../../features/authentication/presentation/pages/login_screen.dart';

part 'app_router.g.dart';

@riverpod
GoRouter goRouter(GoRouterRef ref) {
  return GoRouter(
    initialLocation: RouteNames.splash,
    debugLogDiagnostics: true,
    routes: [
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

      // Error Routes
      GoRoute(
        path: RouteNames.notFound,
        name: 'not-found',
        builder: (context, state) => const Scaffold(
          body: Center(
            child: Text('Page Not Found'),
          ),
        ),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Error: ${state.error}',
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go(RouteNames.splash),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
}

class AppShell extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const AppShell({
    super.key,
    required this.navigationShell,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(
            index,
            initialLocation: index == navigationShell.currentIndex,
          );
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2),
            label: 'Resources',
          ),
          NavigationDestination(
            icon: Icon(Icons.map_outlined),
            selectedIcon: Icon(Icons.map),
            label: 'Map',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_outlined),
            selectedIcon: Icon(Icons.chat),
            label: 'Chat',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
